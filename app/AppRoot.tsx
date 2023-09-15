"use client";
import {Resource, Admin, Layout} from "react-admin";
import webSerialProvider from "./webSerialDataProvider/src";
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import MyMenu from '@/app/components/MyMenu'
import {SerialPortsList} from '@/app/serialPorts/src/SerialPortList'
//import {SerialPortEdit} from '@/app/serialPorts/src/SerialPortEdit'

const MyLayout = (props:any) => <Layout {...props} menu={MyMenu} />


const serialDataProvider = webSerialProvider();
const AppRoot = () => {

    return (
        <Admin
          dataProvider={serialDataProvider}
          layout={MyLayout}
        >
{/*        <Resource name={"List_Add_Port"} icon={PlaylistAddIcon} list={SerialPortsList} edit={SerialPortEdit}></Resource> */}
        <Resource name={"List_Add_Port"} icon={PlaylistAddIcon} list={SerialPortsList}></Resource>
        </Admin>
    );
}
export default AppRoot;
