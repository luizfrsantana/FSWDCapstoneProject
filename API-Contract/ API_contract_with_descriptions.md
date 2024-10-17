# NetAdmin Portal API

This API allows managing network connections, users, devices, and interfaces for Cisco and Juniper devices. It supports operations like adding, deleting, configuring, and updating devices and connections.

## Base URL

`http://<server-ip>:5000`

---

## Connections Routes

### GET `/get_connections`
- **Description:** Retrieves all existing network connections.
- **Response:** 
  - `200 OK`: A list of connections in JSON format.

### POST `/add_connection`
- **Description:** Adds a new network connection.
- **Request Body:**
  - `id_interface_a`: ID of the first interface (string).
  - `id_interface_z`: ID of the second interface (string).
- **Response:** 
  - `200 OK`: "Connection added!"

### DELETE `/delete_connection`
- **Description:** Deletes an existing network connection.
- **Request Body:**
  - `id_interface_a`: ID of the first interface (string).
  - `id_interface_z`: ID of the second interface (string).
- **Response:**
  - `200 OK`: "Connection deleted!"

---

## User Routes

### GET `/user`
- **Description:** Retrieves details of a specific user by ID.
- **Query Parameters:**
  - `user_id`: User ID (string).
- **Responses:**
  - `200 OK`: User details in JSON format.
  - `400 Bad Request`: "User ID is required!"
  - `404 Not Found`: "User with ID {user_id} does not exist!"

### GET `/users`
- **Description:** Retrieves a list of all users.
- **Response:**
  - `200 OK`: List of users in JSON format.

### POST `/add_user`
- **Description:** Adds a new user to the system.
- **Request Body:**
  - `username`: Username (string).
  - `password`: Password (string).
  - `role`: User role (string).
- **Response:**
  - `200 OK`: "User added!"

### PATCH `/update_user_field`
- **Description:** Updates a specific field for a given user.
- **Query Parameters:**
  - `user_id`: User ID (string).
- **Request Body:**
  - `field`: Field to be updated (string).
  - `new_value`: New value for the field (string).
- **Responses:**
  - `200 OK`: "User {field} updated successfully!"
  - `400 Bad Request`: "Field and new value are required!"
  - `404 Not Found`: "User with ID {user_id} does not exist!"

### DELETE `/delete_user`
- **Description:** Deletes a user by ID.
- **Query Parameters:**
  - `user_id`: User ID (string).
- **Response:**
  - `200 OK`: "User with ID {user_id} deleted!"

---

## Devices Routes

### DELETE `/delete_device`
- **Description:** Deletes a device by its management IP.
- **Query Parameters:**
  - `mgmt_ip`: Management IP of the device (string).
- **Response:**
  - `200 OK`: "Device with MGMT IP {mgmt_ip} deleted!"
  - `500 Internal Server Error`: Error message if device deletion fails.

### POST `/add_device`
- **Description:** Adds a new network device (Cisco or Juniper).
- **Request Body:**
  - `mgmt_ip`: Management IP of the device (string).
  - `vendor`: Device vendor, e.g., Cisco or Juniper (string).
- **Responses:**
  - `200 OK`: JSON with the device information.
  - `400 Bad Request`: Vendor not supported or missing parameters.
  - `500 Internal Server Error`: "Device {mgmt_ip} is not reachable" or database update error.

### PATCH `/update_device`
- **Description:** Updates information of an existing network device.
- **Query Parameters:**
  - `mgmt_ip`: Management IP of the device (string).
  - `vendor`: Device vendor (string).
- **Responses:**
  - `200 OK`: JSON with updated device information.
  - `500 Internal Server Error`: "Device {mgmt_ip} is not reachable" or database update error.

---

## Interfaces Routes

### GET `/update_interfaces`
- **Description:** Updates and retrieves the interfaces for all reachable devices.
- **Response:**
  - `200 OK`: A list of devices with interface information.
  - `500 Internal Server Error`: If a device is unreachable or vendor is not supported.

---

## Configuration Routes

### POST `/configure/juniper`
- **Description:** Configures a Juniper device interface.
- **Request Body:**
  - `host`: Device host IP (string).
  - `description`: Interface description (string).
  - `interface`: Interface name (string).
  - `ip`: Interface IP (string).
- **Responses:**
  - `200 OK`: Configuration result in JSON.
  - `400 Bad Request`: Missing parameters.
  - `500 Internal Server Error`: "Device {host} is not reachable."

### POST `/configure/cisco`
- **Description:** Configures a Cisco device interface.
- **Request Body:**
  - `host`: Device host IP (string).
  - `description`: Interface description (string).
  - `interface`: Interface name (string).
  - `ip`: Interface IP (string).
- **Responses:**
  - `200 OK`: Configuration result in JSON.
  - `400 Bad Request`: Missing parameters.
  - `500 Internal Server Error`: "Device {host} is not reachable."

---

## Running the Application

To run the Flask application, execute:

```bash
python app.py
