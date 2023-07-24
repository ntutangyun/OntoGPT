import React, {useEffect, useRef, useState} from "react";
import {Button, Col, Form, Layout, message, Modal, Row, Radio, Tabs} from "antd";
import {serializeGraph} from "@thi.ng/dot";

import * as d3 from "d3";
import * as d3Graphviz from "d3-graphviz";
import * as dotparser from "dotparser";

import {Input} from "antd";
import {
    FormatTemplate,
    InstructionTemplate,
    ResponseTemplate,
    DomainContextTemplate,
    HierarchyTemplate,
    PromptSeparator,
    ResponseSeparator, InstructionTemplateGen
} from "./PromptTemplates";
import {colStyle, CommonTextAreaStyle, contentStyle, graphStyle} from "../Common/Styles";
import {ConceptSelectionTab} from "./ConceptSelectionTab";


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

export default function ConceptRelationshipDistillationComponent() {
    const [domainContextInput, setDomainContextInput] = useState(DomainContextTemplate);
    const [hierarchyInput, setHierarchyInput] = useState(HierarchyTemplate);
    const [subjectConcept, setSubjectConcept] = useState("");
    const [objectConcept, setObjectConcept] = useState("");
    const [instructionInput, setInstructionInput] =
        useState(InstructionTemplateGen(subjectConcept, objectConcept));
    const [formatInput, setFormatInput] =
        useState(FormatTemplate);
    const [generatedPrompt, setGeneratedPrompt] = useState("");
    const [historyString, setHistoryString] = useState("");
    const [responseModalOpen, setResponseModalOpen] = useState(false);
    const [conceptDict, setConceptDict] = useState({});
    const [promptEngineeringTabKey, setPromptEngineeringTabKey] = useState("prompt");
    const [conceptRadioOption, setConceptRadioOption] = useState("subject");

    const optionStateRef = useRef();
    optionStateRef.current = conceptRadioOption;

    useEffect(() => {
        console.log("called");
        // hierarchy has been manually edited. update the concept definition table
        const ast = dotparser(hierarchyInput);
        const newConceptDict = extractConceptFromAst(ast);
        setConceptDict(newConceptDict);
        try {
            d3.select("#graph")
                .graphviz({fit: true})
                .transition(function () {
                    return d3.transition()
                        .ease(d3.easeLinear)
                        .duration(100);
                })
                .renderDot(hierarchyInput, onDotRendered);
        } catch (error) {
            console.log(error);
        }
    }, [hierarchyInput]);

    useEffect(() => {
        setGeneratedPrompt(domainContextInput + "\n\n"
            + hierarchyInput + "\n\n"
            + instructionInput + "\n"
            + formatInput);
    }, [domainContextInput,
        instructionInput,
        formatInput,
        hierarchyInput
    ]);

    useEffect(() => {
        setInstructionInput(InstructionTemplateGen(subjectConcept, objectConcept));
    }, [subjectConcept, objectConcept]);

    const onDotRendered = () => {
        const nodes = d3.selectAll(".node");

        // click and mousedown on nodes
        nodes.on("click", function (event) {
            event.preventDefault();
            event.stopPropagation();
            console.log("node click mousedown");
            const startNode = d3.select(this);
            console.log(startNode);
            console.log(this);
            if (this && this.__data__ && this.__data__.key) {
                console.log(`setting latest graph selection: ${this.__data__.key}`);
                console.log(`option state: ${optionStateRef.current}`);
                switch (optionStateRef.current) {
                    case "subject":
                        setSubjectConcept(this.__data__.key);
                        break;
                    case "object":
                        setObjectConcept(this.__data__.key);
                        break;
                    default:
                        break;
                }
            }
        });

        nodes.on("mouseover", function (event) {
            event.preventDefault();
            event.stopPropagation();
            console.log("node mouseover");
            d3.select(this).style("cursor", "pointer");
        });

        nodes.on("mouseout", function (event) {
            event.preventDefault();
            event.stopPropagation();
            console.log("node mouseout");
            d3.select(this).style("cursor", "default");
        });
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
            key: "concepts",
            label: `Concepts`,
            children: <ConceptSelectionTab
                conceptDict={conceptDict}
                objectConcept={objectConcept} setObjectConcept={setObjectConcept}
                setSubjectConcept={setSubjectConcept} subjectConcept={subjectConcept}/>
        },
        {
            key: "instruction",
            label: `Instruction`,
            children: <TextArea style={CommonTextAreaStyle}
                                value={instructionInput}
                                onChange={e => setInstructionInput(e.target.value)}/>,
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

    const conceptRadioOptions = [
        {
            label: "Pick Subject",
            value: "subject",
        },
        {
            label: "Pick Object",
            value: "object",
        },
    ];

    const onRadioChange = ({target: {value}}) => {
        setConceptRadioOption(value);
    };

    const executionTabs = [
        {
            key: "controls",
            label: `Controls`,
            children: <div style={{textAlign: "left"}}>
                <Row style={{alignItems: "center", marginBottom: "1rem"}}>
                    <Col span={12}>
                        <Button onClick={() => setPromptEngineeringTabKey("concepts")} style={{width: "90%"}}>
                            Select Concepts
                        </Button>
                    </Col>
                    <Col span={12}>
                        <div style={{paddingLeft: "0.5rem"}}>Click the concept nodes in the hierarchy graph to select.
                        </div>
                    </Col>
                </Row>
                <Row style={{alignItems: "center", marginBottom: "1rem"}}>
                    <Col span={12}>
                        <Button onClick={onCopyPromptGenerated} style={{width: "90%"}}
                                disabled={!subjectConcept || !objectConcept}>Copy & Execute</Button>
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
                    <Col span={24}>
                        <p>Click any concept in the hierarchy graph as {conceptRadioOption}.</p>
                        <Radio.Group
                            options={conceptRadioOptions}
                            onChange={onRadioChange}
                            value={conceptRadioOption}
                            optionType="button"
                            buttonStyle="solid"
                        />
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        Current subject
                    </Col>
                    <Col span={12}>
                        <div style={{paddingLeft: "0.5rem"}}>
                            {subjectConcept ? subjectConcept : "not selected"}
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        Current object
                    </Col>
                    <Col span={12}>
                        <div style={{paddingLeft: "0.5rem"}}>
                            {objectConcept ? objectConcept : "not selected"}
                        </div>
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
            key: "dot",
            label: "Hierarchy",
            children: <div id="graph" style={graphStyle}/>
        },
        // {
        //     key: "Table",
        //     label: "Definition Table",
        //     children: <Table size={"small"}
        //                      pagination={false}
        //                      scroll={{
        //                          y: 580,
        //                      }} columns={definitionTableColumns} dataSource={conceptDefinitionTableData}/>
        // }
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