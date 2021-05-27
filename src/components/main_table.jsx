import {Table, Tag, Space} from 'antd';
import React from 'react';

const dataSource = [
    {
        key: '1',
        position: '1',
        name: "eagle",
        address: '0xdaddada',
    },
    {
        key: '2',
        position: '2',
        name: "chicken",
        address: '0xdaddadaadda',
    },
];

const columns = [
    {
        title: 'Position',
        dataIndex: 'position',
        key: 'position',
    },
    {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: 'Address',
        dataIndex: 'address',
        key: 'address',
    },
];

const TableSheet = (props) => <Table dataSource={props.data} columns={columns} bordered title={() => props.eventName}/>;
export default TableSheet;