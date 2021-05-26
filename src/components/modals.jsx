import {Button, Modal, Row, Col, Divider, Input} from "antd";
import React from "react";
import web3 from '../web3';
import storehash from "../storehash";

const Modals = (props) => {
    const [visible, setVisible] = React.useState(false);
    const [confirmLoading, setConfirmLoading] = React.useState(false);
    const [modalText, setModalText] = React.useState('Choose params to new queue');
    const [visible2, setVisible2] = React.useState(false);
    const [confirmLoading2, setConfirmLoading2] = React.useState(false);
    const [modalText2, setModalText2] = React.useState('Enter contract queue address');
    const style = {background: '#0092ff', padding: '8px 0'};
    const [inputData, setinputData] = React.useState("0x3194cBDC3dbcd3E11a07892e7bA5c3394048Cc87");

    const loadEtheriumData = async (data) => {
        const accounts = await web3.eth.getAccounts();
        console.log(accounts);
        const result = await storehash.methods.eventName().call({
            from: accounts[0]
        });
        props.setEvent(result);
        console.log(result)

    };
    return (
        <>
            <Row gutter={{xs: 8, sm: 16, md: 24, lg: 32}}>
                <Col className="gutter-row" span={6}>
                    <Button type="primary" onClick={() => setVisible(true)}>
                        Create new queue
                    </Button>
                </Col>
                <Col className="gutter-row" span={6}>
                    <Button type="primary" onClick={() => setVisible2(true)}>
                        Join to exist queue
                    </Button>
                </Col>
            </Row>

            <Modal
                title="Create new queue"
                visible={visible}
                onOk={() => setVisible(false)}
                onCancel={() => setVisible(false)}
            >
                <p>{modalText}</p>
            </Modal>

            <Modal
                title="Join to exist queue"
                visible={visible2}
                onOk={async () => {
                    await loadEtheriumData(inputData);
                    await setVisible2(false);
                }}
                onCancel={() => setVisible2(false)}
            >
                <p>{modalText2}</p>
                <Input placeholder={inputData} onChange={(e) => setinputData(e.target.value)}/>
            </Modal>
        </>
    )
};

export default Modals;