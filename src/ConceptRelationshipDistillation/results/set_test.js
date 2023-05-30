const lines = `
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
                Response
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
@ FireTruck -> Approaches -> TrafficLight.
@ FireTruck -> Stops at -> TrafficLight.
@ FireTruck -> Ignores -> TrafficLight.
@ FireTruck -> Affects -> TrafficLight (e.g. changes the light to green through an emergency signal).

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
                Response
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
@ FireTruck -> Approaches -> TrafficLight.
@ FireTruck -> Stops at -> TrafficLight.
@ FireTruck -> Activates -> TrafficLight.
@ FireTruck -> Obeys -> TrafficLight.
@ FireTruck -> Ignores -> TrafficLight.
@ FireTruck -> Damages -> TrafficLight.

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
                Response
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
@ FireTruck -> Approaches -> TrafficLight.
@ FireTruck -> Passes -> TrafficLight.
@ FireTruck -> Stops at -> TrafficLight.
@ FireTruck -> Ignores -> TrafficLight (if it's an emergency situation).
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
                Response
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
@ FireTruck -> Approaches -> TrafficLight.
@ FireTruck -> Passes -> TrafficLight.
@ FireTruck -> Stops at -> TrafficLight (if the traffic light is red).
@ FireTruck -> Ignores -> TrafficLight (if it is necessary to respond to an emergency situation).
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
                Response
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
@ FireTruck -> Approaches -> TrafficLight.
@ FireTruck -> Stops at -> TrafficLight.
@ FireTruck -> Proceeds after stopping at -> TrafficLight.
@ FireTruck -> Changes direction at -> TrafficLight.
@ FireTruck -> Ignores -> TrafficLight (in case of emergency).
@ FireTruck -> Turns on -> TrafficLight (to clear the way).
`;

console.log(lines);

const relationshipSet = new Set();

const linesArray = lines.split("\n");
for (let i = 0; i < linesArray.length; i++) {
    if (linesArray[i].startsWith("@")) {
        relationshipSet.add(linesArray[i].split("->")[1].trim());
    }
}

console.log(Array.from(relationshipSet).sort().join(", "));



