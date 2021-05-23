import {Button, Modal} from "antd";
import React from "react";

const Modals = () => {
    const [visible, setVisible] = React.useState(false);
    const [confirmLoading, setConfirmLoading] = React.useState(false);
    const [modalText, setModalText] = React.useState('Content of the modal');

    return (
        <>
            <h1>FairQueue</h1>
            <Button type="primary" onClick={() => setVisible(true)}>
                Open Modal with async logic
            </Button>
            <Modal
                title="Create new queue"
                visible={visible}
                onOk={() => setVisible(false)}
                onCancel={() => setVisible(false)}
            >
                <p>{modalText}</p>
            </Modal>
        </>
    )
};