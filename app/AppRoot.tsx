"use client";
import {Resource, Admin, Layout} from "react-admin";
import webSerialProvider from "./webSerialDataProvider/src";
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import MyMenu from '@/app/components/MyMenu'
import {SerialPortsList} from '@/app/serialPorts/src/SerialPortList'
//import {SerialPortEdit} from '@/app/serialPorts/src/SerialPortEdit'
import { createContext } from 'react';
import JsSerialWeb from 'js-serial-web';

const MyLayout = (props:any) => <Layout {...props} menu={MyMenu} />

const jsw = new JsSerialWeb()
export const JsSerialWebContext = createContext<JsSerialWeb>(jsw);
const serialDataProvider = webSerialProvider(jsw);
const AppRoot = () => {
    return (
        <JsSerialWebContext.Provider value={jsw}>
          <Admin
            dataProvider={serialDataProvider}
            layout={MyLayout}
          >
  {/*        <Resource name={"List_Add_Port"} icon={PlaylistAddIcon} list={SerialPortsList} edit={SerialPortEdit}></Resource> */}
          <Resource name={"List_Add_Port"} icon={PlaylistAddIcon} list={SerialPortsList}></Resource>
          </Admin>
        </JsSerialWebContext.Provider>                
    );
}
export default AppRoot;
