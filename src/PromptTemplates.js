export const DomainContextTemplate = `I have a road driving scenario ontology as below (in DOT format).

digraph Ontology {
     EnvironmentalConditions;
     RoadTopologyAndTrafficInfrastructure -> Junction;
     TrafficParticipantAndBehavior;
     TrafficParticipantAndBehavior;
}
`;

export const ConceptHierarchyExtractionInstructionTemplate = `Add 10 new relevant concepts, terms or entities to the ontology.
Each class has only one parent class.
You should merge duplicated concepts.
You should delete concepts irrelevant to road driving scenarios.
You should improve the ontology structure.
`;

export const ConceptHierarchyExtractionFormatTemplate = `Output the new ontology in DOT format.
The parent class and child class should be arranged as: parent class -> child class.`;