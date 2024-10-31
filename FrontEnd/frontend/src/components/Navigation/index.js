import { Link } from "react-router-dom";
import "./Navigation.css"
import { useNavigate } from "react-router-dom";

const Navigation = () => {
    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.removeItem("authToken");
        navigate("/");
    };

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
            <li>
                <button onClick={handleLogout}>Log Off</button>
            </li>
            </ul>
        </nav>
      </div>
    )
}

export default Navigation