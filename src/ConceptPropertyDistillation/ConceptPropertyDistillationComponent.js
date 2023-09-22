import React, {useEffect, useState} from "react";
import {Button, Col, Form, Layout, message, Modal, Row, Table, Tabs, Tooltip} from "antd";
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
import {extractConceptFromAst, isCompleteTableLine} from "../DistillationUtils";


const {TextArea} = Input;
const {Content} = Layout;

function prepareTableData(conceptDict) {
    const tableData = [];
    Object.keys(conceptDict).forEach((concept) => {
        tableData.push({
            key: concept,
            concept: concept,
            property: conceptDict[concept]
        });
    });
    return tableData;
}

const propertyTableColumns = [
    {
        title: "Concept",
        dataIndex: "concept",
        key: "col-concept",
    },
    {
        title: "Property",
        dataIndex: "property",
        key: "col-property",
        width: "70%",
        render: (propertySet) => {
            if (propertySet) {
                return <ul style={{columns: 3}}>
                    {Array.from(propertySet).map((property) => <li>{property}</li>)}
                </ul>;
            } else {
                return null;
            }
        }
    }
];

export default function ConceptPropertyDistillationComponent() {
    const [domainContextInput, setDomainContextInput] = useState(DomainContextTemplate);
    const [hierarchyInput, setHierarchyInput] = useState(HierarchyTemplate);
    const [instructionInput, setInstructionInput] = useState(InstructionTemplate);
    const [conceptInput, setConceptInput] = useState("");
    const [formatInput, setFormatInput] = useState(FormatTemplate);
    const [generatedPrompt, setGeneratedPrompt] = useState("");
    const [historyString, setHistoryString] = useState("");
    const [responseModalOpen, setResponseModalOpen] = useState(false);
    const [conceptDict, setConceptDict] = useState({});
    const [conceptPropertyTableData, setConceptPropertyTableData] = useState([]);
    const [hierarchyWithProperty, setHierarchyWithProperty] = useState(HierarchyTemplate);

    const [promptEngineeringTabKey, setPromptEngineeringTabKey] = useState("prompt");

    useEffect(() => {
        try {
            // hierarchy has been manually edited. update the concept property table
            const ast = dotparser(hierarchyInput);
            const newConceptDict = extractConceptFromAst(ast);

            const mergedConceptDict = {...newConceptDict};
            Object.keys(conceptDict).forEach((concept) => {
                if (newConceptDict.hasOwnProperty(concept)) {
                    mergedConceptDict[concept] = conceptDict[concept];
                }
            });
            setConceptDict(mergedConceptDict);
            console.log(mergedConceptDict);
        } catch (err) {
            console.log(err);
        }
    }, [hierarchyInput]);

    useEffect(() => {
        try {
            d3.select("#graph-property").graphviz({fit: true})
                .renderDot(hierarchyWithProperty)
                .transition(function () {
                    return d3.transition()
                        .ease(d3.easeLinear)
                        .duration(100);
                });
        } catch (error) {
            console.log(error);
        }
    }, [hierarchyWithProperty]);

    useEffect(() => {
        if (conceptDict) {
            setConceptPropertyTableData(prepareTableData(conceptDict));
            updateHierarchyWithProperty();
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

    const onCopyPromptGenerated = async () => {
        await setPromptEngineeringTabKey("prompt");

        if (conceptInput.trim().length === 0) {
            message.warning("Concept list is empty. Please update the concept list first.");
            return;
        }

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

        let inResponse = false;
        for (let line of logLines) {
            line = line.trim();

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

            if (!line.startsWith("@")) {
                continue;
            }

            if (!isCompleteTableLine(line, 2, "@")) {
                console.log(`Incomplete table line: ${line}`);
                console.log(`Stop processing further lines.`);
                message.warning(`the following table line is incomplete: ${line}`);
                foundIssue = true;
                break;
            }

            const [conceptName, conceptProperty] = extractTableLineEntries(line, "@", 2);
            console.log(`concept name: ${conceptName}, concept description: ${conceptProperty}`);

            if (!newConceptDict.hasOwnProperty(conceptName)) {
                message.warning(`Seems that ChatGPT returned a new concept: ${conceptName} outside the hierarchy. ignored.`);
                continue;
            }

            if (newConceptDict[conceptName] === null) {
                newConceptDict[conceptName] = new Set();
            }
            newConceptDict[conceptName].add(conceptProperty);
        }

        if (foundIssue) {
            message.warning("Concept list is not updated due to the existing issue.");
            return;
        }

        setConceptDict(newConceptDict);

        // get 10 new concepts from the concept dict without description
        const conceptListToExtractProperties = Object.keys(newConceptDict).filter(conceptName => newConceptDict[conceptName] === null || newConceptDict[conceptName].size === 0).slice(0, 10);
        setConceptInput(conceptListToExtractProperties.join(", "));
        if (conceptListToExtractProperties.length > 0) {
            message.success("Concept list updated.");
        } else {
            message.info("All concepts have distilled properties.");
        }
    };

    const updateHierarchyWithProperty = () => {
        const ast = dotparser(hierarchyInput);

        // console.log(ast);
        const nodes = {};
        Object.entries(conceptDict).forEach(([conceptName, conceptProperty]) => {
            nodes[conceptName] = {
                color: "black",
            };
            if (conceptProperty) {
                nodes[conceptName].label = `${conceptName} | ${Array.from(conceptProperty).join("\n")}`;
                nodes[conceptName].shape = "record";
            }
        });

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

        const hierarchyWithProperty = serializeGraph({
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
        // console.log(hierarchyWithProperty);
        setHierarchyWithProperty(hierarchyWithProperty);
    };

    const onSaveDOT = () => {
        const link = document.createElement("a");
        const file = new Blob([hierarchyWithProperty], {type: "text/plain"});
        link.href = URL.createObjectURL(file);
        link.download = "ontology_with_property.dot";
        link.click();
        URL.revokeObjectURL(link.href);

        link.remove();
    };

    const onSaveHistory = () => {
        const link = document.createElement("a");
        const file = new Blob([historyString], {type: "text/plain"});
        link.href = URL.createObjectURL(file);
        link.download = "concept-property-distillation.log";
        link.click();
        URL.revokeObjectURL(link.href);

        link.remove();
    };

    const executionTabs = [
        {
            key: "controls",
            label: `Controls`,
            children: <div style={{textAlign: "left"}}>
                <Row style={{alignItems: "center", marginBottom: "1rem", justifyContent: "center"}}>
                    <Col span={24}>
                        <Tooltip placement={"right"}
                                 title={"Click to analyze the log and pick a new concept without distilled properties."}>
                            <Button onClick={onUpdateConcepts} style={{width: "100%"}}>
                                Update Concepts
                            </Button>
                        </Tooltip>
                    </Col>
                </Row>
                <Row style={{alignItems: "center", marginBottom: "1rem", justifyContent: "center"}}>
                    <Col span={24}>
                        <Tooltip placement={"right"}
                                 title={"Click to copy the prompt. Paste it in a new ChatGPT session to execute it."}>
                            <Button onClick={onCopyPromptGenerated} style={{width: "100%"}}>Copy Prompt</Button>
                        </Tooltip>
                    </Col>
                </Row>
                <Row style={{alignItems: "center", marginBottom: "1rem", justifyContent: "center"}}>
                    <Col span={24}>
                        <Tooltip placement={"right"}
                                 title={"Click to add the ChatGPT response into the log."}>
                            <Button onClick={() => setResponseModalOpen(true)} style={{width: "100%"}}>Log
                                Response</Button>
                            <AddResponseFormModal
                                open={responseModalOpen}
                                onAddResponse={onAddResponse}
                                onCancel={() => {
                                    setResponseModalOpen(false);
                                }}/>
                        </Tooltip>
                    </Col>
                </Row>
                <Row style={{alignItems: "center", marginBottom: "1rem", justifyContent: "center"}}>
                    <Col span={24}>
                        <Tooltip placement={"right"}
                                 title={"Click to download the hierarchy to a local .dot file."}>
                            <Button onClick={e => {
                                onSaveDOT();
                                e.preventDefault();
                            }} style={{width: "100%"}}>
                                Download DOT
                            </Button>
                        </Tooltip>
                    </Col>
                </Row>
                <Row style={{alignItems: "center", marginBottom: "1rem", justifyContent: "center"}}>
                    <Col span={24}>
                        <Tooltip placement={"right"}
                                 title={"Click to download the log to a local .log file."}>
                            <Button onClick={e => {
                                onSaveHistory();
                                e.preventDefault();
                            }} style={{width: "100%"}}>
                                Download Log
                            </Button>
                        </Tooltip>
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
            key: "dot_with_property",
            label: "Hierarchy with Property",
            children: <div id="graph-property" style={graphStyle}/>
        },
        {
            key: "Table",
            label: "Property Table",
            children: <Table size={"small"}
                             pagination={false}
                             scroll={{
                                 y: "calc(100vh - 320px)",
                             }} columns={propertyTableColumns} dataSource={conceptPropertyTableData}/>
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
                <Col span={4} style={colStyle}>
                    <h1 style={{textAlign: "center"}}>Execution</h1>
                    <Tabs defaultActiveKey={"controls"} items={executionTabs}/>
                </Col>
                <Col span={11} style={colStyle}>
                    <h1>Visualisation</h1>
                    <Tabs defaulActiveKey={"dot"} items={visualizationTabItems}/>
                </Col>
            </Row>
        </Content>
    );
};