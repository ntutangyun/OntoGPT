import {Layout,} from "antd";
import HeaderComponent from "./HeaderComponent";
import {HashRouter, Navigate, Route, Routes} from "react-router-dom";
import ConceptHierarchyDistillationComponent
    from "./ConceptHierarchyDistillation/ConceptHierarchyDistillationComponent";
import React from "react";
import ConceptDefinitionDistillationComponent
    from "./ConceptDefinitionDistillation/ConceptDefinitionDistillationComponent";
import ConceptRelationshipDistillationComponent
    from "./ConceptRelationshipDistillation/ConceptRelationshipDistillationComponent";
import Documentation from "./Documentation/Documentation";

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
                    <Route path={"/documentation"} element={<Documentation/>}/>
                    <Route path={"/concept-hierarchy-distillation"} element={<ConceptHierarchyDistillationComponent/>}/>
                    <Route path={"/concept-definition-distillation"}
                           element={<ConceptDefinitionDistillationComponent/>}/>
                    <Route path={"/concept-relation-distillation"}
                           element={<ConceptRelationshipDistillationComponent/>}/>
                    <Route path={"/concept-property-distillation"} element={<p>UI Under Development</p>}/>
                    <Route path={"*"} element={<Navigate to={"/concept-hierarchy-distillation"} replace={true}/>}/>
                </Routes>
                <Footer style={footerStyle}>Yun Tang (yun.tang at warwick.ac.uk) @ WMG, University of Warwick, United
                    Kingdom</Footer>
            </Layout>
        </HashRouter>
    );
}

export default App;
