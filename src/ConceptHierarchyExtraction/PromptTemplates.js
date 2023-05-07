export const HierarchyTemplate = `digraph Ontology {
     graph [rankdir = LR];
     EnvironmentalConditions;
     RoadTopologyAndTrafficInfrastructure -> Junction;
     TrafficParticipantAndBehavior;
}`;

export const InstructionTemplate = `Add 10 new relevant concepts, terms, or entities to the ontology.
Each class has only one parent class.
You should merge duplicated concepts.
You should delete concepts irrelevant to road driving scenarios.
You should improve the ontology structure.
`;

export const FormatTemplate = `Output the new ontology in DOT format.
The parent class and child class should be arranged as: parent class -> child class.`;

export const ResponseTemplate = `After reviewing the given ontology and considering road driving scenarios, I have added 10 new concepts as follows:

digraph Ontology {
     EnvironmentalConditions -> Weather;
     EnvironmentalConditions -> TimeOfDay;
     EnvironmentalConditions -> Lighting;
     RoadTopologyAn
     ...`;
