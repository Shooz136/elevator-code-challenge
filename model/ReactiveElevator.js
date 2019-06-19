import Elevator from './Elevator';

/**
 * This Type Of Elevator Uses RxJS To Handle Dispatch In A
 * Decentralized Manner
 */
export default class ReactiveElevator extends Elevator {
  /**
     *
     * @param {*} floorRequestSubject
     * @param {*} id
     */
  constructor(floorRequestSubject, id, topFloor) {
    super();
    this._topFloor = topFloor;
    this._floorRequestSubject = floorRequestSubject;
    this._id = id;

    this.floorRequestSubject.subscribe((val)=>{
      console.log('Value: ' + val);
    });
  }
}
