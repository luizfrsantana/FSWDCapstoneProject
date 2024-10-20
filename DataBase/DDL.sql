=========

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    email VARCHAR(100) NOT NULL,
    phone_number VARCHAR(15),
    profile_picture TEXT,
    role VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    status ENUM('active', 'inactive') DEFAULT 'active'
);

===========

CREATE TABLE logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    device_id INT NOT NULL,
    action_description TEXT NOT NULL, 
    action_type ENUM('create', 'update', 'delete', 'maintenance', 'other') DEFAULT 'update',
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
    previous_state TEXT, 
    new_state TEXT,
    CONSTRAINT fk_user
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_device
        FOREIGN KEY (device_id) REFERENCES devices(id) ON DELETE CASCADE 
);

==========



CREATE TABLE devices (
    id INT AUTO_INCREMENT PRIMARY KEY,           
    device_name VARCHAR(50),        
    mgmt_ip VARCHAR(255) NOT NULL,             
    vendor VARCHAR(50) NOT NULL,                        
    os_version VARCHAR(255),          
    serial_number VARCHAR(100),          
    model VARCHAR(50),          
    location VARCHAR(100),        
    status ENUM('active', 'inactive', 'maintenance') DEFAULT 'active',
    installation_date DATE,
    warranty_expiration DATE, 
    last_maintenance TIMESTAMP,
    support_contact VARCHAR(100),
    notes TEXT,         
    UNIQUE (mgmt_ip)                         
);


==========

CREATE TABLE interfaces (
    id INT AUTO_INCREMENT PRIMARY KEY,
    interface_name VARCHAR(50) NOT NULL,
    ip VARCHAR(255),
    description VARCHAR(50),
    device_id INT,
    status ENUM('up', 'down', 'maintenance') DEFAULT 'down',
    speed VARCHAR(20),
    vlan INT,
    last_active TIMESTAMP,
    CONSTRAINT fk_device_id
        FOREIGN KEY (device_id) REFERENCES devices(id) ON DELETE CASCADE
);
==========

CREATE TABLE connections (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_interface_a INT NOT NULL,
    id_interface_z INT NOT NULL,
    connection_type ENUM('copper', 'fiber', 'wireless') DEFAULT 'copper',
    status ENUM('active', 'inactive', 'maintenance') DEFAULT 'active',
    speed VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    description TEXT,
    CONSTRAINT fk_interface_a
        FOREIGN KEY (id_interface_a) REFERENCES interfaces(id) ON DELETE CASCADE,
    CONSTRAINT fk_interface_z
        FOREIGN KEY (id_interface_z) REFERENCES interfaces(id) ON DELETE CASCADE 
);
