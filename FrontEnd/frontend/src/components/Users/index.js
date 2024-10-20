import User from "../User"
import "./Users.css"

const Users = (props) => {
    return (
        <section className="users">
            <div className="card-users">
                {props.users.map(user => <User key={user.id} user={user}/>)}
            </div>
            
        </section>
    )
}

export default Users