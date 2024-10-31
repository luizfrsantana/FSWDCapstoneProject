import React, { useState, useEffect, useCallback } from "react";
import "./UserPage.css";
import Users from "../Users";

const UserPage = () => {

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [fullname, setFullname] = useState("")
  const [email, setEmail] = useState("")
  const [phonenumber, setPhonenumber] = useState("")
  const [profilepicture, setProfilepicture] = useState("")
  const [role, setRole] = useState("read-only")
  const [userstatus, setUserstatus] = useState("active")


  const [users, setUsers] = useState([]);
  const [selectedUse, setSelectedUse] = useState(null);

  const loadUsers = useCallback(async () => {
    try {
      const response = await fetch("http://192.168.56.107:5000/api/user");
      const data = await response.json();
      setUsers(data);

    } catch (error) {
      console.error("Error loading users:", error);
    }
  }, []);  

  useEffect(() => {
    loadUsers(); 
  }, [loadUsers]);

const loadUserSelected = (user) => {
  setSelectedUse(user);
  fillInputbox(user);
}

const fillInputbox = (use) => {
  setUsername(use.username)
  setPassword(use.password)
  setFullname(use.full_name || '')
  setEmail(use.email || '')
  setPhonenumber(use.phone_number || '')
  setProfilepicture(use.profile_picture|| '')
  setRole(use.role || 'read-only')
  setUserstatus(use.status || 'active')
} 

const handleAddBtnUser = async () => {
  const newUser = {
    username,
    password,
    fullname,
    email,
    phonenumber,
    "profile_picture":profilepicture,
    role,
    "status":userstatus,
  };

  try {
    const response = await fetch(`http://192.168.56.107:5000/api/user`, 
      {method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newUser),
      });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    loadUsers();
    handlecancelBtnUser();
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);
  }
};

const handleDelBtnUser = async () => {
  if (!selectedUse) return;
  try {
    const response = await fetch(`http://192.168.56.107:5000/api/user?user_id=${selectedUse.id}`, {method: "DELETE"});
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    loadUsers();
    handlecancelBtnUser();
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);
  }
};


const handleUpdBtnUser = async () => {
  if (!selectedUse) return;
  const newUseValues = {
    username,
    password,
    fullname,
    email,
    phonenumber,
    "profile_picture":profilepicture,
    role,
    "status":userstatus,
  };

  try {
    const response = await fetch(`http://192.168.56.107:5000/api/user?user_id=${selectedUse.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newUseValues),
    });
    
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    
    loadUsers();
    handlecancelBtnUser();
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);
  }
};

const handlecancelBtnUser = () => {
  fillInputbox({
    username: "",
    fullname: "",
    email: "",
    phonenumber: "",
    profile_picture: "",
    role: "read-only",
    status: "active",
  });
  setSelectedUse(null);
};

const handlerUsername = (event) => {
  setUsername(event.target.value)
}

const handlerPassword = (event) => {
  setPassword(event.target.value)
}

const handlerFullname = (event) => {
  setFullname(event.target.value)
}

const handlerEmail = (event) => {
  setEmail(event.target.value)
}

const handlerPhonenumber = (event) => {
  setPhonenumber(event.target.value)
}

const handlerProfilepicture = (event) => {
  setProfilepicture (event.target.value)
}

const handlerRole = (event) => {
  setRole(event.target.value)
}

const handlerUserstatus = (event) => {
  setUserstatus(event.target.value)
}

  return (
    <div className="userpage">
        <div className="addpanel">
          <div className="addpaneldiv">
            <label htmlFor="username">Username</label> <br />
            <input className="addpanelinput" 
                    type="text" 
                    name="username" 
                    id="username"
                    value={username}
                    onChange={handlerUsername}
            />  
            <br />
          </div>
          <div className="addpaneldiv">  
            <label htmlFor="password">Password</label>  <br />
            <input className="addpanelinput"
                    type="password"
                    name="password" 
                    id="password" 
                    value={password} 
                    onChange={handlerPassword}>
            </input>
          </div>

          <div className="addpaneldiv">  
            <label htmlFor="fullname">Full Name</label>  <br />
            <input className="addpanelinput"
                type="text"
                name="fullname" 
                id="fullname" 
                value={fullname} 
                onChange={handlerFullname} 
              />
          </div>


          
          
          <div className="addpaneldiv">
            <label htmlFor="email">Email</label> <br />
            <input className="addpanelinput" 
                    type="text" 
                    name="email" 
                    id="email"
                    value={email}
                    onChange={handlerEmail}
            />  
            <br />
          </div>

          <div className="addpaneldiv">
            <label htmlFor="phonenumber">Phone Number</label> <br />
            <input className="addpanelinput" 
                    type="text" 
                    name="phonenumber" 
                    id="phonenumber"
                    value={phonenumber}
                    onChange={handlerPhonenumber}
            />  
            <br />
          </div>

          <div className="addpaneldiv">
            <label htmlFor="profilepicture">Profile Picture</label> <br />
            <input className="addpanelinput" 
                    type="text" 
                    name="profilepicture" 
                    id="profilepicture"
                    value={profilepicture}
                    onChange={handlerProfilepicture}
            />  
            <br />
          </div>

          <div className="addpaneldiv">
            <label htmlFor="role">Role</label> <br />
            <select className="addpanelinput"
                    name="role" 
                    id="role" 
                    value={role} 
                    onChange={handlerRole}>
                      <option>administrator</option>
                      <option>full-access</option>
                      <option>read-only</option>
            </select>  
            <br />
          </div>

          <div className="addpaneldiv">
            <label htmlFor="userstatus">Status</label> <br />
            <select className="addpanelinput"
                    name="userstatus" 
                    id="userstatus" 
                    value={userstatus} 
                    onChange={handlerUserstatus}>
                      <option>active</option>
                      <option>inactive</option>
            </select>  
            <br />
          </div>
          <br />
          {!selectedUse && <button className="addBtnUser" onClick={handleAddBtnUser}>Add</button>}
          {selectedUse && <button className="delBtnUser" onClick={handleDelBtnUser}>Delete</button>}
          {selectedUse && <button className="updBtnUser" onClick={handleUpdBtnUser}>Update</button>}
          {selectedUse && <button className="cancelBtnUser" onClick={handlecancelBtnUser}>Cancel Update/Delete</button>}
        </div>

      
 
      <Users users={users} onUserSelect={loadUserSelected} />
      
    </div>
  );
};

export default UserPage;