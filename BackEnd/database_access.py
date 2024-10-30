
### User DB ###

def user_exists(mysql, user_id):
    cur = mysql.connection.cursor()
    cur.execute("SELECT COUNT(1) FROM users WHERE id = %s", (user_id,))
    result = cur.fetchone()
    cur.close()
    return result[0] == 1


def add_user_to_database(mysql, username, hashed_password, role, email, phoneNumber, status, fullName, profile_picture):
    cur = mysql.connection.cursor()
    cur.execute("INSERT INTO users (username, password, role, email, phone_number,status, full_name, profile_picture) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)", (username, hashed_password, role, email, phoneNumber, status, fullName, profile_picture))
    mysql.connection.commit()
    cur.close()

def delete_user_by_id(mysql, user_id):
    cur = mysql.connection.cursor()
    cur.execute("DELETE FROM users WHERE id = %s", (user_id,))
    mysql.connection.commit()
    cur.close()

def get_user_by_id(mysql, user_id):
    cur = mysql.connection.cursor()
    cur.execute("SELECT * FROM users WHERE id = %s", (user_id,))
    user = cur.fetchall()
    cur.close()
    return user

def get_users(mysql):
    cur = mysql.connection.cursor()
    cur.execute("SELECT id, username, full_name, email, phone_number, role, created_at, updated_at, status, profile_picture FROM users")
    columns = [col[0] for col in cur.description]
    users = cur.fetchall()
    cur.close()
    result = [dict(zip(columns, user)) for user in users]

    return result

def update_user_field_by_id(mysql, username, role, email, phoneNumber, status, fullName, profile_picture, user_id):
    cur = mysql.connection.cursor()
    cur.execute("""
    UPDATE users 
    SET username = %s, full_name = %s, email = %s, phone_number = %s, status = %s, role = %s, profile_picture = %s
    WHERE id = %s
    """, (username, fullName, email, phoneNumber, status, role, profile_picture, user_id, ))

    mysql.connection.commit()
    cur.close()

### Devices DB ###

def get_device_access_information_db_by_id(mysql, device_id):
    cur = mysql.connection.cursor()
    cur.execute("SELECT mgmt_ip, vendor FROM devices WHERE id=%s;", (device_id,) )
    columns = [col[0] for col in cur.description]
    devices = cur.fetchall()
    cur.close()
    result = [dict(zip(columns, device)) for device in devices]
    return result

def delete_device_to_database(mysql, id):
    cur = mysql.connection.cursor()
    cur.execute("DELETE FROM devices WHERE id = %s;", (id,))
    mysql.connection.commit()
    cur.close()

def get_devices(mysql):
    cur = mysql.connection.cursor()
    cur.execute("SELECT id, device_name, mgmt_ip,vendor,location, os_version, serial_number, model, status, installation_date, warranty_expiration, last_maintenance, support_contact, notes FROM devices")
    columns = [col[0] for col in cur.description]
    devices = cur.fetchall()
    cur.close()
    result = [dict(zip(columns, device)) for device in devices]
    return result

def add_device_to_database(mysql, mgmt_ip, vendor, location, installation_date,warranty_expiration,last_maintenance,support_contact,notes, status):
    cur = mysql.connection.cursor()
    cur.execute("INSERT INTO devices (mgmt_ip, vendor,location, installation_date,warranty_expiration,last_maintenance,support_contact,notes,status) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)", (mgmt_ip, vendor,location, installation_date,warranty_expiration,last_maintenance,support_contact,notes,status))
    mysql.connection.commit()
    cur.close()

def get_device_by_ip_database(mysql, mgmt_ip):
    cur = mysql.connection.cursor()
    cur.execute("SELECT id, device_name, mgmt_ip, os_version, vendor FROM devices WHERE mgmt_ip = %s", (mgmt_ip,))
    device = cur.fetchall()
    cur.close()
    return device

def update_device_informations(mysql, mgmt_ip, vendor,location, installation_date, warranty_expiration, last_maintenance, support_contact,notes,status):
    cur = mysql.connection.cursor()
    cur.execute("""UPDATE devices SET 
                vendor = %s,
                location = %s,
                installation_date = %s,
                warranty_expiration = %s,
                last_maintenance = %s,
                support_contact = %s,
                notes = %s,
                status = %s

                WHERE mgmt_ip = %s""",

                (vendor,location, installation_date, warranty_expiration, 
                 last_maintenance,support_contact,notes,status,mgmt_ip))
    mysql.connection.commit()
    cur.close()


def update_device_informations_from_device(mysql, mgmt_ip, device_informations):
    cur = mysql.connection.cursor()
    cur.execute("UPDATE devices SET device_name = %s, os_version = %s, serial_number = %s, model = %s  WHERE mgmt_ip = %s",
                (device_informations['hostname'], device_informations['os_version'], device_informations['serial_number'], device_informations['model'], mgmt_ip))
    mysql.connection.commit()
    cur.close()


