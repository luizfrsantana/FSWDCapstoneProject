const Home = () => {
    return (
        <div className="home">
            <h1>Welcome to the FSWD Capstone Project</h1>
            <p>The FSWD Capstone Project is a user-friendly platform designed to help network administrators manage and configure network devices easily and efficiently.</p>
    
            <h2>Key Features</h2>
    
            <div className="feature">
                <p><strong>Manage Cisco and Juniper Devices:</strong> Quickly configure and manage your network equipment.</p>
            </div>
    
            <div className="feature">
                <p><strong>Control Network Connections:</strong> Easily add or remove connections between interfaces.</p>
            </div>
    
            <div className="feature">
                <p><strong>User Management:</strong> Create and manage users with different access levels.</p>
            </div>
    
            <div className="feature">
                <p><strong>Interactive Dashboard:</strong> View real-time information about your network, including device status and connection details.</p>
            </div>
    
            <div className="cta">
                <a href="#">Start managing your network with ease today!</a>
            </div>
        </div>
    );
}

export default Home;