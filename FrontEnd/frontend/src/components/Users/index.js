import User from "../User"
import "./Users.css"

const Users = (props) => {
    return (
        <section className="users">
            <div className="card-users">
                {props.users.map(user => <User key={user.id} user={user} onUserDeleted={props.onUserDeleted} />)}
            </div>
            
        </section>
    )
}

export default Users