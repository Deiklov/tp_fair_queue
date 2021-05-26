import logo from './logo.svg';
import 'antd/dist/antd.css';
import React, {useState, useEffect} from 'react';
import Modals from './components/modals'
import {Modal, Button, Layout, Menu, Breadcrumb, PageHeader} from 'antd';
import './App.css';
import TableSheet from "./components/main_table";
import web3 from './web3';
import storehash from "./storehash";

const {Header, Content, Footer} = Layout;


const App = () => {
    const [eventName, seteventName] = React.useState("default Event");

    return (
        <Layout className="layout">
            <PageHeader
                className="site-page-header"
                onBack={() => null}
                title="FairQueue"
                subTitle="Let's create an honest list!"
                backIcon={false}
            />
            <Content style={{padding: '0 50px', margin: '16px 0'}}>
                <div className="site-layout-content">
                    <Modals setEvent={seteventName}/>
                    <TableSheet eventName={eventName}/>
                </div>
            </Content>
            <Footer style={{textAlign: 'center'}}>Ant Design ©2018 Created by Ant UED</Footer>
        </Layout>
    );
};

export default App;
