import {Button, Modal, Row, Col, Form, Input, DatePicker, InputNumber} from "antd";
import React, {useState, useEffect} from 'react';
import web3 from '../web3';
import abiQueue from "../queueABI";
import factory from "../factory";

const Modals = (props) => {
    let resultData = [];
    const addrKey = "accAddress";
    const [visible, setVisible] = React.useState(false);
    const [confirmLoading, setConfirmLoading] = React.useState(false);
    const [modalText, setModalText] = React.useState('Choose params to new queue');
    const [visible2, setVisible2] = React.useState(false);
    const [confirmLoading2, setConfirmLoading2] = React.useState(false);
    const [modalText2, setModalText2] = React.useState('Enter contract queue address');
    const [inputData, setinputData] = React.useState("0x3194cBDC3dbcd3E11a07892e7bA5c3394048Cc87");


    const loadEtheriumData = async (address) => {
        const queue = new web3.eth.Contract(abiQueue, address);
        const accounts = await web3.eth.getAccounts();
        console.log(accounts);
        const eventName = await queue.methods.eventName().call({
            from: accounts[0]
        });
        props.setEvent(eventName);

        // const addtoqueue = await storehash.methods.addToQueue("adnrey kekmda").send({
        //     from: accounts[0],
        //     gasPrice: '0'
        // }, (error, transactionHash) => {
        //     console.log(transactionHash);
        // });
        const participantNames = await queue.methods.getParticipantNames().call({
            from: accounts[0]
        });
        const participantAddreses = await queue.methods.getParticipantAddresses().call({
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


        queue.events.ParticipantAdded()
            .on('data', (event) => {
                console.log(event);
                props.setData(resultData.concat({
                    key: parseInt(event.returnValues.position),
                    position: parseInt(event.returnValues.position),
                    name: event.returnValues.name,
                    address: event.returnValues._address,
                }));
                console.log(resultData);
            })
            .on('error', console.error);

        // storehash.events.TaskCompleted()
        //     .on('data', (event) => {
        //         props.setData(event);
        //     })
        //     .on('error', console.error);

    };

    if (window.localStorage.getItem(addrKey)) {
        loadEtheriumData(window.localStorage.getItem(addrKey))
    }

    const createCtrct = async (fieldsValue) => {
            const StartTime = parseInt((new Date(Date.parse(fieldsValue['StartTime']))).getTime() / 1000).toFixed(0);
            const EndTime = parseInt((new Date(Date.parse(fieldsValue['EndTime']))).getTime() / 1000).toFixed(0);
            const evName = fieldsValue['EventName'];
            const maxPart = fieldsValue['Max_participant'];
            const minFee = fieldsValue['Min_fee'];
            console.log(fieldsValue);
            console.log("start time: ", StartTime);

            const accounts = await web3.eth.getAccounts();

            const deployedCtrctAddres = await factory.methods.createQueue(StartTime, EndTime, evName, maxPart, minFee).call({
                from: accounts[0],
                gasPrice: '0'
            });
            window.localStorage.setItem(addrKey, deployedCtrctAddres);
            console.log(deployedCtrctAddres)

        }
    ;

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
                    <Form.Item name="Max_participant" label="Max participant count" rules={[
                        {
                            type: 'number',
                            min: 0,
                            max: 99,
                        },
                    ]}
                    >
                        <InputNumber/>
                    </Form.Item>
                    <Form.Item name="Min_fee" label="Min fee wei" rules={[
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