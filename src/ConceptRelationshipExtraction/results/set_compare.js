let set1 = "Accelerates past, Blocks, Brakes suddenly in front of, Changes lane, Changes lane behind, Changes lane in front of, Changes lane to, Collides into, Collides with, Competes with, Cooperates with, Crosses path with, Cuts off, Decelerates behind, Drafts behind,Drives alongside, Drives in front of, Drives next to, Follows, Gives way to, Honks at,Overtakes, Parks behind, Parks in front of, Parks next to, Passes, Pulls over for, Races,Races with, Shares the road with, Signals to, Stops behind, Swerves to avoid, Tailgates,Turns left in front of, Turns right in front of, Yields to";

set1 = new Set((set1.split(",").map((item) => item.trim())));

let set2 = "Accelerates past, Avoids, Avoids collision with, Blocks, Causes traffic jam with, Changes lane behind, Changes lane in front of, Changes lanes behind, Changes lanes in front of,Collides with, Comes into view of, Competes with, Crashes into, Creates gap for, Cuts off,Decelerates behind, Drafts behind, Drives beside, Drives next to, Drives past,Enters intersection with, Exits intersection with, Follows, Follows too closely behind,Follows too closely to, Gets cut off by, Gets passed by, Gets stuck behind, Honks at, Lets in, Merges behind, Merges in front of, Navigates around, Overtakes, Parks next to, Passes, Passes by, Passes on the left/right of, Pulls over for, Races, Races against, Races with,Rear-ends, Signals to, Signals to turn behind, Signals to turn in front of, Stops behind,Stops next to, Swerves to avoid, Tailgates, Tows";
set2 = new Set(set2.split(",").map((item) => item.trim()));

// get those in set1 but not in set2
let diff1 = new Set([...set1].filter(x => !set2.has(x)));
console.log(diff1);

// get those in set2 but not in set1
let diff2 = new Set([...set2].filter(x => !set1.has(x)));
console.log(diff2);