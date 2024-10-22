import { useState, useEffect } from "react";
import "./FormUser.css"
import TextField from "../TextField"
import DropDownList from "../DropDownList"
import Button from "../Button"

const FormUser = ({ onUserAdded }) => {

    const userStatus = ["active","inactive"]
    const userRoles = ["Administrator","Full Access","Read-Only"]

    const [showUpdateList, setShowUpdateList] = useState(true);
    const [isUpdating, setIsUpdating] = useState(true);
    const [selectedUser, setSelectedUser] = useState(null);
    const [users, setUsers] = useState([]);

    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [fullName, setFullName] = useState("")
    const [email, setEmail] = useState("")
    const [phoneNumber, setPhoneNumber] = useState("")
    const [status, setStatus] = useState("inactive")
    const [role, setRole] = useState("User")
    const [profile_picture, setProfile_picture] = useState("")
    
    const fetchUsers = () => {
      fetch("http://192.168.56.107:5000/api/user")
        .then((response) => response.json())
        .then((data) => {
          setUsers(data);
        })
        .catch((error) => {
          console.error("Error fetching users:", error);
        });
    };

    const loadUserData = (user) => {
      setUsername(user.username);
      setPassword(user.password);
      setFullName(user.full_name);
      setEmail(user.email);
      setPhoneNumber(user.phone_number);
      setStatus(user.status);
      setRole(user.role);
      setProfile_picture(user.profile_picture);
      setSelectedUser(user);
      setIsUpdating(true);
    };
    
    useEffect(() => {
      fetchUsers();
    }, []);

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
          profile_picture,
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
            setProfile_picture("");

            if (onUserAdded) {
              onUserAdded();
            }

          })
          .catch((error) => {
            console.error("Erro:", error);
            alert("Failed to add user");
          });
      };

      const updateHandler = (event) => {
        event.preventDefault();
      
        const updatedUser = {
          username,
          password,
          fullName,
          role,
          email,
          phoneNumber,
          status,
          profile_picture,
        };
      
        fetch(`http://192.168.56.107:5000/api/user?user_id=${selectedUser.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedUser),
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error("Error updating user");
            }
            return response.text();
          })
          .then((data) => {
            alert("User updated successfully!");
            setIsUpdating(false);
            setSelectedUser(null);
            clearForm();
            fetchUsers();
          })
          .catch((error) => {
            console.error("Error updating user:", error);
            alert("Failed to update user");
          });
      };
      
      const cancelHandler = () => {
        setIsUpdating(false);
        setSelectedUser(null);
        clearForm();
      };
      
      const clearForm = () => {
        setUsername("");
        setPassword("");
        setFullName("");
        setEmail("");
        setPhoneNumber("");
        setStatus("inactive");
        setRole("User");
        setProfile_picture("");
      };
      

    return (
        <section className="form">
            <form onSubmit={isUpdating ? updateHandler : submitHandler}>
            <h2>{isUpdating ? "Update User" : "Fill in the new user details"}</h2>
                <TextField 
                    mandatory={isUpdating ? true : false} 
                    label="Username"
                    value={username}
                    setValue = {value => setUsername(value)}

                />
                <TextField 
                    mandatory={isUpdating ? true : false}  
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

                <TextField 
                    label="URL Profile Picture"
                    value={profile_picture}
                    setValue = {value => setProfile_picture(value)}  
                />

                <DropDownList 
                    label="Access Level" 
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
                
                {isUpdating ? (
                  <>
                    <Button onClick={updateHandler}>Confirm</Button>
                    <Button onClick={cancelHandler}>Cancel</Button>
                  </>
                ) : (
                  <>
                    <Button>Add New</Button>
                    <Button onClick={() => {setShowUpdateList(true); setIsUpdating(true)}}>Update</Button>
                  </>
                )}
                {showUpdateList && (
                  <DropDownList
                    label="Select User to Update"
                    itens={users.map((user) => user.username)}
                    value={selectedUser ? selectedUser.username : ""}
                    setValue={(value) => {
                      const user = users.find((u) => u.username === value);
                      if (user) {
                        setSelectedUser(user);
                        loadUserData(user);
                      }
                    }}
                  />
                )}   
            </form>
        </section>
    )
}

export default FormUser