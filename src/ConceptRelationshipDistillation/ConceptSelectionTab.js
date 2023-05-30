import {Col, Row, Table} from "antd";

const subjectTableColumns = [
    {
        title: "Pick a Subject",
        dataIndex: "concept",
        key: "concept",
    },
];


const objectTableColumns = [
    {
        title: "Pick an Object",
        dataIndex: "concept",
        key: "concept",
    },
];

const colStyle = {
    padding: "0 10px",
};

export function ConceptSelectionTab({conceptDict, objectConcept, setObjectConcept, subjectConcept, setSubjectConcept}) {
    const conceptList = Object.keys(conceptDict).map((concept) => {
        return {concept, key: concept};
    }).sort((a, b) => {
        return a.concept.localeCompare(b.concept);
    });

    return <div>
        <Row>
            <Col span={12} style={colStyle}>
                <Table columns={subjectTableColumns}
                       dataSource={conceptList}
                       scroll={{y: 570}}
                       pagination={false}
                       rowSelection={{
                           type: "radio",
                           selectedRowKeys: [subjectConcept],
                           onSelect: (record) => {
                               console.log(`setting subject concept: ${record.key}`);
                               setSubjectConcept(record.key);
                           }
                       }}
                />
            </Col>
            <Col span={12} style={colStyle}>
                <Table columns={objectTableColumns}
                       dataSource={conceptList}
                       scroll={{y: 570}}
                       pagination={false}
                       rowSelection={{
                           type: "radio",
                           selectedRowKeys: [objectConcept],
                           onSelect: (record) => {
                               console.log(`setting object concept: ${record.key}`);
                               setObjectConcept(record.key);
                           }
                       }}
                /></Col>
        </Row>
    </div>;
}