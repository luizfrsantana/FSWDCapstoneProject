import { useState } from "react"
import "./Form.css"
import TextField from "../TextField"
import DropDownList from "../DropDownList"
import Button from "../Button"

const Form = (props) => {

    const userStatus = ["active","inactive"]

    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [fullName, setFullName] = useState("")
    const [email, setEmail] = useState("")
    const [phoneNumber, setPhoneNumber] = useState("")
    const [status, setStatus] = useState("inactive")

    const submitHandler = (event) => {
        event.preventDefault()
        console.log("Oi => ",username,fullName )
    }

    return (
        <section className="form">
            <form onSubmit={submitHandler}>
                <h2>Fill in the details to register a new {props.object}</h2>
                <TextField 
                    mandatory={true} 
                    label="Username"
                    value={username}
                    setValue = {value => setUsername(value)}

                />
                <TextField 
                    mandatory={true} 
                    type="password" 
                    label="Password" 
                    value={password}
                    setValue = {value => setPassword(value)}
                />
                <TextField 
                    label="Full name" 
                    value={fullName}
                    setValue = {value => setFullName(value)}
                />
                <TextField 
                    label="Email"
                    value={email}
                    setValue = {value => setEmail(value)} 
                />
                <TextField 
                    label="Phone Number"
                    value={phoneNumber}
                    setValue = {value => setPhoneNumber(value)}  
                />
                <DropDownList 
                    label="Status" 
                    itens= {userStatus}
                    value={status}
                    setValue = {value => setStatus(value)}   
                />  
                <Button>Add User</Button>   
            </form>
        </section>
    )
}

export default Form