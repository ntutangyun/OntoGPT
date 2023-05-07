

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

export const InstructionTemplate = `In the ontology context, describe the following concepts:
`;

export const FormatTemplate = `Format your response in the following way. Keep concept name and description in one line. \n@ concept name @ concept description @`;

export const ResponseTemplate = `@ Aggressive @ Refers to a type of driver behavior that involves reckless or hostile actions towards other road users, such as speeding, tailgating, and weaving through traffic. Aggressive driving increases the risk of accidents and can lead to road rage incidents.
@ AirQuality @ Refers to the level of pollutants and other harmful particles present in the air, which can affect the health and safety of road users. Poor air quality can result from emissions from vehicles and other sources, and can lead to respiratory problems and other health issues.
@ Ambulance @ Refers to a type of
     ...`;

