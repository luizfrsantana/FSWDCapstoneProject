import { useState } from "react"
import "./FormUser.css"
import TextField from "../TextField"
import DropDownList from "../DropDownList"
import Button from "../Button"

const FormUser = (props) => {

    const userStatus = ["active","inactive"]
    const userRoles = ["Admin","User"]

    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [fullName, setFullName] = useState("")
    const [email, setEmail] = useState("")
    const [phoneNumber, setPhoneNumber] = useState("")
    const [status, setStatus] = useState("inactive")
    const [role, setRole] = useState("User")

    const submitHandler = (event) => {
        event.preventDefault();
    
        const newUser = {
          username,
          password,
          fullName,
          role,
          email,
          phoneNumber,
          status,
        };
    
        fetch("http://192.168.56.107:5000/api/user", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newUser),
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error("Error adding user");
            }
            return response.text();
          })
          .then((data) => {
            console.log(data);
            alert("User added successfully!");
            setUsername("");
            setPassword("");
            setFullName("");
            setEmail("");
            setPhoneNumber("");
            setStatus("inactive");
          })
          .catch((error) => {
            console.error("Erro:", error);
            alert("Failed to add user");
          });
      };

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
                    label="Role" 
                    itens= {userRoles}
                    value={role}
                    setValue = {value => setRole(value)}   
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

export default FormUser