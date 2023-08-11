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
    const [link0Hover, setLink0Hover] = React.useState(false);
    const [link1Hover, setLink1Hover] = React.useState(false);
    const [link2Hover, setLink2Hover] = React.useState(false);
    const [link3Hover, setLink3Hover] = React.useState(false);
    const [link4Hover, setLink4Hover] = React.useState(false);

    useEffect(() => {
        // execute on location change
        console.log("Location changed!", location.pathname);
    }, [location]);

    const isLink0Active = location.pathname === "/documentation";
    const isLink1Active = location.pathname === "/concept-hierarchy-distillation";
    const isLink2Active = location.pathname === "/concept-definition-distillation";
    const isLink3Active = location.pathname === "/concept-relation-distillation";
    const isLink4Active = location.pathname === "/concept-property-distillation";

    return <Header style={headerStyle}>
        <div>Domain Ontology Distillation Assistant</div>
        <div>
            <div
                style={link0Hover ? linkHoverStyle : isLink0Active ? linkActiveStyle : linkStyle}
                onMouseEnter={() => setLink0Hover(true)}
                onMouseLeave={() => setLink0Hover(false)}
                onClick={() =>
                    navigate("/documentation")}>
                Documentation
            </div>
            <div
                style={link1Hover ? linkHoverStyle : isLink1Active ? linkActiveStyle : linkStyle}
                onMouseEnter={() => setLink1Hover(true)}
                onMouseLeave={() => setLink1Hover(false)}
                onClick={() =>
                    navigate("/concept-hierarchy-distillation")}>
                Hierarchy
            </div>
            <div style={link2Hover ? linkHoverStyle : isLink2Active ? linkActiveStyle : linkStyle}
                 onMouseEnter={() => setLink2Hover(true)}
                 onMouseLeave={() => setLink2Hover(false)}
                 onClick={() => navigate("/concept-definition-distillation")}>
                Definition
            </div>
            <div style={link3Hover ? linkHoverStyle : isLink3Active ? linkActiveStyle : linkStyle}
                 onMouseEnter={() => setLink3Hover(true)}
                 onMouseLeave={() => setLink3Hover(false)}
                 onClick={() => navigate("/concept-relation-distillation")}>
                Relation
            </div>
            <div style={link4Hover ? linkHoverStyle : isLink4Active ? linkActiveStyle : linkStyle}
                 onMouseEnter={() => setLink4Hover(true)}
                 onMouseLeave={() => setLink4Hover(false)}
                 onClick={() => navigate("/concept-property-distillation")}>
                Property
            </div>
        </div>
    </Header>;
}