import React, {useEffect, useRef, useState} from "react";
import {Button, Col, Form, Layout, message, Modal, Row, Radio, Tabs, Table, Tooltip} from "antd";

import * as d3 from "d3";
import * as d3Graphviz from "d3-graphviz";
import * as dotparser from "dotparser";

import {Input} from "antd";
import {
    FormatTemplate,
    ResponseTemplate,
    DomainContextTemplate,
    HierarchyTemplate,
    PromptSeparator,
    ResponseSeparator, InstructionTemplateGen
} from "./PromptTemplates";
import {colStyle, CommonTextAreaStyle, contentStyle, graphStyle} from "../Common/Styles";
import {ConceptSelectionTab} from "./ConceptSelectionTab";
import {extractConceptFromAst, extractRelationship} from "../DistillationUtils";


const {TextArea} = Input;
const {Content} = Layout;


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
    const [relationshipDict, setRelationshipDict] = useState({});
    const [responseModalOpen, setResponseModalOpen] = useState(false);
    const [conceptDict, setConceptDict] = useState({});
    const [promptEngineeringTabKey, setPromptEngineeringTabKey] = useState("prompt");
    const [conceptRadioOption, setConceptRadioOption] = useState("subject");

    const optionStateRef = useRef();
    optionStateRef.current = conceptRadioOption;

    useEffect(() => {
        try {
            console.log("called");
            // hierarchy has been manually edited. update the concept definition table
            const ast = dotparser(hierarchyInput);
            const newConceptDict = extractConceptFromAst(ast);
            setConceptDict(newConceptDict);
            d3.select("#graph")
                .graphviz({fit: true})
                .transition(function () {
                    return d3.transition()
                        .ease(d3.easeLinear)
                        .duration(100);
                })
                .renderDot(hierarchyInput, onDotRendered);
        } catch (err) {
            console.log(err);
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

        if (!subjectConcept || !objectConcept) {
            message.warning("Please select a subject and an object");
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

    const processLog = () => {
        console.log("processing log");
        console.log(historyString);
        const relationshipDict = extractRelationship(historyString.split("\n"));
        console.log(relationshipDict);
        setRelationshipDict(relationshipDict);
        message.success("Log Processed");
    };

    const onSaveHistory = () => {
        const link = document.createElement("a");
        const file = new Blob([historyString], {type: "text/plain"});
        link.href = URL.createObjectURL(file);
        link.download = "concept-relationship-distillation.log";
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
                        Selected subject
                    </Col>
                    <Col span={12}>
                        <div style={{paddingLeft: "0.5rem"}}>
                            {subjectConcept ? subjectConcept : "not selected"}
                        </div>
                    </Col>
                </Row>
                <Row style={{alignItems: "center", marginBottom: "1rem", justifyContent: "center"}}>
                    <Col span={12}>
                        Selected object
                    </Col>
                    <Col span={12}>
                        <div style={{paddingLeft: "0.5rem"}}>
                            {objectConcept ? objectConcept : "not selected"}
                        </div>
                    </Col>
                </Row>

                <Row style={{alignItems: "center", marginBottom: "1rem", justifyContent: "center"}}>
                    <Col span={24}>
                        <Tooltip placement={"right"}
                                 title={"Click to copy the prompt. Execute in a new ChatGPT session."}>
                            <Button onClick={onCopyPromptGenerated}
                                    style={{width: "100%"}}>
                                Copy Prompt
                            </Button>
                        </Tooltip>
                    </Col>
                </Row>

                <Row style={{alignItems: "center", marginBottom: "1rem", justifyContent: "center"}}>
                    <Col span={24}>
                        <Tooltip placement={"right"}
                                 title={"click to add the ChatGPT response into the log."}>
                            <Button onClick={() => setResponseModalOpen(true)}
                                    style={{width: "100%"}}>
                                Log Response</Button>
                            <AddResponseFormModal
                                open={responseModalOpen}
                                onAddResponse={onAddResponse}
                                onCancel={() => {
                                    setResponseModalOpen(false);
                                }}
                            />
                        </Tooltip>
                    </Col>
                </Row>
                <Row style={{alignItems: "center", marginBottom: "1rem", justifyContent: "center"}}>
                    <Col span={24}>
                        <Tooltip placement={"right"}
                                 title={"Extract relationships from the log."}>
                            <Button onClick={processLog} style={{width: "100%"}}>
                                Process Log
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

    const relationshipTableColumns = [
        {
            title: "Subject -> Object",
            dataIndex: "concept_pair",
            key: "concept_pair",
            render: (conceptPair) => <div style={{textAlign: "center"}}>
                {conceptPair.split("->")[0]} <br/>-><br/> {conceptPair.split("->")[1]}
            </div>
        },
        {
            title: "Relationship",
            dataIndex: "relationship",
            key: "relationship",
            render: (relationshipSet) => <div>
                <ul style={{columns: 3}}>
                    {Array.from(relationshipSet).map((relationship) => <li>{relationship}</li>)}
                </ul>
            </div>,
            width: "70%"
        }
    ];

    const prepareRelationshipTableData = (relationshipDict) => {
        const relationshipTableData = [];
        const relationshipArray = Object.entries(relationshipDict);
        relationshipArray.sort((a, b) => a[0].localeCompare(b[0]));

        for (const [key, value] of relationshipArray) {
            relationshipTableData.push({
                concept_pair: key,
                relationship: value,
                key: key,
            });
        }
        return relationshipTableData;
    };

    const visualizationTabItems = [
        {
            key: "dot",
            label: "Hierarchy",
            children: <div id="graph" style={graphStyle}/>
        },
        {
            key: "relationship-dict",
            label: "Relationships",
            children: <>
                <Table dataSource={prepareRelationshipTableData(relationshipDict)}
                       columns={relationshipTableColumns}
                       pagination={false}
                       scroll={{
                           y: "calc(100vh - 320px)",
                       }}
                       size={"small"}
                />
            </>
        },
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