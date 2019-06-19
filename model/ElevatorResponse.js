/**
 * Represents A Single Elevator Responding To A Request
 */
export default class ElevatorResponse {
  /**
     * Default Constructor - Send ID, Trips, and Distance To Floor
     * Trips & ID Can Be Used For Tie-Breaking
     * @param {*} elevatorID
     * @param {*} elevatorTrips
     * @param {*} distanceToFloor
     */
  constructor(elevatorID, elevatorTrips, distanceToFloor) {
    this._elevatorID = elevatorID;
    this._elevatorTrips = elevatorTrips;
    this._distanceToFloor = distanceToFloor;
  }

  /**
   * 
   */
  get elevatorID() {
    return this._elevatorID;
  }
  
  /**
   * 
   */
  get elevatorTrips() {
    return this._elevatorTrips;
  }

  /**
   * 
   */
  get distanceToFloor() {
    return this._distanceToFloor;
  }
}
