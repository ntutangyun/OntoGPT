import React, {useEffect, useState} from "react";
import {Col, Layout, Row, Tabs,} from "antd";

import {Input} from "antd";
import {CommonTextAreaStyle, contentStyle} from "../Common/Styles";
import OntologyAnimator from "./OntologyAnimator";

const {TextArea} = Input;
const {Content} = Layout;

const dataIDList = {
    ChatGPT35Auto: {
        Hierarchy: "chatgpt-3.5-auto-hierarchy",
        Definition: "chatgpt-3.5-auto-definition",
        Relationship: "chatgpt-3.5-auto-relationship",
        Property: "chatgpt-3.5-auto-property"
    }
};

const dataUrlList = {
    [dataIDList["ChatGPT35Auto"]["Hierarchy"]]: "docs/demos/chatgpt-3.5-auto-concept-hierarchy-distillation.log"
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
        setDocumentationData(docDataDict);
    };

    useEffect(() => {
        loadDocumentData().then();
    }, []);

    const generateApplicationResultTabs = (docData, name, hierarchyLogId, definitionLogId, relationLogId, propertyLogId) => {
        const tabList = [];
        if (hierarchyLogId) {
            tabList.push({
                key: "hierarchy",
                label: `Hierarchy Viewer`,
                children: <div>
                    <OntologyAnimator canvasID={`${name}-hierarchy`} distillationLog={docData[hierarchyLogId].content}/>
                </div>
            });
            tabList.push({
                key: "hierarchy-log",
                label: `Hierarchy Log`,
                children: <TextArea style={CommonTextAreaStyle} value={docData[hierarchyLogId].content}/>
            },);
        }
        return tabList;
    };

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
            {
                documentationData ? <Row style={{justifyContent: "center"}}>
                    <Col span={16}>
                        <h1>Demo Result - ChatGPT 3.5 - Autonomous Driving Domain - Without manual intervention</h1>
                        <Tabs
                            items={generateApplicationResultTabs(
                                documentationData,
                                "ChatGPT35DrivingAuto",
                                dataIDList["ChatGPT35Auto"]["Hierarchy"],
                                dataIDList["ChatGPT35Auto"]["Definition"],
                                dataIDList["ChatGPT35Auto"]["Relationship"],
                                dataIDList["ChatGPT35Auto"]["Property"]
                            )}>
                        </Tabs>
                    </Col>
                </Row> : <p>Loading history data</p>
            }
            <br/>
        </Content>
    );
}