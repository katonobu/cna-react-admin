import { SaveButton, Toolbar, Create, SimpleForm, ReferenceInput, TextInput} from 'react-admin';

const PostEditToolbar = (props:any) => (
    <Toolbar {...props} >
        <SaveButton alwaysEnable />
    </Toolbar>
);

export const SerialPortCreate = () => (
    <Create redirect="edit">
        <SimpleForm toolbar={<PostEditToolbar />}>
            <></>
        </SimpleForm>        
    </Create>
)
