import SerialPortIcon from './SerialPortIcon'
import {SerialPortsList} from './SerialPortList';
import dynamic from 'next/dynamic'
const SerialPortEdit = dynamic(() => import('./SerialPortEdit').then((module)=>module.SerialPortEdit), {
    ssr: false, // サーバーサイドレンダリングを無効化
});

const resource = {
    list: SerialPortsList,
    edit: SerialPortEdit,
    icon: SerialPortIcon,
};

export default resource;