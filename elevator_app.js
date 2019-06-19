import { Subject } from 'rxjs'
import ReactiveElevator from './model/ReactiveElevator';

const elevatorRequestSource = new Subject();

const elevatorOne = new ReactiveElevator(elevatorRequestSource, 1, 5);

elevatorRequestSource.next()