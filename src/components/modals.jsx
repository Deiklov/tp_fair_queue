import {Button, Modal, Row, Col, Divider} from "antd";
import React from "react";

const Modals = () => {
    const [visible, setVisible] = React.useState(false);
    const [confirmLoading, setConfirmLoading] = React.useState(false);
    const [modalText, setModalText] = React.useState('Choose params to new queue');
    const [visible2, setVisible2] = React.useState(false);
    const [confirmLoading2, setConfirmLoading2] = React.useState(false);
    const [modalText2, setModalText2] = React.useState('Enter contract queue address');
    const style = {background: '#0092ff', padding: '8px 0'};

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
                title="Create new queue"
                visible={visible2}
                onOk={() => setVisible2(false)}
                onCancel={() => setVisible2(false)}
            >
                <p>{modalText2}</p>
            </Modal>
        </>
    )
};

export default Modals;