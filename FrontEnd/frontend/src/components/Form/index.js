import "./Form.css"
import TextField from "../TextField"
import DropDownList from "../DropDownList"
import Button from "../Button"

const Form = (props) => {

    const userStatus = ["active","inactive"]

    return (
        <section className="form">
            <form>
                <h2>Fill in the details to register a new {props.object}</h2>
                <TextField label="Name" />
                <TextField label="Email" />
                <TextField label="Phone Number" />
                <DropDownList label="Status" itens= {userStatus} />  
                <Button>Add User</Button>   
            </form>
        </section>
    )
}

export default Form