# NetAdmin Portal API

This API allows managing network connections, users, devices, and interfaces for Cisco and Juniper devices. It supports operations like adding, deleting, configuring, and updating devices and connections.

## Base URL

`http://<server-ip>:5000`

---

## Authentication Routes

### POST `/api/login`
- **Description:** Authenticates a user and provides a JWT access token.
- **Request Body:**
  - `username`: Username (string).
  - `password`: Password (string).
- **Response:**
  - `200 OK`: Returns a JWT token.
  - `404 Not Found`: "User not found"
  - `401 Unauthorized`: "Incorrect password"

---

## Connections Routes

### GET `/api/connections`
- **Description:** Retrieves all existing network connections.
- **Response:** 
  - `200 OK`: A list of connections in JSON format.

### POST `/api/connections`
- **Description:** Adds a new network connection.
- **Request Body:**
  - `id_interface_a`: ID of the first interface (string).
  - `id_interface_z`: ID of the second interface (string).
- **Response:** 
  - `200 OK`: "Connection added!"

### DELETE `/api/connections`
- **Description:** Deletes an existing network connection.
- **Request Body:**
  - `id_interface_a`: ID of the first interface (string).
  - `id_interface_z`: ID of the second interface (string).
- **Response:**
  - `200 OK`: "Connection deleted!"

---

## User Routes

### GET `/api/user`
- **Description:** Retrieves details of a specific user by ID.
- **Query Parameters:**
  - `user_id`: User ID (string).
- **Responses:**
  - `200 OK`: User details in JSON format.
  - `400 Bad Request`: "User ID is required!"
  - `404 Not Found`: "User with ID {user_id} does not exist!"

### GET `/api/user` (without `user_id`)
- **Description:** Retrieves a list of all users.
- **Response:**
  - `200 OK`: List of users in JSON format.

### POST `/api/user`
- **Description:** Adds a new user to the system.
- **Request Body:**
  - `username`: Username (string).
  - `password`: Password (string).
  - `fullname`: Full name of the user (string).
  - `profile_picture`: URL of profile picture (string).
  - `role`: User role (string).
  - `email`: Email address (string).
  - `phonenumber`: Phone number (string).
  - `status`: User status (string).
- **Response:**
  - `201 Created`: "User added!"
  - `400 Bad Request`: "Missing required fields!"

### PUT `/api/user`
- **Description:** Updates information for a specific user by ID.
- **Query Parameters:**
  - `user_id`: User ID (string).
- **Request Body:**
  - `username`: Username (string).
  - `password`: Password (string).
  - `fullname`: Full name of the user (string).
  - `profile_picture`: URL of profile picture (string).
  - `role`: User role (string).
  - `email`: Email address (string).
  - `phonenumber`: Phone number (string).
  - `status`: User status (string).
- **Responses:**
  - `200 OK`: "User updated successfully!"
  - `400 Bad Request`: "Missing required fields!"
  - `404 Not Found`: "User with ID {user_id} does not exist!"

### DELETE `/api/user`
- **Description:** Deletes a user by ID.
- **Query Parameters:**
  - `user_id`: User ID (string).
- **Response:**
  - `200 OK`: "User with ID {user_id} deleted!"
  - `400 Bad Request`: "User ID is required!"

---

## Devices Routes

### GET `/api/device`
- **Description:** Retrieves a list of all devices.
- **Response:**
  - `200 OK`: List of devices in JSON format.

### POST `/api/device`
- **Description:** Adds a new network device (Cisco or Juniper).
- **Request Body:**
  - `mgmt_ip`: Management IP of the device (string).
  - `vendor`: Device vendor, e.g., Cisco or Juniper (string).
  - `location`: Device location (string).
  - `installation_date`: Installation date (string).
  - `warranty_expiration`: Warranty expiration date (string).
  - `last_maintenance`: Date of last maintenance (string).
  - `support_contact`: Support contact information (string).
  - `notes`: Additional notes (string).
- **Responses:**
  - `200 OK`: JSON with the device information.
  - `400 Bad Request`: "Vendor not supported or missing parameters."
  - `500 Internal Server Error`: "Device {mgmt_ip} is not reachable" or database update error.

### PATCH `/api/device`
- **Description:** Updates information of an existing network device.
- **Request Body:**
  - `mgmt_ip`: Management IP of the device (string).
  - `vendor`: Device vendor (string).
  - `location`: Device location (string).
  - `installation_date`: Installation date (string).
  - `warranty_expiration`: Warranty expiration date (string).
  - `last_maintenance`: Date of last maintenance (string).
  - `support_contact`: Support contact information (string).
  - `notes`: Additional notes (string).
- **Responses:**
  - `200 OK`: JSON with updated device information.
  - `500 Internal Server Error`: "Device {mgmt_ip} is not reachable" or database update error.

### DELETE `/api/device`
- **Description:** Deletes a device by its ID.
- **Query Parameters:**
  - `id`: Device ID (string).
- **Response:**
  - `200 OK`: "Device with ID {id} deleted!"
  - `500 Internal Server Error`: Error message if device deletion fails.

---

## Interfaces Routes

### GET `/api/interface`
- **Description:** Retrieves all network interfaces.
- **Response:**
  - `200 OK`: List of interfaces in JSON format.

### GET `/api/update_interfaces`
- **Description:** Updates and retrieves the interfaces for all reachable devices.
- **Response:**
  - `200 OK`: A list of devices with interface information.
  - `500 Internal Server Error`: If a device is unreachable or vendor is not supported.

### POST `/api/interface/update`
- **Description:** Updates a specific interface.
- **Request Body:**
  - `device_id`: ID of the device (string).
  - `description`: Interface description (string).
  - `interface_name`: Interface name (string).
  - `ip`: Interface IP (string).
- **Response:**
  - `200 OK`: Update result in JSON format.
  - `400 Bad Request`: "Missing parameters."
  - `500 Internal Server Error`: "Device {host} is not reachable."

### GET `/api/interface/status`
- **Description:** Retrieves the status of a Cisco device's interfaces.
- **Query Parameters:**
  - `host`: Device IP address (string).
- **Response:**
  - `200 OK`: Interface status in JSON format.

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
  - `400 Bad Request`: "Missing parameters."
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
  - `400 Bad Request`: "Missing parameters."
  - `500 Internal Server Error`: "Device {host} is not reachable."
