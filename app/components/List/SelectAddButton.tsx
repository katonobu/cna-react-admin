import { Button, useCreate } from 'react-admin';
import AddIcon from '@mui/icons-material/Add';

const SelectAddButton = (props:{
    disable_not_empty?:boolean, 
    variant?:"text" | "outlined" | "contained" | undefined
}) => {
    const {disable_not_empty = false, variant='text'} = props
    const serialPorts = []//useSerialPorts()
    const [create, { isLoading }] = useCreate('webserialport', {});
    return (
        <Button
            label="Select/Add"
            onClick={
                () => create()
            }
            variant={variant}
            disabled={isLoading || (disable_not_empty && 0 < serialPorts.length)}
        >
            <AddIcon/>
        </Button>
    );
}

export default SelectAddButton