### Connections DB ###

def get_connections_db(mysql):
    cur = mysql.connection.cursor()
    
    cur.execute("""
        SELECT 
            d_a.device_name AS device_name_a,
            i_a.interface_name AS interface_name_a,
            i_a.ip AS ip_a,
            
            i_z.ip AS ip_z,
            i_z.interface_name AS interface_name_z,
            d_z.device_name AS device_name_z
            
        FROM connections c
        JOIN interfaces i_a ON c.id_interface_a = i_a.id
        JOIN devices d_a ON i_a.device_id = d_a.id
        JOIN interfaces i_z ON c.id_interface_z = i_z.id
        JOIN devices d_z ON i_z.device_id = d_z.id;
    """)

    columns = [col[0] for col in cur.description]
    connections = cur.fetchall()
    cur.close()
    result = [dict(zip(columns, connection)) for connection in connections]
    return result

def action_connection_to_db(mysql, action, id_connection_a, id_connection_z):
    cur = mysql.connection.cursor()
    if action == 'DELETE':
        cur.execute("DELETE FROM connections WHERE id_interface_a = %s AND id_interface_z = %s",(id_connection_a, id_connection_z))
    elif action == 'POST':
        cur.execute("INSERT INTO connections (id_interface_a, id_interface_z) VALUES (%s, %s)",(id_connection_a, id_connection_z))
    mysql.connection.commit()
    cur.close()


def save_interfaces_to_db(mysql, device_id, interfaces, is_juniper=False):
    cur = mysql.connection.cursor()

    cur.execute("SELECT interface_name, device_id  FROM interfaces")
    database_interfaces = cur.fetchall()
    
    if is_juniper:
        for interface, interface_data in interfaces.items():
            ip_address = interface_data.get('ip_address', 'No IP')
            description = interface_data.get('description', 'No description')

            Is_interface_setUp = any(interface in tupla and device_id in tupla for tupla in database_interfaces)
            
            if Is_interface_setUp:
                                cur.execute("UPDATE interfaces SET ip = %s,  description = %s, vlan = %s, last_down = %s, last_up = %s, physical_status = %s, protocol_status = %s  WHERE device_id = %s AND interface_name = %s",
                            (interfaces[interface]["ip_address"], interfaces[interface]["description"], 
                             interfaces[interface]["vlan"],interfaces[interface]["last_down"],
                             interfaces[interface]["last_up"],interfaces[interface]["physical_status"],
                             interfaces[interface]["protocol_status"],
                             device_id, interface,
                             ))
            else:   
                cur.execute("INSERT INTO interfaces (device_id, interface_name, ip, description) VALUES (%s, %s, %s, %s)",(device_id, interface_name, ip_address, description))
    else:
        for interface in interfaces:
            Is_interface_setUp = any(interface in tupla and device_id in tupla for tupla in database_interfaces)

            if Is_interface_setUp:
                cur.execute("UPDATE interfaces SET ip = %s,  description = %s, vlan = %s, last_down = %s, last_up = %s, physical_status = %s, protocol_status = %s  WHERE device_id = %s AND interface_name = %s",
                            (interfaces[interface]["ip_address"], interfaces[interface]["description"], 
                             interfaces[interface]["vlan"],interfaces[interface]["last_down"],
                             interfaces[interface]["last_up"],interfaces[interface]["physical_status"],
                             interfaces[interface]["protocol_status"],
                             device_id, interface,
                             ))
            else:
                cur.execute("INSERT INTO interfaces (device_id, interface_name, ip, description,vlan,last_down,last_up,physical_status,protocol_status) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)",
                             (device_id, interface, interfaces[interface]["ip_address"], interfaces[interface]["description"],
                              interfaces[interface]["vlan"],interfaces[interface]["last_down"],
                              interfaces[interface]["last_up"],interfaces[interface]["physical_status"],
                              interfaces[interface]["protocol_status"],
                              ))


    mysql.connection.commit()
    cur.close()


    ### Interfaces DB ###

def get_interfaces(mysql):
    cur = mysql.connection.cursor()
    cur.execute("""SELECT interfaces.id, 
                    interfaces.interface_name, 
                    interfaces.ip, 
                    interfaces.description, 
                    interfaces.device_id,
                    devices.device_name AS device_name, 
                    interfaces.last_down, 
                    interfaces.last_up, 
                    interfaces.vlan, 
                    interfaces.physical_status,
                    interfaces.protocol_status
                    FROM interfaces
                    JOIN devices ON interfaces.device_id = devices.id;
    """)
    columns = [col[0] for col in cur.description]
    interfaces = cur.fetchall()
    cur.close()
    result = [dict(zip(columns, interface)) for interface in interfaces]
    return result