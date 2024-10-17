
### User DB ###

def user_exists(mysql, user_id):
    cur = mysql.connection.cursor()
    cur.execute("SELECT COUNT(1) FROM users WHERE id = %s", (user_id,))
    result = cur.fetchone()
    cur.close()
    return result[0] == 1

def add_user_to_database(mysql, username, hashed_password, role, email):
    cur = mysql.connection.cursor()
    cur.execute("INSERT INTO users (username, password, role, email) VALUES (%s, %s, %s, %s)", (username, hashed_password, role, email))
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
    cur.execute("SELECT * FROM users")
    users = cur.fetchall()
    cur.close()
    return users

def update_user_field_by_id(mysql, field, new_value, user_id):
    cur = mysql.connection.cursor()
    cur.execute(f"UPDATE users SET {field} = %s WHERE id = %s", (new_value, user_id))
    mysql.connection.commit()
    cur.close()

### Devices DB ###

def delete_device_to_database(mysql, mgmt_ip):
    cur = mysql.connection.cursor()
    cur.execute("DELETE FROM devices WHERE mgmt_ip = %s;", (mgmt_ip,))
    mysql.connection.commit()
    cur.close()

def get_devices(mysql):
    cur = mysql.connection.cursor()
    cur.execute("SELECT id, device_name, mgmt_ip,vendor,os_version FROM devices")
    devices = cur.fetchall()
    cur.close()
    return devices

def add_device_to_database(mysql, mgmt_ip, vendor):
    cur = mysql.connection.cursor()
    cur.execute("INSERT INTO devices (mgmt_ip, vendor) VALUES (%s, %s)", (mgmt_ip, vendor))
    mysql.connection.commit()
    cur.close()

def get_device_by_ip_database(mysql, mgmt_ip):
    cur = mysql.connection.cursor()
    cur.execute("SELECT id, device_name, mgmt_ip, os_version, vendor FROM devices WHERE mgmt_ip = %s", (mgmt_ip,))
    device = cur.fetchall()
    cur.close()
    return device

def update_device_informations(mysql, mgmt_ip, device_informations):
    cur = mysql.connection.cursor()
    cur.execute("UPDATE devices SET device_name = %s,  os_version = %s WHERE mgmt_ip = %s",(device_informations['hostname'], device_informations['os_version'], mgmt_ip))
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
    
    connections = cur.fetchall()
    cur.close() 
    
    return connections 

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
        for interface_name, interface_data in interfaces.items():
            ip_address = interface_data.get('ip_address', 'No IP')
            description = interface_data.get('description', 'No description')

            Is_interface_setUp = any(interface_name in tupla and device_id in tupla for tupla in database_interfaces)
            
            if Is_interface_setUp:
                cur.execute("UPDATE interfaces SET ip = %s,  description = %s WHERE device_id = %s AND interface_name = %s",(ip_address, description, device_id, interface_name))
            else:   
                cur.execute("INSERT INTO interfaces (device_id, interface_name, ip, description) VALUES (%s, %s, %s, %s)",(device_id, interface_name, ip_address, description))
    else:
        for interface in interfaces:

            Is_interface_setUp = any(interface['interface_name'] in tupla and device_id in tupla for tupla in database_interfaces)

            if Is_interface_setUp:
                cur.execute("UPDATE interfaces SET ip = %s,  description = %s WHERE device_id = %s AND interface_name = %s",(interface['ip_address'], interface['description'], device_id, interface['interface_name']))
            else:
                cur.execute("INSERT INTO interfaces (device_id, interface_name, ip, description) VALUES (%s, %s, %s, %s)", (device_id, interface['interface_name'], interface['ip_address'], interface['description']))


    mysql.connection.commit()
    cur.close()