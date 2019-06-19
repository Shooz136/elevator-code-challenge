import Elevator from './Elevator';
import ElevatorResponse from './ElevatorResponse';

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
      const distanceToFloor = Math.abs(this._currentFloor - floorRequest.sourceFloor);
      console.log('Elevator: ' + this._id + 'My Distance: ' + distanceToFloor);
      /* Here, We'll Listen For Any Other Elevators Responding To The Request */
      floorRequest.commSubject.subscribe((elevatorReponse) => {
        console.log('Response: Elevator: ' + elevatorReponse.elevatorID + ' Distance: ' + elevatorReponse.distanceToFloor);
      });

      /* We'll Send Our Own Distance To The Other Elevators */
      const myResponse = new ElevatorResponse(this._id, this._trips, distanceToFloor);
      floorRequest.commSubject.next(myResponse);
    });
  }
}
