import "./User.css"

const User = (props) => {

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
                <button onClick={() => props.onUserSelect(props.user)}>Select</button>
            </div>
        </div>
    )
}

export default User