import SerialPortIcon from './SerialPortIcon'
import {SerialPortsList} from './SerialPortList';
import {SerialPortCreate} from './SerialPortCreate'
import {SerialPortEdit} from './SerialPortEdit'

const resource = {
    list: SerialPortsList,
    create: SerialPortCreate,
    edit: SerialPortEdit,
    icon: SerialPortIcon,
};

export default resource;