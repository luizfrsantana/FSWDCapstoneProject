import React, { useState, useEffect } from "react";
import "./UserPage.css"
import FormUser from "../FormUser"
import Users from "../Users"

const UserPage = () =>{
    const [users, setUsers] = useState([]);

    const loadUsers = async () => {
      try {
        const response = await fetch('http://192.168.56.107:5000/api/user');
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Error loading users:", error);
      }
    };

    useEffect(() => {
        loadUsers();
      }, []);


    return(
        <div className="userpage">
            <FormUser onUserAdded={loadUsers} />
            <Users users={users} onUserDeleted={loadUsers} />
        </div>
    )
}

export default UserPage