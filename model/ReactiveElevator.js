import Elevator from './Elevator';
import ElevatorResponse from './ElevatorResponse';
import {onErrorResumeNext, EMPTY, zip, timer, from} from 'rxjs';
import {timeout, reduce} from 'rxjs/operators';


/**
 * This Type Of Elevator Uses RxJS To Handle Dispatch In A
 * Decentralized Manner
 */
export default class ReactiveElevator extends Elevator {
  /**
     *
     * @param {*} floorRequestSubject
     * @param {*} id
     * @param {*} topFloor
     */
  constructor(floorRequestSubject, id, topFloor) {
    super();
    this._topFloor = topFloor;
    this._floorRequestSubject = floorRequestSubject;
    this._id = id;

    /* Here, We'll Listen For Any Elevator Requests Coming Through The Source */
    this._floorRequestSubject.subscribe((floorRequest)=>{
      console.log('Elevator: ' + this._id + ' Source: ' + floorRequest.sourceFloor + ' Target: ' + floorRequest.targetFloor);
      const myDistanceToFloor = Math.abs(this._currentFloor - floorRequest.sourceFloor);
      console.log('Elevator: ' + this._id + ' My Distance: ' + myDistanceToFloor);

      /* This Will Allow Us To Timeout After A Few MS...
       * Because This Is Decentralized, We Don't Know How Many Elevators will be
       * Responding... This isn't great, and will require some thought
       * Timeout will throw an erorr, so we can use 'onErrorResumeNext'to
       * suppress it, and complete cleanly */
      onErrorResumeNext(
          floorRequest.commSubject.pipe(timeout(100)),
          EMPTY
      ).pipe(
          /* This Will Allow Us To Get All The Values At Once.. */
          reduce((array, value) => {
            array.push(value);
            return array;
          }, [])
      ).subscribe((elevatorReponses) => {
        if (this.determineResponseNecessary(elevatorReponses, myDistanceToFloor)) {
          console.log('Elevator:' + this._id + 'I have the lowest ID, I should repsond');
          this._respondingFloors.push(floorRequest.sourceFloor);
          this._destinationFloors.push(floorRequest.destinationFloor);
          /* Find The Next Floor We Need To Go To.. Either Source Or Destination */
          const nextFloor = this._respondingFloors.concat(this._destinationFloors).sort()[0];
          console.log('Elevator:' + this._id + 'Travelling To: ' + nextFloor);
          this.traverseToFloor(nextFloor);
        } else {
          console.log('Elevator:' + this._id + 'Someone Else Should Respond, I Dont Need To');
        }
      });

      /* We'll Send Our Own Distance To The Other Elevators */
      const myResponse = new ElevatorResponse(this._id, this._trips, myDistanceToFloor);
      floorRequest.commSubject.next(myResponse);
    });
  }

  /**
   * Determine If I Should Respond To The Request
   * @param {*} allDistances
   * @param {*} myDistanceToFloor
   * @return {boolean}
   */
  determineResponseNecessary(allDistances, myDistanceToFloor) {
    let shouldRespond = true;

    /* Find Minimum Distance */
    const minDistance = allDistances.reduce((previousVal, currentVal) => {
      if (currentVal.distanceToFloor && currentVal.distanceToFloor <= previousVal) {
        return currentVal.distanceToFloor;
      } else {
        return previousVal;
      }
    }, 100000000000);

    console.log('Elevator:' + this._id + ' Min Distance:' + minDistance);

    /* If I Have The Minimum Possible Distance, I Could Potentially Respond */
    if (minDistance === myDistanceToFloor) {
      console.log('I Should Potentially Respond!');

      /* Find All Responses Where Its Equal To My Distance.. All 'Competitor' Elevators */
      const possibleResponseElevators = allDistances.filter((val) => val.distance === myDistanceToFloor);

      /* If Someone Else Has A Higher ID.. Don't Respond, Its Their Responsibility */
      possibleResponseElevators.forEach((val) => {
        if (val.elevatorID > this._id) {
          shouldRespond = false;
        }
      });
    } else {
      /* I Wasn't The Lowest.. No Need To Respond */
      shouldRespond = false;
    }
    return shouldRespond;
  }

  /**
   * Traverse From Current Foor To Target Floor
   * Try To Add Some Time Between Floors, For Realism's Sake
   * @param {int} targetFloor
   */
  traverseToFloor(targetFloor) {

    super.traverseToFloor(targetFloor);
    console.log('Elevator: ' + this._id + 'Traversing To Floor ' + targetFloor);


    const floors = [];
    for (let i = this._currentFloor+1; i <= targetFloor; i++) {
      floors.push(i);
    }

    const floorsObs = zip(
        from(floors),
        timer(0, 1000),
        (val, i) => val
    );

    floorsObs.subscribe((nextFloor) => {
      /* Increment The Floor */
      this._currentFloor++;

      /* Announce We've Reached That Floor */
      this.announceFloor();

      /* Increment The Number Of Floors We've Reached */
      this._floors++;

      /* If We've Reached A Destination, Open The Doors, And Increment A Trip */
      if (this._destinationFloors.includes(nextFloor) || this._respondingFloors.includes(nextFloor)) {
        this.openDoors();
        this._trips++;
      }

      /* This Isn't Necessairly Correct */
      if (this._destinationFloors.includes(nextFloor)) {
        console.log('This Is A Destination Floor');
        this._occupied = false;
        this._destinationFloors = this._destinationFloors.filter((floor) => {
          return floor != nextFloor;
        });
      }

      if (this._respondingFloors.includes(nextFloor)) {
        console.log('This Is A Response Floor');
        this._occupied = true;
        this._respondingFloors = this._respondingFloors.filter((floor) => {
          return floor != nextFloor;
        });
      }

      /* If We've Hit The Target Floor, Find The Next Target */
      if (nextFloor == targetFloor) {
        console.log('We Hit Our Target Floor');
        this._trips++;
        console.log(this._respondingFloors.length);
        console.log(this._destinationFloors.length);
        console.log(this._respondingFloors.concat(this._destinationFloors).length);
        /* Find The Next Floor We Need To Go To.. Either Source Or Destination */
        const nextFloorAfterThis = this._respondingFloors.concat(this._destinationFloors).sort()[0];
        console.log('Next Floor After This: ' + nextFloorAfterThis);


        /* Allow This Method To Complete, And Start A New 'Thread' */
        setTimeout(() => {
          this.traverseToFloor(nextFloorAfterThis);
        }, 0);
      }
    });
  }
}
