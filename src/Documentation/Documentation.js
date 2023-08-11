import React, {useEffect, useState} from "react";
import {Col, Layout, Row, Tabs,} from "antd";

import {Input} from "antd";
import {CommonTextAreaStyle, contentStyle} from "../Common/Styles";
import OntologyAnimator from "./OntologyAnimator";
import OntologyViewer from "./OntologyViewer";

const {TextArea} = Input;
const {Content} = Layout;

const dataUrlList = {
    "chatgpt-3.5-auto-hierarchy": "docs/demos/chatgpt-3.5-auto-concept-hierarchy-distillation.log",
    "chatgpt-3.5-partial-hierarchy": "docs/demos/chatgpt-3.5-partial-concept-hierarchy-distillation.log",
    "chatgpt-3.5-partial-definition-log": "docs/demos/chatgpt-3.5-partial-concept-definition-distillation.log",
    "chatgpt-3.5-partial-definition-dot": "docs/demos/chatgpt-3.5-partial-concept-definition-distillation.dot",
};

export default function Documentation() {
    const [documentationData, setDocumentationData] = useState(null);

    const loadDocumentData = async () => {
        const loadedData = await Promise.all(Object.entries(dataUrlList).map(([dataID, dataURL]) => {
            return new Promise(async (resolve, reject) => {
                try {
                    const res = await fetch(dataURL);
                    const resText = await res.text();
                    resolve({
                        id: dataID,
                        url: dataURL,
                        content: resText,
                        exception: null
                    });
                } catch (e) {
                    reject({
                        id: dataID,
                        url: dataURL,
                        content: null,
                        exception: e
                    });
                }
            });
        }));
        const docDataDict = {};
        for (let data of loadedData) {
            docDataDict[data["id"]] = data;
        }
        console.log(docDataDict);
        setDocumentationData(docDataDict);
    };

    useEffect(() => {
        loadDocumentData().then();
    }, []);

    if (documentationData === null) {
        return <Content style={contentStyle}>
            <br/>
            <Row style={{justifyContent: "center", margin: "2rem"}}>
                <Col span={16}>
                    <h1>Documentation</h1>
                    <p>Downloading and initializing documentation data ...</p>
                </Col>
            </Row>
        </Content>;
    }

    const chatGPT35AutoResultTabs = [
        {
            key: "hierarchy",
            label: `Hierarchy Viewer`,
            children: <div>
                <OntologyAnimator canvasID={`ChatGPT35DrivingAuto-hierarchy`}
                                  distillationLog={documentationData["chatgpt-3.5-auto-hierarchy"].content}/>
            </div>
        },
        {
            key: "hierarchy-log",
            label: `Hierarchy Log`,
            children: <TextArea style={CommonTextAreaStyle}
                                readOnly={true}
                                value={documentationData["chatgpt-3.5-auto-hierarchy"].content}/>
        }
    ];

    const chatGPT35PartialResultTabs = [
        {
            key: "hierarchy",
            label: `Hierarchy Viewer`,
            children: <div>
                <OntologyAnimator canvasID={`ChatGPT35DrivingPartial-hierarchy`}
                                  distillationLog={documentationData["chatgpt-3.5-partial-hierarchy"].content}/>
            </div>
        },
        {
            key: "hierarchy-log",
            label: `Hierarchy Log`,
            children: <TextArea style={CommonTextAreaStyle}
                                value={documentationData["chatgpt-3.5-partial-hierarchy"].content}
                                readOnly={true}/>
        },
        {
            key: "definition-dot",
            label: `Definition Viewer`,
            children: <div>
                <OntologyViewer canvasID={"ChatGPT35DrivingPartial-definition"}
                                dotContent={documentationData["chatgpt-3.5-partial-definition-dot"].content}/>
            </div>
        },
        {
            key: "definition-log",
            label: `Definition Log`,
            children: <TextArea style={CommonTextAreaStyle}
                                readOnly={true}
                                value={documentationData["chatgpt-3.5-partial-definition-log"].content}/>
        }
    ];

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
            <Row style={{justifyContent: "center", margin: "1rem 0rem"}}>
                <Col span={16}>
                    <hr/>
                </Col>
            </Row>
            <Row style={{justifyContent: "center"}}>
                <Col span={16}>
                    <h1>Demo Result - ChatGPT 3.5 - Autonomous Driving Domain - Without manual intervention</h1>
                    <Tabs items={chatGPT35AutoResultTabs}/>
                </Col>
            </Row>
            <Row style={{justifyContent: "center", margin: "1rem 0rem"}}>
                <Col span={16}>
                    <hr/>
                </Col>
            </Row>
            <Row style={{justifyContent: "center"}}>
                <Col span={16}>
                    <h1>Demo Result - ChatGPT 3.5 - Autonomous Driving Domain - With minimal manual
                        intervention</h1>
                    <Tabs
                        items={chatGPT35PartialResultTabs}>
                    </Tabs>
                </Col>
            </Row>
            <br/>
        </Content>
    );
}