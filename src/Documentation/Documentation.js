import React, {useEffect, useState} from "react";
import {Button, Col, Form, Layout, message, Modal, Row, Tabs,} from "antd";

import * as d3 from "d3";
import * as d3Graphviz from "d3-graphviz";

import {Input} from "antd";
import {extractDigraphString} from "../ResponseUtils";
import {DomainContextTemplate, PromptSeparator, ResponseSeparator} from "../Common/PromptTemplates";
import {colStyle, CommonTextAreaStyle, contentStyle, graphStyle} from "../Common/Styles";

const {TextArea} = Input;
const {Content} = Layout;

export default function Documentation() {
    // const [generatedPrompt, setGeneratedPrompt] = useState("");
    // const [historyString, setHistoryString] = useState("");
    // const [responseModalOpen, setResponseModalOpen] = useState(false);

    // useEffect(() => {
    //     try {
    //         d3.select("#graph").graphviz()
    //             .fit(true)
    //             .renderDot(hierarchyInput)
    //             .transition(function () {
    //                 return d3.transition()
    //                     .ease(d3.easeLinear)
    //                     .duration(500);
    //             });
    //     } catch (error) {
    //         console.log(error);
    //     }
    //
    // }, [hierarchyInput]);

    // useEffect(() => {
    //     setGeneratedPrompt(domainContextInput + "\n\n"
    //         + hierarchyInput + "\n\n"
    //         + instructionInput + "\n"
    //         + formatInput);
    // }, [domainContextInput,
    //     instructionInput,
    //     formatInput,
    //     hierarchyInput
    // ]);

    // const onCopyPromptGenerated = () => {
    //     const textarea = document.getElementById("textarea-prompt-generated");
    //     textarea.select();
    //     document.execCommand("copy");
    //     message.success("Copied");
    //
    //     setHistoryString(historyString + PromptSeparator + generatedPrompt);
    // };

    // const promptEngineeringTabs = [
    //     {
    //         key: "context",
    //         label: `Context`,
    //         children: <TextArea style={CommonTextAreaStyle} value={domainContextInput}
    //                             onChange={e => setDomainContextInput(e.target.value)}/>,
    //     },
    //     {
    //         key: "Hierarchy",
    //         label: `Hierarchy`,
    //         children: <TextArea style={CommonTextAreaStyle} value={hierarchyInput}
    //                             onChange={e => setHierarchyInput(e.target.value)}/>
    //     },
    //     {
    //         key: "instruction",
    //         label: `Instruction`,
    //         children: <TextArea style={CommonTextAreaStyle}
    //                             value={instructionInput}
    //                             onChange={e => setDistillationInstructionInput(e.target.value)}/>,
    //     },
    //     {
    //         key: "format",
    //         label: `Format`,
    //         children: <TextArea style={CommonTextAreaStyle} value={formatInput}
    //                             onChange={e => setFormatInput(e.target.value)}/>,
    //     },
    //     {
    //         key: "prompt",
    //         label: `Prompt`,
    //         children: <div>
    //             <TextArea style={CommonTextAreaStyle}
    //                       readOnly={true}
    //                       value={generatedPrompt}
    //                       id={"textarea-prompt-generated"}>
    //             </TextArea>
    //         </div>
    //     }
    // ];

    // const onAddResponse = (res) => {
    //     setHistoryString(historyString + ResponseSeparator + res.response + "\n");
    //     message.success("Response added");
    //     setResponseModalOpen(false);
    // };

    // const AddResponseFormModal = ({open, onAddResponse, onCancel}) => {
    //     const [form] = Form.useForm();
    //     return (
    //         <Modal
    //             open={open}
    //             title="Add ChatGPT Response"
    //             okText="Log Response"
    //             cancelText="Cancel"
    //             onCancel={() => {
    //                 form.resetFields();
    //                 onCancel();
    //             }}
    //             onOk={() => {
    //                 form
    //                     .validateFields()
    //                     .then((values) => {
    //                         form.resetFields();
    //                         onAddResponse(values);
    //                     })
    //                     .catch((info) => {
    //                         console.log("Validate Failed:", info);
    //                     });
    //             }}>
    //             <Form
    //                 form={form}
    //                 layout="vertical"
    //                 name="form_in_modal"
    //                 initialValues={{
    //                     modifier: "public",
    //                 }}>
    //                 <Form.Item name="response"
    //                            rules={[
    //                                {
    //                                    required: true,
    //                                    message: "Please copy the ChatGPT's response here!",
    //                                },
    //                            ]}>
    //                     <TextArea rows={10} placeholder={ResponseTemplate}/>
    //                 </Form.Item>
    //             </Form>
    //         </Modal>
    //     );
    // };

    // const onUpdateHierarchy = () => {
    //     const latestHierarchyString = extractDigraphString(historyString.split("\n"));
    //     console.log(latestHierarchyString);
    //     setHierarchyInput(latestHierarchyString);
    //     message.success("Hierarchy updated");
    // };

    // const onSaveDOT = () => {
    //     const link = document.createElement("a");
    //     const file = new Blob([hierarchyInput], {type: "text/plain"});
    //     link.href = URL.createObjectURL(file);
    //     link.download = "ontology.dot";
    //     link.click();
    //     URL.revokeObjectURL(link.href);
    //
    //     link.remove();
    // };

    // const onSaveHistory = () => {
    //     const link = document.createElement("a");
    //     const file = new Blob([historyString], {type: "text/plain"});
    //     link.href = URL.createObjectURL(file);
    //     link.download = "concept-hierarchy-distillation.log";
    //     link.click();
    //     URL.revokeObjectURL(link.href);
    //
    //     link.remove();
    // };

    // const executionTabs = [
    //     {
    //         key: "controls",
    //         label: `Controls`,
    //         children: <div style={{textAlign: "left"}}>
    //             <Row style={{alignItems: "center", marginBottom: "1rem"}}>
    //                 <Col span={12}>
    //                     <Button onClick={onCopyPromptGenerated} style={{width: "90%"}}>Copy & Execute</Button>
    //                 </Col>
    //                 <Col span={12}>
    //                     <div style={{paddingLeft: "0.5rem"}}>Click to copy the prompt. Paste it in a new ChatGPT session
    //                         to execute it.
    //                     </div>
    //                 </Col>
    //             </Row>
    //             <Row style={{alignItems: "center", marginBottom: "1rem"}}>
    //                 <Col span={12}>
    //                     <Button onClick={() => setResponseModalOpen(true)} style={{width: "90%"}}>Log Response</Button>
    //                     <AddResponseFormModal
    //                         open={responseModalOpen}
    //                         onAddResponse={onAddResponse}
    //                         onCancel={() => {
    //                             setResponseModalOpen(false);
    //                         }}
    //                     />
    //                 </Col>
    //                 <Col span={12}>
    //                     <div style={{paddingLeft: "0.5rem"}}>Click to add the ChatGPT response into the log.</div>
    //                 </Col>
    //             </Row>
    //             <Row style={{alignItems: "center", marginBottom: "1rem"}}>
    //                 <Col span={12}>
    //                     <Button onClick={onUpdateHierarchy} style={{width: "90%"}}>
    //                         Update Hierarchy
    //                     </Button>
    //                 </Col>
    //                 <Col span={12}>
    //                     <div style={{paddingLeft: "0.5rem"}}>Click to extract the latest hierarchy from the log.</div>
    //                 </Col>
    //             </Row>
    //             <Row style={{alignItems: "center", marginBottom: "1rem"}}>
    //                 <Col span={12}>
    //                     <Button onClick={onSaveDOT} style={{width: "90%"}}>
    //                         Download DOT
    //                     </Button>
    //                 </Col>
    //                 <Col span={12}>
    //                     <div style={{paddingLeft: "0.5rem"}}>Click to download the hierarchy to a local .dot file.</div>
    //                 </Col>
    //             </Row>
    //             <Row style={{alignItems: "center", marginBottom: "1rem"}}>
    //                 <Col span={12}>
    //                     <Button onClick={onSaveHistory} style={{width: "90%"}}>
    //                         Download Log
    //                     </Button>
    //                 </Col>
    //                 <Col span={12}>
    //                     <div style={{paddingLeft: "0.5rem"}}>Click to download the log to a local .log file.</div>
    //                 </Col>
    //             </Row>
    //         </div>
    //     },
    //     {
    //         key: "log",
    //         label: `Log`,
    //         children: <TextArea style={CommonTextAreaStyle} value={historyString}
    //                             onChange={e => setHistoryString(e.target.value)}/>
    //     },
    // ];

    return (
        <Content style={contentStyle}>
            <br/>
            <Row style={{justifyContent: "center"}}>
                <Col span={16}>
                    <h1>Introduction</h1>
                    <p>This website is a domain knowledge distillation assistant for distilling knowledge
                        in the form of ontology of any domain from the Large Language Models.</p>
                    <p>For more information, please check out paper: </p>
                    <p>
                        Yun Tang, Antonio A. Bruto da Costa, Xizhe Zhang, Irvine Patrick, Siddartha Khastgir, Paul
                        Jennings. <br/>
                        <i>Domain Knowledge Distillation from Large Language Model: An Empirical Study in the Autonomous
                            Driving Domain.</i> <br/>
                        in The 26th IEEE International Conference on Intelligent Transportation Systems (ITSC 2023).
                    </p>
                </Col>
            </Row>
            <br/>
            <Row style={{justifyContent: "center"}}>
                <Col span={16}>
                    <h1>Demo</h1>
                    <video width="100%" height="auto" controls>
                        <source src="http://localhost:3000/docs/demos/Usage-Demonstration.mp4" type="video/mp4"/>
                        Your browser does not support the video tag.
                    </video>
                </Col>
            </Row>
            <br/>
            <Row style={{justifyContent: "center"}}>
                <Col span={16}>
                    <h1>Application - ChatGPT 3.5 - Autonomous Driving Domain</h1>

                </Col>
            </Row>
            <br/>
        </Content>
    );
}