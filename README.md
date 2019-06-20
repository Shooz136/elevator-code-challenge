# elevator-code-challenge

This is a Javascript solution to the elevator challenge.

All elevators subscribe to an RxJS subject, which pushes ElevatorRequests to each elevator, simulating someone pushing an elevator button on a specific floor, and then requesting to go to another floor.

Each ElevatorRequest contains another subject, allowing all elevators to communicate with one another about the request, via an ElevatorResponse object.  Each elevator sends its distance from the target floor, and each elevator independently decides whether or not to respond.

Implementing in this manner forgoes the need for a centralized 'Elevator Manager' and may allow for easier scaling.  
Because we've implemented with RxJS, it would potentially be possible to scale across multiple servers or containers by connecting all sources via a web service or web sockets - as long as all elevators are receiving communication from all, or even most sources, you could scale up or down at will and tolerate individual faults without losing all functionality. 

## Getting Started

These instructions will build and install a copy of the project on your local machine for development and testing purposes.

### Prerequisites

Node.js & Node Package Manager (NPM) - https://nodejs.org/en/download/
Rollup installed globally - https://github.com/rollup/rollup

### Installing

First, clone the repository locally.

```
git clone https://github.com/Shooz136/elevator-code-challenge.git
```

Then, navigate to the cloned repository and install your dependencies - make sure dev dependencies install as well.

```
npm install
```

Then, run the Rollup build.

```
rollup -c
```

Then, run the demo application.
```
node elevator_bundle.js
```


## Built With

* [Node.js](https://nodejs.org/) - Javascript Runtime
* [Node Package Manager](https://www.npmjs.com/) - Dependency Management
* [RxJS](https://rxjs-dev.firebaseapp.com/) - Reactive Extensions Library for JavaScript
* [Rollup](https://github.com/rollup/rollup) - Support For ES6 Modules & Classes

## Authors

* **Ben Shoemaker** 



