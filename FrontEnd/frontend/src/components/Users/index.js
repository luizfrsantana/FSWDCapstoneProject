import User from "../User"
import "./Users.css"

const Users = (props) => {
    return (
        <section className="users">
            {props.users.map(user => <User user={user}/>)}
        </section>
    )
}

export default Users