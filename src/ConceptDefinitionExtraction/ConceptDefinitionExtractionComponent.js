import React, {useEffect, useState} from "react";
import {Button, Col, Form, Layout, message, Modal, Row, Table, Tabs} from "antd";
import {serializeGraph} from "@thi.ng/dot";

import * as d3 from "d3";
import * as d3Graphviz from "d3-graphviz";
import * as dotparser from "dotparser";

import {Input} from "antd";
import {
    FormatTemplate,
    InstructionTemplate,
    ResponseTemplate,
    HierarchyTemplate,
} from "./PromptTemplates";
import {DomainContextTemplate, PromptSeparator, ResponseSeparator} from "../Common/PromptTemplates";
import {colStyle, CommonTextAreaStyle, contentStyle, graphStyle} from "../Common/Styles";


const {TextArea} = Input;
const {Content} = Layout;

function extractConceptFromAst(ast) {
    console.log(ast);
    const conceptDescriptionDict = {};
    const edges = ast[0].children.filter((stmt) => stmt.type === "edge_stmt");
    edges.forEach((edge) => {
        const [from, to] = edge.edge_list;
        if (from.type === "node_id") {
            if (!conceptDescriptionDict.hasOwnProperty(from.id)) {
                conceptDescriptionDict[from.id] = null;
            }
        }
        if (to.type === "node_id") {
            if (!conceptDescriptionDict.hasOwnProperty(to.id)) {
                conceptDescriptionDict[to.id] = null;
            }
        }
    });

    const nodes = ast[0].children.filter(stmt => stmt.type === "node_stmt");
    nodes.forEach(node => {
        if (!conceptDescriptionDict.hasOwnProperty(node.node_id.id)) {
            conceptDescriptionDict[node.node_id.id] = null;
        }
    });
    return conceptDescriptionDict;
};

function prepareTableData(conceptDict) {
    const tableData = [];
    Object.keys(conceptDict).forEach((concept) => {
        tableData.push({
            key: concept,
            concept: concept,
            definition: conceptDict[concept]
        });
    });
    return tableData;
}

function insertNewLineEveryNWords(input_string, n) {
    const all_words = input_string.split(" ");
    let res = "";
    let i = 1;
    for (const word of all_words) {
        if (i === n) {
            res += word + "\n";
            i = 0;
        } else {
            res += word + " ";
        }
        i += 1;
    }
    return res;
}

const definitionTableColumns = [
    {
        title: "Concept",
        dataIndex: "concept",
        key: "col-concept",
    },
    {
        title: "Definition",
        dataIndex: "definition",
        key: "col-definition",
    }
];

