export function extractDigraphString(lines) {
    console.log(lines);
    let DOT_lines = [];
    let inDOT = false;
    for (let line of lines) {
        line = line.trim();
        console.log(line);
        if (line.startsWith("digraph") && line.endsWith("{")) {
            DOT_lines = [];
            inDOT = true;
            DOT_lines.push(line);
            console.log(`adding ${line}`);
            continue;
        }
        if (inDOT) {
            DOT_lines.push(line);
            if (line.startsWith("}")) {
                inDOT = false;
            }
        }
    }
    return DOT_lines.join("\n");
}

export function extractDotHistory(lines) {
    console.log(lines);
    const dotHistory = [];

    let DOT_lines = [];
    let inDOT = false;
    for (let line of lines) {
        line = line.trim();
        console.log(line);
        if (line.startsWith("digraph") && line.endsWith("{")) {
            DOT_lines = [];
            inDOT = true;
            DOT_lines.push(line);
            console.log(`adding ${line}`);
            continue;
        }
        if (inDOT) {
            DOT_lines.push(line);
            if (line.startsWith("}")) {
                inDOT = false;
                dotHistory.push(DOT_lines.join("\n"));
            }
        }
    }
    return dotHistory;
}

export function extractRelationship(lines) {
    console.log(lines);
    const relationshipDict = {};

    let inResponse = false;
    for (let line of lines) {
        line = line.trim();
        console.log(line);

        if (line === "Response") {
            inResponse = true;
            continue;
        } else if (line === "Prompt") {
            inResponse = false;
            continue;
        }

        if (!inResponse) {
            continue;
        }

        if (line.startsWith("@") && line.includes("->")) {
            if (line.endsWith(".")) {
                line = line.substring(0, line.length - 1);
            }

            const parts = line.split("->").map((part) => part.trim());
            const concept1 = parts[0].substring(1).trim();
            const concept2 = parts[2].trim();
            const relationship = parts[1].trim();
            const key = `${concept1}->${concept2}`;
            if (!relationshipDict.hasOwnProperty(key)) {
                relationshipDict[key] = new Set();
            }
            relationshipDict[key].add(relationship);
        }
    }
    return relationshipDict;
}