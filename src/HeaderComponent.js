import React, {useEffect} from "react";
import {Header} from "antd/es/layout/layout";
import {useLocation, useNavigate} from "react-router-dom";


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
    color: "#aaa",
    textDecoration: "none",
    display: "inline-block",
    padding: "0 10px",
};

const linkHoverStyle = {
    color: "#fff",
    fontfaces: "bold",
    textDecoration: "underline",
    display: "inline-block",
    padding: "0 10px",
    cursor: "pointer"
};

const linkActiveStyle = {
    color: "#fff",
    fontfaces: "bold",
    display: "inline-block",
    padding: "0 10px",
    cursor: "pointer"
};

export default function HeaderComponent() {
    const location = useLocation();

    const navigate = useNavigate();
    const [link1Hover, setLink1Hover] = React.useState(false);
    const [link2Hover, setLink2Hover] = React.useState(false);
    const [link3Hover, setLink3Hover] = React.useState(false);
    const [link4Hover, setLink4Hover] = React.useState(false);

    useEffect(() => {
        // execute on location change
        console.log("Location changed!", location.pathname);
    }, [location]);

    const isLink1Active = location.pathname === "/concept-hierarchy-distillation";
    const isLink2Active = location.pathname === "/concept-definition-distillation";
    const isLink3Active = location.pathname === "/concept-relation-distillation";
    const isLink4Active = location.pathname === "/concept-property-distillation";

    return <Header style={headerStyle}>
        <div>Domain Ontology Distillation Assistant</div>
        <div>
            <div
                style={link1Hover ? linkHoverStyle : isLink1Active ? linkActiveStyle : linkStyle}
                onMouseEnter={() => setLink1Hover(true)}
                onMouseLeave={() => setLink1Hover(false)}
                onClick={() =>
                    navigate("/concept-hierarchy-distillation")}>
                Concept Hierarchy Distillation
            </div>
            <div style={link2Hover ? linkHoverStyle : isLink2Active ? linkActiveStyle : linkStyle}
                 onMouseEnter={() => setLink2Hover(true)}
                 onMouseLeave={() => setLink2Hover(false)}
                 onClick={() => navigate("/concept-definition-distillation")}>
                Concept Definition Distillation
            </div>
            <div style={link3Hover ? linkHoverStyle : isLink3Active ? linkActiveStyle : linkStyle}
                 onMouseEnter={() => setLink3Hover(true)}
                 onMouseLeave={() => setLink3Hover(false)}
                 onClick={() => navigate("/concept-relation-distillation")}>
                Concept Relation Distillation
            </div>
            <div style={link4Hover ? linkHoverStyle : isLink4Active ? linkActiveStyle : linkStyle}
                 onMouseEnter={() => setLink4Hover(true)}
                 onMouseLeave={() => setLink4Hover(false)}
                 onClick={() => navigate("/concept-property-distillation")}>
                Concept Property Distillation
            </div>
        </div>
    </Header>;
}