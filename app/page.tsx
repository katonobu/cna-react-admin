"use client";
import dynamic from 'next/dynamic'
import {Resource, AdminUI, Loading, Layout, Menu} from "react-admin";
import webSerialProvider from "./webSerialDataProvider/src";
import { useState, useEffect } from 'react'
import { useSerialPorts } from '@/app/webSerialDataProvider/src/webSerialDataProvider'
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import SerialPortIcon from '@/app/serialPorts/src/SerialPortIcon'
import {SerialPortsList} from '@/app/serialPorts/src/SerialPortList'
import {SerialPortEdit} from '@/app/serialPorts/src/SerialPortEdit'


const AdminContext = dynamic(() => import('react-admin').then((module)=>module.AdminContext), {
  ssr: false, // サーバーサイドレンダリングを無効化
});
const Admin = dynamic(() => import('react-admin').then((module)=>module.Admin), {
  ssr: false, // サーバーサイドレンダリングを無効化
});

const baseResource = <Menu.Item to={"/List_Add_Port"} primaryText="List/Add Port" leftIcon={<PlaylistAddIcon />} />
const MyMenu = () => {
  const [portsInfo, setPortsInfo] = useState([baseResource])
  const serialPorts= useSerialPorts()
  useEffect(() => {
    const devices = serialPorts.map((val)=>(
        <Menu.Item to={`/List_Add_Port/${val.idStr}`} primaryText={val.idStr} leftIcon={<SerialPortIcon />}/>      
    ))
    setPortsInfo(()=>[baseResource, ...devices])
  }, [serialPorts]);  

  return (
    <Menu>{
      portsInfo
    }</Menu>
  );
}

const MyLayout = (props:any) => <Layout {...props} menu={MyMenu} />

const serialDataProvider = webSerialProvider();
const App = () => (
  <Admin
    dataProvider={serialDataProvider}
    layout={MyLayout}
  >
    <Resource name={"List_Add_Port"} icon={PlaylistAddIcon} list={SerialPortsList} edit={SerialPortEdit}></Resource>
  </Admin>
);
export default App;
