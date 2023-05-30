export const DomainContextTemplate = `I have a road driving scenario ontology as below (in DOT format).`;

export const HierarchyTemplate = `digraph Ontology {
graph [rankdir = LR];
Scenario -> Environment;
Scenario -> Infrastructure;
Scenario -> Participants;
Environment -> Weather;
Environment -> Lighting;
Environment -> AirQuality;
Infrastructure -> RoadType;
Infrastructure -> RoadObjects;
Infrastructure -> RoadFurniture;
Infrastructure -> RoadCondition;
Infrastructure -> RoadMarkings;
RoadType -> Highway;
RoadType -> CityStreet;
RoadType -> RuralRoad;
RoadObjects -> Barrier;
RoadObjects -> Guardrail;
RoadObjects -> Pothole;
RoadObjects -> Debris;
RoadFurniture -> Sign;
RoadFurniture -> TrafficLight;
RoadFurniture -> Roundabout;
RoadCondition -> Slippery;
RoadCondition -> Uneven;
Participants -> Driver;
Participants -> Vehicle;
Participants -> Pedestrian;
Driver -> Aggressive;
Driver -> Defensive;
Driver -> Impaired;
Driver -> Inexperienced;
Impaired -> DrunkDriving;
Impaired -> DistractedDriving;
Inexperienced -> Learner;
Inexperienced -> ElderlyDriver;
Vehicle -> Car;
Vehicle -> Motorcycle;
Vehicle -> Truck;
Vehicle -> Bus;
Vehicle -> Emergency;
Emergency -> Ambulance;
Emergency -> FireTruck;
Emergency -> PoliceCar;
Pedestrian -> Human;
Pedestrian -> Animal;
Pedestrian -> Bicyclist;
RoadMarkings -> LaneLines;
RoadMarkings -> Crosswalks;
RoadMarkings -> Arrows;
RoadMarkings -> StopLines;
Sign -> RegulatorySign;
Sign -> WarningSign;
Sign -> InformationalSign;
RegulatorySign -> SpeedLimitSign;
WarningSign -> DeerCrossingSign;
InformationalSign -> ExitSign;
}`;

export const InstructionTemplate = `In the ontology context, list all possible relationships (predicates) between {} subject and the other is object: 
`;

export const InstructionTemplateGen = (subject, object) => `In the ontology context, list all possible relationships (predicates) between ${subject} (subject) and ${object} (object): 
Do not involve new concepts other than ${subject} as the subject and ${object} as the object.
`;

export const FormatTemplate = `Format your responses in lines of the following format: 
@ subject -> predicate -> object.
Start each line with @.
For example, @ Vehicle -> Drives on -> Road`;

export const ResponseTemplate = `@ Vehicle -> Moves on -> CityStreet
@ Vehicle -> Parks on -> CityStreet (if allowed)
...`;


export const PromptSeparator = `%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
                Prompt
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
`;

export const ResponseSeparator = `
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
                Response
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
`;