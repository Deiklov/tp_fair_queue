import {Button, Modal, Row, Col, Form, Input, DatePicker, InputNumber} from "antd";
import React from "react";
import web3 from '../web3';
import storehash from "../storehash";

const Modals = (props) => {
    let resultData = [];
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
        const eventName = await storehash.methods.eventName().call({
            from: accounts[0]
        });
        props.setEvent(eventName);

        // const addtoqueue = await storehash.methods.addToQueue("adnrey kekmda").send({
        //     from: accounts[0],
        //     gasPrice: '0'
        // }, (error, transactionHash) => {
        //     console.log(transactionHash);
        // });
        const participantNames = await storehash.methods.getParticipantNames().call({
            from: accounts[0]
        });
        const participantAddreses = await storehash.methods.getParticipantAddresses().call({
            from: accounts[0]
        });

        if (participantAddreses)
            participantAddreses.map((item, i, arr) => {
                resultData.push({
                    key: i,
                    position: i,
                    name: participantNames[i],
                    address: item,
                })
            });
        props.setData(resultData);

        storehash.events.ParticipantAdded()
            .on('data', (event) => {
                console.log(event);
                resultData.push({
                    key: parseInt(event.returnValues.position),
                    position: parseInt(event.returnValues.position),
                    name: event.returnValues.name,
                    address: event.returnValues._address,
                });
                console.log(resultData);
                props.setData(resultData);
            })
            .on('error', console.error);

        // storehash.events.TaskCompleted()
        //     .on('data', (event) => {
        //         props.setData(event);
        //     })
        //     .on('error', console.error);

    };
    const createCtrct = async (fieldsValue) => {
        const StartTime = fieldsValue['StartTime'];
        const EndTime = fieldsValue['EndTime'];
        console.log(fieldsValue)

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
                <Form
                    name="basic"
                    initialValues={{
                        remember: true,
                    }}
                    onFinish={createCtrct}
                    onFinishFailed={() => alert('finish failed')}
                >
                    <Form.Item label="StartTime" name="StartTime">
                        <DatePicker showTime format="YYYY-MM-DD HH:mm:ss"/>
                    </Form.Item>
                    <Form.Item label="EndTime" name="EndTime">
                        <DatePicker showTime format="YYYY-MM-DD HH:mm:ss"/>
                    </Form.Item>
                    <Form.Item name="EventName" label="EventName" rules={[
                        {
                            required: true,
                            message: 'Please input EventName!',
                            whitespace: true,
                        },
                    ]}
                    >
                        <Input/>
                    </Form.Item>
                    <Form.Item name="Max participant count" label="Max participant count" rules={[
                        {
                            type: 'number',
                            min: 0,
                            max: 99,
                        },
                    ]}
                    >
                        <InputNumber/>
                    </Form.Item>
                    <Form.Item name="Min fee" label="Min fee wei" rules={[
                        {
                            type: 'number',
                            min: 0,
                            max: 10 ** 18,
                        },
                    ]}
                    >
                        <InputNumber/>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
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