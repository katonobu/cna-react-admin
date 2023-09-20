"use client";
import { createContext } from 'react';
import {Resource, Admin, Layout} from "react-admin";
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import MyMenu from '@/app/components/MyMenu'
import JsSerialWeb from '@katonobu/js-serial-web';
import {SerialPortsList} from '@/app/serialPorts/src/SerialPortList'
import {SerialPortEdit} from '@/app/serialPorts/src/SerialPortEdit'
import webSerialProvider from "@/app/webSerialDataProvider/src";

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
            <Resource
              name={"List_Add_Port"}
              icon={PlaylistAddIcon}
              list={SerialPortsList}
              edit={SerialPortEdit}
            >
            </Resource>
          </Admin>
        </JsSerialWebContext.Provider>                
    );
}
export default AppRoot;
