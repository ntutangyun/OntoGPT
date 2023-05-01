import React from "react";
import {Header} from "antd/es/layout/layout";
import {useNavigate} from "react-router-dom";


const headerStyle = {
    textAlign: "center",
    color: "#fff",
    height: 64,
    paddingInline: 50,
    lineHeight: "64px",
    backgroundColor: "#385975",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between"
};

const linkStyle = {
    color: "#fff",
    textDecoration: "none",
    display: "inline-block",
    padding: "0 10px",
};

const linkHoverStyle = {
    color: "#fff",
    textDecoration: "underline",
    display: "inline-block",
    padding: "0 10px",
    cursor: "pointer"
};

export default function HeaderComponent() {
    const navigate = useNavigate();
    const [link1Hover, setLink1Hover] = React.useState(false);
    const [link2Hover, setLink2Hover] = React.useState(false);
    const [link3Hover, setLink3Hover] = React.useState(false);
    const [link4Hover, setLink4Hover] = React.useState(false);


    return <Header style={headerStyle}>
        <div>Domain Ontology Distillation Assistant</div>
        <div>
            <div style={link1Hover ? linkHoverStyle : linkStyle}
                 onMouseEnter={() => setLink1Hover(true)}
                 onMouseLeave={() => setLink1Hover(false)}
                 onClick={() =>
                     navigate("/concept-hierarchy-extraction")}>
                Concept Hierarchy Extraction
            </div>
            <div style={link2Hover ? linkHoverStyle : linkStyle}
                 onMouseEnter={() => setLink2Hover(true)}
                 onMouseLeave={() => setLink2Hover(false)}
                 onClick={() => navigate("/concept-definition-extraction")}>
                Concept Definition Extraction
            </div>
            <div style={link3Hover ? linkHoverStyle : linkStyle}
                 onMouseEnter={() => setLink3Hover(true)}
                 onMouseLeave={() => setLink3Hover(false)}
                 onClick={() => navigate("/concept-relation-extraction")}>
                Concept Relation Extraction
            </div>
            <div style={link4Hover ? linkHoverStyle : linkStyle}
                 onMouseEnter={() => setLink4Hover(true)}
                 onMouseLeave={() => setLink4Hover(false)}
                 onClick={() => navigate("/concept-property-extraction")}>
                Concept Property Extraction
            </div>
        </div>
    </Header>;
}