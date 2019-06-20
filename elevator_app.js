import { Subject } from 'rxjs'
import ReactiveElevator from './model/ReactiveElevator';
import ElevatorRequest from './model/ElevatorRequest';

const elevatorRequestSource = new Subject();

const elevatorOne = new ReactiveElevator(elevatorRequestSource, 1, 5, 0);
//const elevatorTwo = new ReactiveElevator(elevatorRequestSource, 2, 5, 4);

const requestOne = new ElevatorRequest(1, 5);
elevatorRequestSource.next(requestOne);