export default function ConceptDefinitionExtractionComponent() {
    const [domainContextInput, setDomainContextInput] = useState(DomainContextTemplate);
    const [hierarchyInput, setHierarchyInput] = useState(HierarchyTemplate);
    const [instructionInput, setInstructionInput] =
        useState(InstructionTemplate);
    const [conceptInput, setConceptInput] = useState("");
    const [formatInput, setFormatInput] =
        useState(FormatTemplate);
    const [generatedPrompt, setGeneratedPrompt] = useState("");
    const [historyString, setHistoryString] = useState("");
    const [responseModalOpen, setResponseModalOpen] = useState(false);
    const [conceptDict, setConceptDict] = useState({});
    const [conceptDefinitionTableData, setConceptDefinitionTableData] = useState([]);
    const [hierarchyWithDefinition, setHierarchyWithDefinition] = useState(HierarchyTemplate);

    const [promptEngineeringTabKey, setPromptEngineeringTabKey] = useState("prompt");

    useEffect(() => {
        console.log("called");
        // hierarchy has been manually edited. update the concept definition table
        const ast = dotparser(hierarchyInput);
        const newConceptDict = extractConceptFromAst(ast);
        mergeConceptDict(newConceptDict);
    }, [hierarchyInput]);

    useEffect(() => {
        try {
            d3.select("#graph-definition").graphviz({fit: true})
                .renderDot(hierarchyWithDefinition)
                .transition(function () {
                    return d3.transition()
                        .ease(d3.easeLinear)
                        .duration(100);
                });
        } catch (error) {
            console.log(error);
        }
    }, [hierarchyWithDefinition]);

    useEffect(() => {
        if (conceptDict) {
            setConceptDefinitionTableData(prepareTableData(conceptDict));
            updateHierarchyWithDefinition();
        }
    }, [conceptDict]);

    useEffect(() => {
        setGeneratedPrompt(domainContextInput + "\n\n"
            + hierarchyInput + "\n\n"
            + instructionInput + "\n"
            + conceptInput + "\n\n"
            + formatInput);
    }, [domainContextInput,
        instructionInput,
        conceptInput,
        formatInput,
        hierarchyInput
    ]);

    const mergeConceptDict = (newConceptDict) => {
        const mergedConceptDict = {...newConceptDict};
        Object.keys(conceptDict).forEach((concept) => {
            if (newConceptDict.hasOwnProperty(concept)) {
                mergedConceptDict[concept] = conceptDict[concept];
            }
        });
        setConceptDict(mergedConceptDict);
    };

    const onCopyPromptGenerated = async () => {
        await setPromptEngineeringTabKey("prompt");

        const textarea = document.getElementById("textarea-prompt-generated");
        textarea.select();
        document.execCommand("copy");
        message.success("Copied");

        setHistoryString(historyString + "\n" + PromptSeparator + generatedPrompt);
    };

    const promptEngineeringTabs = [
        {
            key: "context",
            label: `Context`,
            children: <TextArea style={CommonTextAreaStyle} value={domainContextInput}
                                onChange={e => setDomainContextInput(e.target.value)}/>,
        },
        {
            key: "Hierarchy",
            label: `Hierarchy`,
            children: <TextArea style={CommonTextAreaStyle} value={hierarchyInput}
                                onChange={e => setHierarchyInput(e.target.value)}/>
        },
        {
            key: "instruction",
            label: `Instruction`,
            children: <TextArea style={CommonTextAreaStyle}
                                value={instructionInput}
                                onChange={e => setInstructionInput(e.target.value)}/>,
        },
        {
            key: "concepts",
            label: `Concepts`,
            children: <TextArea style={CommonTextAreaStyle} value={conceptInput}
                                onChange={e => setConceptInput(e.target.value)}/>,
        },
        {
            key: "format",
            label: `Format`,
            children: <TextArea style={CommonTextAreaStyle} value={formatInput}
                                onChange={e => setFormatInput(e.target.value)}/>,
        },
        {
            key: "prompt",
            label: `Prompt`,
            children: <div>
                <TextArea style={CommonTextAreaStyle}
                          readOnly={true}
                          value={generatedPrompt}
                          id={"textarea-prompt-generated"}>
                </TextArea>
            </div>
        }
    ];

    const onAddResponse = (res) => {
        setHistoryString(historyString + "\n" + ResponseSeparator + res.response + "\n");
        message.success("Response added");
        setResponseModalOpen(false);
    };

    const AddResponseFormModal = ({open, onAddResponse, onCancel}) => {
        const [form] = Form.useForm();
        return (
            <Modal
                open={open}
                title="Add ChatGPT Response"
                okText="Log Response"
                cancelText="Cancel"
                onCancel={() => {
                    form.resetFields();
                    onCancel();
                }}
                onOk={() => {
                    form
                        .validateFields()
                        .then((values) => {
                            form.resetFields();
                            onAddResponse(values);
                        })
                        .catch((info) => {
                            console.log("Validate Failed:", info);
                        });
                }}>
                <Form
                    form={form}
                    layout="vertical"
                    name="form_in_modal"
                    initialValues={{
                        modifier: "public",
                    }}>
                    <Form.Item name="response"
                               rules={[
                                   {
                                       required: true,
                                       message: "Please copy the ChatGPT's response here!",
                                   },
                               ]}>
                        <TextArea rows={10} placeholder={ResponseTemplate}/>
                    </Form.Item>
                </Form>
            </Modal>
        );
    };

    const isTableLine = (line, delimiter = "|") => {
        return line.startsWith(delimiter);
    };

    const isCompleteTableLine = (line, numEntries, delimiter = "|") => {
        const lineSplit = line.split(delimiter);
        if (line.endsWith(delimiter) && lineSplit.length === (numEntries + 2)) {
            return true;
        }
        return !line.endsWith(delimiter) && lineSplit.length === (numEntries + 1);
    };

    const extractTableLineEntries = (line, separator = "|", numCols = 4) => {
        //    def extract_table_line_entries(line, separator="|", num_cols=4):
        //     return list(map(lambda text: text.strip(), line.split(separator)[1:num_cols + 1]))
        const lineSplit = line.split(separator);
        return lineSplit.slice(1, numCols + 1).map(text => text.trim());
    };

    const onUpdateConcepts = () => {
        // update the concept dict by parsing the log lines
        const newConceptDict = {...conceptDict};
        const logLines = historyString.split("\n");
        let foundIssue = false;
        for (let line of logLines) {
            line = line.trim();

            if (!isTableLine(line, "@")) {
                continue;
            }

            if (!isCompleteTableLine(line, 2, "@")) {
                console.log(`Incomplete table line: ${line}`);
                console.log(`Stop processing further lines.`);
                message.warning(`the following table line is incomplete: ${line}`);
                foundIssue = true;
                break;
            }

            const [className, classDescription] = extractTableLineEntries(line, "@", 2);
            console.log(`class name: ${className}, class description: ${classDescription}`);
            if (className === "concept name") {
                continue;
            }

            if (!newConceptDict.hasOwnProperty(className)) {
                message.warning(`Seems that ChatGPT returned a new concept: ${className} outside the hierarchy. ignored.`);
                continue;
            }

            if (!newConceptDict[className] !== null) {
                // message.warning(`The concept ${className} has been defined twice. The latter overwrites the former.`);
            }
            newConceptDict[className] = classDescription;
        }

        if (foundIssue) {
            message.warning("Concept list is not updated due to the existing issue.");
            return;
        }

        setConceptDict(newConceptDict);

        // get 10 new concepts from the concept dict without description
        const conceptListToExtractDefinitions = Object.keys(newConceptDict).filter(className => newConceptDict[className] === null).slice(0, 10);
        setConceptInput(conceptListToExtractDefinitions.join(", "));
        if (conceptListToExtractDefinitions.length > 0) {
            message.success("Concept list updated.");
        } else {
            message.info("All concepts have been defined.");
        }
    };

    const updateHierarchyWithDefinition = () => {
        const ast = dotparser(hierarchyInput);
        // const newConceptDict = extractConceptFromAst(ast);

        // console.log(ast);
        const nodes = {};
        Object.entries(conceptDict).forEach(([className, classDescription]) => {
            nodes[className] = {
                color: "black",
            };
            if (classDescription) {
                nodes[className].label = `${className} | ${insertNewLineEveryNWords(classDescription, 5)}`;
                nodes[className].shape = "record";
            }
        });
        // console.log(nodes);
        const edges = ast[0].children.filter(child => {
            if (child.type !== "edge_stmt") {
                return false;
            }
            if (child.edge_list.length !== 2) {
                return false;
            }
            return child.edge_list.every(edge_item => edge_item.type === "node_id");
        }).map(edge_stmt => {
            const src = edge_stmt.edge_list[0].id;
            const dest = edge_stmt.edge_list[1].id;
            return {
                src,
                dest,
            };
        });
        // console.log(edges);
        const hierarchyWithDefinition = serializeGraph({
            directed: true,
            // graph attributes
            attribs: {
                rankdir: "LR",
            },
            // graph nodes (the keys are used as node IDs)
            // use spread operator to inject style presets
            nodes,
            // graph edges (w/ optional ports & extra attribs)
            edges
        });
        // console.log(hierarchyWithDefinition);
        setHierarchyWithDefinition(hierarchyWithDefinition);
    };

    const onSaveDOT = () => {
        const link = document.createElement("a");
        const file = new Blob([hierarchyWithDefinition], {type: "text/plain"});
        link.href = URL.createObjectURL(file);
        link.download = "ontology_with_definition.dot";
        link.click();
        URL.revokeObjectURL(link.href);

        link.remove();
    };

    const onSaveHistory = () => {
        const link = document.createElement("a");
        const file = new Blob([historyString], {type: "text/plain"});
        link.href = URL.createObjectURL(file);
        link.download = "concept-definition-extraction.log";
        link.click();
        URL.revokeObjectURL(link.href);

        link.remove();
    };

    const executionTabs = [
        {
            key: "controls",
            label: `Controls`,
            children: <div style={{textAlign: "left"}}>
                <Row style={{alignItems: "center", marginBottom: "1rem"}}>
                    <Col span={12}>
                        <Button onClick={onUpdateConcepts} style={{width: "90%"}}>
                            Update Concepts
                        </Button>
                    </Col>
                    <Col span={12}>
                        <div style={{paddingLeft: "0.5rem"}}>Click to update the concept list for definition
                            extraction.
                        </div>
                    </Col>
                </Row>
                <Row style={{alignItems: "center", marginBottom: "1rem"}}>
                    <Col span={12}>
                        <Button onClick={onCopyPromptGenerated} style={{width: "90%"}}
                                disabled={conceptInput.trim().length === 0}>Copy & Execute</Button>
                    </Col>
                    <Col span={12}>
                        <div style={{paddingLeft: "0.5rem"}}>Click to copy the prompt. Paste it in a new ChatGPT
                            session
                            to execute it.
                        </div>
                    </Col>
                </Row>
                <Row style={{alignItems: "center", marginBottom: "1rem"}}>
                    <Col span={12}>
                        <Button onClick={() => setResponseModalOpen(true)} style={{width: "90%"}}>Log
                            Response</Button>
                        <AddResponseFormModal
                            open={responseModalOpen}
                            onAddResponse={onAddResponse}
                            onCancel={() => {
                                setResponseModalOpen(false);
                            }}
                        />
                    </Col>
                    <Col span={12}>
                        <div style={{paddingLeft: "0.5rem"}}>Click to add the ChatGPT response into the log.</div>
                    </Col>
                </Row>
                <Row style={{alignItems: "center", marginBottom: "1rem"}}>
                    <Col span={12}>
                        <Button onClick={onSaveDOT} style={{width: "90%"}}>
                            Download DOT
                        </Button>
                    </Col>
                    <Col span={12}>
                        <div style={{paddingLeft: "0.5rem"}}>Click to download the hierarchy to a local .dot file.</div>
                    </Col>
                </Row>
                <Row style={{alignItems: "center", marginBottom: "1rem"}}>
                    <Col span={12}>
                        <Button onClick={onSaveHistory} style={{width: "90%"}}>
                            Download Log
                        </Button>
                    </Col>
                    <Col span={12}>
                        <div style={{paddingLeft: "0.5rem"}}>Click to download the log to a local .log file.</div>
                    </Col>
                </Row>
            </div>
        },
        {
            key: "log",
            label: `Log`,
            children: <TextArea style={CommonTextAreaStyle} value={historyString}
                                onChange={e => setHistoryString(e.target.value)}/>
        },
    ];

    const visualizationTabItems = [
        {
            key: "dot_with_definition",
            label: "Hierarchy with Definition",
            children: <div id="graph-definition" style={graphStyle}/>
        },
        {
            key: "Table",
            label: "Definition Table",
            children: <Table size={"small"}
                             pagination={false}
                             scroll={{
                                 y: 580,
                             }} columns={definitionTableColumns} dataSource={conceptDefinitionTableData}/>
        }
    ];

    return (
        <Content style={contentStyle}>
            <Row>
                <Col span={9} style={colStyle}>
                    <h1>Prompt Engineering</h1>
                    <Tabs activeKey={promptEngineeringTabKey} items={promptEngineeringTabs}
                          onChange={newKey => setPromptEngineeringTabKey(newKey)}/>
                </Col>
                <Col span={6} style={colStyle}>
                    <h1 style={{textAlign: "center"}}>Execution</h1>
                    <Tabs defaultActiveKey={"controls"} items={executionTabs}/>
                </Col>
                <Col span={9} style={colStyle}>
                    <h1>Visualisation</h1>
                    <Tabs defaulActiveKey={"dot"} items={visualizationTabItems}/>
                </Col>
            </Row>
        </Content>
    );
};