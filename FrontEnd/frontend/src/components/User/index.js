import "./User.css"

const User = (props) => {

  const deleteUser = async () => {
    try {
      const response = await fetch(`http://192.168.56.107:5000/api/user?user_id=${props.user.id}`, {
        method: "DELETE",
      });
  
      if (response.ok) {
        alert("User deleted successfully!");
        if (props.onUserDeleted) {
          props.onUserDeleted(); 
        } else {
          console.log("onUserDeleted is not defined");
        }
      } else {
        alert("Failed to delete user");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };


    return (
        <div className="user">
            <div className="header">
                <img src={props.user.profile_picture} alt={props.user.username}/>

            </div>
            <div className="footer">
                <h4>{props.user.full_name}</h4>
                <h5>{props.user.username}</h5>
                <h5>{props.user.email}</h5>
                <h5>{props.user.status}</h5>
                <button onClick={deleteUser}>Delete</button>
            </div>
        </div>
    )
}

export default User