import { Link } from "react-router-dom";
import "./Navigation.css"

const Navigation = () => {
    return (
        <div className="navigation">
            <nav>
            <ul>
            <li>
                <Link to="/home">Home</Link>
            </li>
            <li>
                <Link to="/users">Users</Link>
            </li>
            <li>
                <Link to="/devices">Devices</Link>
            </li>
            <li>
                <Link to="/interfaces">Interfaces</Link>
            </li>
            <li>
                <Link to="/connections">Connections</Link>
            </li>
            </ul>
        </nav>
      </div>
    )
}

export default Navigation