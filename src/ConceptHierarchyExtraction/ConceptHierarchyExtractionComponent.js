// this is the content component

import React, {useEffect, useState} from "react";
import {Button, Col, Form, Layout, message, Modal, Row, Tabs,} from "antd";

import * as d3 from "d3";
import * as d3Graphviz from "d3-graphviz";

import {Input} from "antd";
import {
    FormatTemplate,
    InstructionTemplate, ResponseTemplate,
    DomainContextTemplate, HierarchyTemplate, PromptSeparator, ResponseSeparator
} from "./PromptTemplates";
import {extractDigraphString} from "../ResponseUtils";

const {TextArea} = Input;
const {Content} = Layout;

const contentStyle = {
    padding: "10px",
};

const graphStyle = {
    border: "1px solid #ddd",
    backgroundColor: "white",
    maxHeight: "calc(100vh - 220px)",
    maxWidth: "100%",
    overflowX: "hidden",
    overflowY: "hidden",
    textAlign: "left",
};

const colStyle = {
    padding: "0 1rem 1rem 1rem",
    textAlign: "center"
};

const CommonTextAreaStyle = {
    fontFamily: "monospace",
    height: "calc(100vh - 280px)",
};

export default function ConceptHierarchyExtractionComponent() {
    const [domainContextInput, setDomainContextInput] = useState(DomainContextTemplate);
    const [hierarchyInput, setHierarchyInput] = useState(HierarchyTemplate);
    const [instructionInput, setExtractionInstructionInput] =
        useState(InstructionTemplate);
    const [formatInput, setFormatInput] =
        useState(FormatTemplate);
    const [generatedPrompt, setGeneratedPrompt] = useState("");
    const [historyString, setHistoryString] = useState("");
    const [responseModalOpen, setResponseModalOpen] = useState(false);

    useEffect(() => {
        try {
            d3.select("#graph").graphviz()
                .fit(true)
                .renderDot(hierarchyInput)
                .transition(function () {
                    return d3.transition()
                        .ease(d3.easeLinear)
                        .duration(500);
                });
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

    const onCopyPromptGenerated = () => {
        const textarea = document.getElementById("textarea-prompt-generated");
        textarea.select();
        document.execCommand("copy");
        message.success("Copied");

        setHistoryString(historyString + PromptSeparator + generatedPrompt);
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
                                onChange={e => setExtractionInstructionInput(e.target.value)}/>,
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
        setHistoryString(historyString + ResponseSeparator + res.response + "\n");
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

    const onUpdateHierarchy = () => {
        const latestHierarchyString = extractDigraphString(historyString.split("\n"));
        console.log(latestHierarchyString);
        setHierarchyInput(latestHierarchyString);
        message.success("Hierarchy updated");
    };

    const onSaveDOT = () => {
        const link = document.createElement("a");
        const file = new Blob([hierarchyInput], {type: "text/plain"});
        link.href = URL.createObjectURL(file);
        link.download = "ontology.dot";
        link.click();
        URL.revokeObjectURL(link.href);

        link.remove();
    };

    const onSaveHistory = () => {
        const link = document.createElement("a");
        const file = new Blob([historyString], {type: "text/plain"});
        link.href = URL.createObjectURL(file);
        link.download = "concept-hierarchy-extraction.log";
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
                        <Button onClick={onCopyPromptGenerated} style={{width: "90%"}}>Copy & Execute</Button>
                    </Col>
                    <Col span={12}>
                        <div style={{paddingLeft: "0.5rem"}}>Click to copy the prompt. Paste it in a new ChatGPT session
                            to execute it.
                        </div>
                    </Col>
                </Row>
                <Row style={{alignItems: "center", marginBottom: "1rem"}}>
                    <Col span={12}>
                        <Button onClick={() => setResponseModalOpen(true)} style={{width: "90%"}}>Log Response</Button>
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
                        <Button onClick={onUpdateHierarchy} style={{width: "90%"}}>
                            Update Hierarchy
                        </Button>
                    </Col>
                    <Col span={12}>
                        <div style={{paddingLeft: "0.5rem"}}>Click to extract the latest hierarchy from the log.</div>
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

    return (
        <Content style={contentStyle}>
            <Row>
                <Col span={9} style={colStyle}>
                    <h1>Prompt Engineering</h1>
                    <Tabs defaultActiveKey="prompt" items={promptEngineeringTabs}/>
                </Col>
                <Col span={6} style={colStyle}>
                    <h1 style={{textAlign: "center"}}>Execution</h1>
                    <Tabs defaultActiveKey={"controls"} items={executionTabs}/>

                </Col>
                <Col span={9} style={colStyle}>
                    <h1>Visualisation</h1>
                    <div id="graph" style={graphStyle}/>
                </Col>
            </Row>
        </Content>
    );
}