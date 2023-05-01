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