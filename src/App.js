import "./App.css";
import {Layout,} from "antd";
import ContentComponent from "./ContentComponent";

const {Header, Footer} = Layout;

const headerStyle = {
    textAlign: "center",
    color: "#fff",
    height: 64,
    paddingInline: 50,
    lineHeight: "64px",
    backgroundColor: "#385975",
};

const footerStyle = {
    textAlign: "center",
    color: "#fff",
    backgroundColor: "#385975",
};

function App() {
    return (
        <Layout>
            <Header style={headerStyle}><h1 style={{display: "inline"}}>OntoGPT</h1> - Domain Ontology Distillation
                Assistant</Header>
            <ContentComponent/>
            <Footer style={footerStyle}>Footer</Footer>
        </Layout>
    );
}

export default App;
