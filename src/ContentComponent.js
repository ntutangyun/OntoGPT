// this is the content component

import React, {useEffect, useState} from "react";
import {Button, Col, Layout, message, Row, Tabs,} from "antd";

import * as d3 from "d3";
import * as d3Graphviz from "d3-graphviz";

import {Input} from "antd";
import {
    ConceptHierarchyExtractionFormatTemplate,
    ConceptHierarchyExtractionInstructionTemplate,
    DomainContextTemplate
} from "./PromptTemplates";

const {TextArea} = Input;
const {Content} = Layout;

const contentStyle = {
    padding: "10px",
};

const dotEditorStyle = {
    fontFamily: "monospace",
    height: "calc(100vh - 220px)",
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

const generatedPromptStyle = {
    fontFamily: "monospace",
    height: "calc(100vh - 280px)",
    textAlign: "left",
};

export default function ContentComponent() {
    const [dotString, setDotString] = useState("digraph {\n    a -> b;\n}");
    const [domainContextInput, setDomainContextInput] = useState(DomainContextTemplate);
    const [conceptHierarchyExtractionInstructionInput, setConceptHierarchyExtractionInstructionInput] =
        useState(ConceptHierarchyExtractionInstructionTemplate);
    const [conceptHierarchyExtractionFormatInput, setConceptHierarchyExtractionFormatInput] =
        useState(ConceptHierarchyExtractionFormatTemplate);
    const [generatedPrompt, setGeneratedPrompt] = useState("");

    useEffect(() => {
        try {
            d3.select("#graph").graphviz({fit: true})
                .renderDot(dotString);
        } catch (error) {
            console.log(error);
        }

    }, [dotString]);

    useEffect(() => {
        setGeneratedPrompt(domainContextInput + conceptHierarchyExtractionInstructionInput + conceptHierarchyExtractionFormatInput);
    }, [domainContextInput,
        conceptHierarchyExtractionInstructionInput,
        conceptHierarchyExtractionFormatInput
    ]);

    const onCopyPromptGenerated = () => {
        const textarea = document.getElementById("textarea-prompt-generated");
        textarea.select();
        document.execCommand("copy");
        message.success("Copied");
    };

    const promptEngineeringTabs = [
        {
            key: "context",
            label: `Context`,
            children: <TextArea style={CommonTextAreaStyle} value={domainContextInput}
                                onChange={e => setDomainContextInput(e.target.value)}/>,
        },
        {
            key: "instruction",
            label: `Instruction`,
            children: <TextArea style={CommonTextAreaStyle}
                                value={conceptHierarchyExtractionInstructionInput}
                                onChange={e => setConceptHierarchyExtractionInstructionInput(e.target.value)}/>,
        },
        {
            key: "format",
            label: `Format`,
            children: <TextArea style={CommonTextAreaStyle} value={conceptHierarchyExtractionFormatInput}
                                onChange={e => setConceptHierarchyExtractionFormatInput(e.target.value)}/>,
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

    const executionTabs = [
        {
            key: "controls",
            label: `Controls`,
            children: <div style={{textAlign: "left"}}>
                <Row style={{alignItems: "center"}}>
                    <Col>
                        <Button onClick={onCopyPromptGenerated}>Copy & Execute</Button>
                    </Col>
                    <Col>
                        <div style={{paddingLeft: "0.5rem"}}>Click to copy the prompt. Paste it in a new ChatGPT session
                            to execute it.
                        </div>
                    </Col>
                </Row>

            </div>
        },
        {
            key: "log",
            label: `Log`,
            children: <TextArea style={CommonTextAreaStyle} value={dotString}/>
        },
        {
            key: "dot",
            label: `Hierarchy`,
            children: <TextArea
                style={CommonTextAreaStyle}
                value={dotString}
                placeholder="input the DOT content"
                onChange={e => setDotString(e.target.value)}/>
        }
    ];

    return (
        <Content style={contentStyle}>
            <Row>
                <Col span={9} style={colStyle}>
                    <h1>Prompt Engineering</h1>
                    <Tabs defaultActiveKey="context" items={promptEngineeringTabs}/>
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