import {Menu} from "react-admin";
import { useState, useEffect } from 'react'
import { useSerialPorts } from '@/app/webSerialDataProvider/src/useJsSerialWeb'
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
const makeIcon = (port)=>{
  const colorStr = port.available?"rgba(0, 0, 0, 0.54)":"rgba(0, 0, 0, 0.20)"
  return (port.pid===0 && port.vid===0)?<SerialPortIcon color={colorStr}/>:<UsbIcon htmlColor={colorStr}/>  
}
const MyMenu = () => {
  const [portsInfo, setPortsInfo] = useState([baseResource])
  const serialPorts:{id:number,pid:number,vid:number,available:boolean}[] = useSerialPorts()
  // SerialPortIcon　固定値で色指定しているのがイケてない。。。
  useEffect(() => {
    const devices = serialPorts.map((port)=>{
//        console.log(val)
        const idStr = port.id.toString(10)
        return (<Menu.Item
          value={`/List_Add_Port/${idStr}`}
          to={`/List_Add_Port/${idStr}`}
          key={idStr}
          primaryText={idStr}
          leftIcon={makeIcon(port)}
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