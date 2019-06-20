import Elevator from './Elevator';
import ElevatorResponse from './ElevatorResponse';
import {onErrorResumeNext, EMPTY} from 'rxjs';
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
        elevatorReponses.forEach((arrayValue) => {
          console.log('Elevator ' + this._id + 'recieved ID:' + arrayValue.elevatorID + ' Distance:' + arrayValue.distanceToFloor);
        });

        /* Find Minimum Distance */
        const minDistance = elevatorReponses.reduce((previousVal, currentVal) => {
         console.log('Cur' + currentVal.distanceToFloor + ' Prev:' + previousVal);
          if (currentVal.distanceToFloor && currentVal.distanceToFloor <= previousVal) {
            console.log('Replacing!');
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
          const possibleResponseElevators = elevatorReponses.filter((val) => val.distance === myDistanceToFloor);

          /* If Someone Else Has A Higher ID.. Don't Respond, Its Their Responsibility */
          let shouldRespond = true;
          possibleResponseElevators.forEach((val) => {
            if (val.id > this._id) {
              shouldRespond = false;
            }
          });

          if (shouldRespond) {
            console.log('Elevator:' + this._id + 'I have the highest ID, I should repsond');
            this._respondingFloors.push(floorRequest.sourceFloor);
          } else {
            console.log('Elevator:' + this._id + 'Someone Else Has A Higher ID, I Dont Need To Respond');
          }
        } else {
          console.log('I Dont Need To Respond');
        }

        
      });

      /* We'll Send Our Own Distance To The Other Elevators */
      const myResponse = new ElevatorResponse(this._id, this._trips, myDistanceToFloor);
      floorRequest.commSubject.next(myResponse);
    });
  }
}
