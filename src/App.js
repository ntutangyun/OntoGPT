import "./App.css";
import {Layout,} from "antd";
import HeaderComponent from "./HeaderComponent";
import {HashRouter, Navigate, Route, Routes} from "react-router-dom";
import ConceptHierarchyExtractionComponent from "./ConceptHierarchyExtraction/ConceptHierarchyExtractionComponent";
import React from "react";
import ConceptDefinitionExtractionComponent from "./ConceptDefinitionExtraction/ConceptDefinitionExtractionComponent";
import ConceptRelationshipExtractionComponent
    from "./ConceptRelationshipExtraction/ConceptRelationshipExtractionComponent";

const {Footer} = Layout;

const footerStyle = {
    textAlign: "center",
    color: "#fff",
    backgroundColor: "#385975",
};

function App() {
    return (
        <HashRouter>
            <Layout>
                <HeaderComponent/>
                <Routes>
                    <Route path={"/concept-hierarchy-extraction"} element={<ConceptHierarchyExtractionComponent/>}/>
                    <Route path={"/concept-definition-extraction"} element={<ConceptDefinitionExtractionComponent/>}/>
                    <Route path={"/concept-relation-extraction"} element={<ConceptRelationshipExtractionComponent/>}/>
                    <Route path={"/concept-property-extraction"} element={<p>UI Under Development</p>}/>
                    <Route path={"*"} element={<Navigate to={"/concept-hierarchy-extraction"} replace={true}/>}/>
                </Routes>
                <Footer style={footerStyle}>Yun Tang (yun.tang at warwick.ac.uk) @ WMG, University of Warwick, United
                    Kingdom</Footer>
            </Layout>
        </HashRouter>
    );
}

export default App;
