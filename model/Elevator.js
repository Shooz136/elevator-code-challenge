/**
 * Represents The Operations Of An Elevator
 */
export default class Elevator {
/**
 * Default Constructor
 */
  constructor() {
    /* These Aren't Actually Private, We'll Leave That Out Of Scope For Now */
    this._id = 1;
    this._topFloor = 0;
    this._currentFloor = 0;
    this._occupied = false;
    this._trips = 0;
    this._floors = 0;
    this._inServiceMode = false;
    this._respondingFloors = [];
    this._destinationFloors = [];
  }

  /**
    *
    */
  get id() {
    return this._id;
  }

  /**
   *
   */
  get topFloor() {
    return this._getTopFloor;
  }

  /**
   *
   */
  get currentFloor() {
    return this._currentFloor;
  }

  /**
   *
   */
  get occupied() {
    return this._occupied;
  }

  /**
   *
   */
  get trips() {
    return this._trips;
  }

  /**
   *
   */
  get floors() {
    return this._floors;
  }

  /**
   *
   */
  get isInServiceMode() {
    return this._inServiceMode;
  }

  /**
   * Open The Doors Of The Elevator, And Announce
   * I'm Assuming They Don't Need Manually Closed..
   */
  openDoors() {
    console.log('Doors Opening!');
  }

  /**
   * Announcement When Floor Is Passed
   */
  announceFloor() {
    console.log('Reached Floor: ' + this._currentFloor );
  }

  /**
   * Traverse From Current Foor To Target Floor
   * @param {int} targetFloor
   */
  traverseToFloor(targetFloor) {
    if (targetFloor < 0 || targetFloor > this._topFloor) {
      console.log('Invalid Floor!');
      // eslint-disable-next-line no-throw-literal
      throw ('Invalid Floor:' + targetFloor);
    }
  }
}
