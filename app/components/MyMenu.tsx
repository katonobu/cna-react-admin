import {Menu} from "react-admin";
import { useState, useEffect } from 'react'
//import { useSerialPorts } from '@/app/webSerialDataProvider/src/webSerialDataProvider'
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import SerialPortIcon from '@/app/serialPorts/src/SerialPortIcon'
import UsbIcon from '@mui/icons-material/Usb';

const baseResource = <Menu.Item
  value={"/List_Add_Port"}
  to={"/List_Add_Port"}
  key={'list_add_port'}
  primaryText="List/Add Port"
  leftIcon={<PlaylistAddIcon/>} 
/>
const MyMenu = () => {
  const [portsInfo, setPortsInfo] = useState([baseResource])
  const serialPorts:{idStr:string, pid:number, vid:number}[] = [] // useSerialPorts()
  // SerialPortIcon　固定値で色指定しているのがイケてない。。。
  useEffect(() => {
    const devices = serialPorts.map((port)=>{
//        console.log(val)
        return (<Menu.Item
          value={`/List_Add_Port/${port.idStr}`}
          to={`/List_Add_Port/${port.idStr}`}
          key={port.idStr}
          primaryText={port.idStr}
          leftIcon={(port.pid===0 && port.vid===0)?<SerialPortIcon color="rgba(0, 0, 0, 0.54)"/>:<UsbIcon />}
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
export default MyMenu