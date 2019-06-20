import {ReplaySubject} from 'rxjs';

/**
 * Represents A Request To Any Subscribed Elevators
 */
export default class ElevatorRequest {
  /**
     *
     * @param {*} sourceFloor
     * @param {*} targetFloor
     */
  constructor(sourceFloor, targetFloor) {
    this._sourceFloor = sourceFloor;
    this._targetFloor = targetFloor;
    this._commSubject = new ReplaySubject();
  }

  /**
   *
   */
  get sourceFloor() {
    return this._sourceFloor;
  }

  /**
   *
   */
  get targetFloor() {
    return this._targetFloor;
  }

  /**
   *
   */
  get commSubject() {
    return this._commSubject;
  }
}
