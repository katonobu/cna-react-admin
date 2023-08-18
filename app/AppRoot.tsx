"use client";
import {Resource, Admin, Layout, Menu} from "react-admin";
import webSerialProvider from "./webSerialDataProvider/src";
import { useState, useEffect } from 'react'
import { useSerialPorts } from '@/app/webSerialDataProvider/src/webSerialDataProvider'
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import SerialPortIcon from '@/app/serialPorts/src/SerialPortIcon'
import UsbIcon from '@mui/icons-material/Usb';
import {SerialPortsList} from '@/app/serialPorts/src/SerialPortList'
import {SerialPortEdit} from '@/app/serialPorts/src/SerialPortEdit'
import {workerOnMessageHandler} from '@/app/webSerialDataProvider/src/webSerialWorkerAdapter'

const baseResource = <Menu.Item value={"/List_Add_Port"} to={"/List_Add_Port"} key={'list_add_port'} primaryText="List/Add Port" leftIcon={<PlaylistAddIcon />} />
const MyMenu = () => {
  const [portsInfo, setPortsInfo] = useState([baseResource])
  const serialPorts= useSerialPorts()
  // SerialPortIcon　固定値で色指定しているのがイケてない。。。
  useEffect(() => {
    const devices = serialPorts.map((val)=>{
//        console.log(val)
        return (<Menu.Item
          value={`/List_Add_Port/${val.idStr}`}
          to={`/List_Add_Port/${val.idStr}`}
          key={val.idStr}
          primaryText={val.idStr}
          leftIcon={(val.pid===0 && val.vid===0)?<SerialPortIcon color="rgba(0, 0, 0, 0.54)"/>:<UsbIcon />}
        />)
    })
    setPortsInfo(()=>[baseResource, ...devices])
  }, [serialPorts]);  

  return (
    <Menu>{
      portsInfo
    }</Menu>
  );
}

const MyLayout = (props:any) => <Layout {...props} menu={MyMenu} />

// https://blog.logrocket.com/web-workers-react-typescript/
// を参考に、ここでworkerを起動
// dynamic-loadingコンポーネント内で起動しないと、サーバー側でworkerを起動しようとする
// console.log(new URL("./worker/src/index.ts", import.meta.url))
export const worker: Worker = new Worker(new URL("./worker/src/index.ts", import.meta.url))

const serialDataProvider = webSerialProvider();
const AppRoot = () => {
    useEffect(() => {
      if (window.Worker) {
        worker.onmessage = workerOnMessageHandler
      }
    }, []);
    return (
        <Admin
          dataProvider={serialDataProvider}
          layout={MyLayout}
        >
        <Resource name={"List_Add_Port"} icon={PlaylistAddIcon} list={SerialPortsList} edit={SerialPortEdit}></Resource>
        </Admin>
    );
}
export default AppRoot;
