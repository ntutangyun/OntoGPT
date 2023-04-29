// this is the content component

import React, {useEffect} from "react";
import {Col, Layout, Row,} from "antd";

import * as d3 from "d3";
import * as d3Graphviz from "d3-graphviz";

import {Input} from "antd";

const {TextArea} = Input;
const {Content} = Layout;

const contentStyle = {
    padding: "10px",
};

const dotEditorStyle = {
    fontFamily: "monospace",
    height: "calc(100vh - 200px)",
};

const graphStyle = {
    border: "1px solid #ddd",
    backgroundColor: "white",
    marginLeft: "auto",
    marginRight: "auto",
    maxHeight: "calc(100vh - 200px)",
    maxWidth: "90%",
    overflowX: "hidden",
    overflowY: "hidden"
};

const visualizationColStyle = {
    textAlign: "center",
};

export default function ContentComponent() {
    const [dotString, setDotString] = React.useState("digraph {a -> b}");
    useEffect(() => {
        try {
            d3.select("#graph").graphviz({fit: true})
                .renderDot(dotString);
        } catch (error) {
            console.log(error);
        }

    }, [dotString]);

    const onTextAreaChange = (e) => {
        setDotString(e.target.value);
    };
    return (
        <Content style={contentStyle}>
            <Row>
                <Col span={9}>
                    <h1>Controls</h1>
                </Col>
                <Col span={6}>
                    <h1 style={{textAlign: "center"}}>DOT Editor</h1>
                    <TextArea
                        style={dotEditorStyle}
                        placeholder="input the DOT content"
                        onChange={onTextAreaChange}/>
                </Col>
                <Col span={9} style={visualizationColStyle}>
                    <h1>Visualisation</h1>
                    <div id="graph" style={graphStyle}/>
                </Col>
            </Row>
        </Content>
    );
}