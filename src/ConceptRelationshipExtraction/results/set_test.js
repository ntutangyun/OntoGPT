const lines = `
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
                Response
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
@ Car -> Follows -> Car
@ Car -> Passes -> Car
@ Car -> Overtakes -> Car
@ Car -> Collides with -> Car
@ Car -> Avoids -> Car
@ Car -> Blocks -> Car
@ Car -> Races -> Car
@ Car -> Crashes into -> Car
@ Car -> Parks next to -> Car
@ Car -> Tailgates -> Car
@ Car -> Signals to -> Car
@ Car -> Drives beside -> Car
@ Car -> Honks at -> Car
@ Car -> Changes lanes in front of -> Car
@ Car -> Changes lanes behind -> Car
@ Car -> Swerves to avoid -> Car
@ Car -> Tows -> Car
@ Car -> Pulls over for -> Car
@ Car -> Cuts off -> Car
@ Car -> Rear-ends -> Car
@ Car -> Drafts behind -> Car
@ Car -> Races against -> Car
@ Car -> Follows too closely to -> Car
@ Car -> Avoids collision with -> Car
@ Car -> Passes on the left/right of -> Car
@ Car -> Enters intersection with -> Car
@ Car -> Exits intersection with -> Car
@ Car -> Stops next to -> Car
@ Car -> Lets in -> Car
@ Car -> Gets stuck behind -> Car
@ Car -> Drives past -> Car
@ Car -> Signals to turn in front of -> Car
@ Car -> Signals to turn behind -> Car
@ Car -> Causes traffic jam with -> Car
@ Car -> Creates gap for -> Car
@ Car -> Merges in front of -> Car
@ Car -> Merges behind -> Car
@ Car -> Follows too closely behind -> Car
@ Car -> Comes into view of -> Car
@ Car -> Passes by -> Car
@ Car -> Drives next to -> Car
@ Car -> Gets cut off by -> Car
@ Car -> Avoids collision with -> Car


%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
                Response
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
@ Car -> Follows -> Car
@ Car -> Passes -> Car
@ Car -> Overtakes -> Car
@ Car -> Collides with -> Car
@ Car -> Drives beside -> Car
@ Car -> Races with -> Car
@ Car -> Blocks -> Car
@ Car -> Signals to -> Car
@ Car -> Tailgates -> Car
@ Car -> Changes lanes in front of -> Car
@ Car -> Changes lanes behind -> Car
@ Car -> Parks next to -> Car
@ Car -> Honks at -> Car
@ Car -> Swerves to avoid -> Car

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
                Response
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
@ Car -> Overtakes -> Car
@ Car -> Follows -> Car
@ Car -> Collides with -> Car
@ Car -> Passes by -> Car
@ Car -> Changes lane in front of -> Car
@ Car -> Changes lane behind -> Car
@ Car -> Accelerates past -> Car
@ Car -> Decelerates behind -> Car
@ Car -> Parks next to -> Car
@ Car -> Signals to -> Car
@ Car -> Honks at -> Car
@ Car -> Races against -> Car

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
                Response
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
There are several possible relationships (predicates) between Car (subject) and Car (object) in the given ontology. However, since we are not allowed to involve any new concepts other than Car, the only possible relationship is:

@ Car -> Follows -> Car. (when one car is following another car)

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
                Response
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
@ Car -> Follows -> Car
@ Car -> Passes -> Car
@ Car -> Overtakes -> Car
@ Car -> Gets passed by -> Car
@ Car -> Collides with -> Car
@ Car -> Stops behind -> Car
@ Car -> Drives beside -> Car
@ Car -> Changes lane in front of -> Car
@ Car -> Changes lane behind -> Car
@ Car -> Honks at -> Car
@ Car -> Signals to -> Car
@ Car -> Races with -> Car
@ Car -> Avoids -> Car
@ Car -> Cuts off -> Car
@ Car -> Tailgates -> Car
@ Car -> Parks next to -> Car
@ Car -> Blocks -> Car
@ Car -> Navigates around -> Car
`;

console.log(lines);

const relationshipSet = new Set();

const linesArray = lines.split("\n");
for (let i = 0; i < linesArray.length; i++) {
    if (linesArray[i].startsWith("@")) {
        relationshipSet.add(linesArray[i].split("->")[1].trim());
    }
}

console.log(Array.from(relationshipSet).sort());



