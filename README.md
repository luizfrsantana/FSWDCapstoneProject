# NetAdmin Portal

## Project Overview

The **NetAdmin Portal** is a web application designed to assist IT personnel, even those without prior knowledge of network devices, in configuring and activating new network equipment. The portal will offer an intuitive interface for managing network devices, including adding, updating, deleting, and connecting them. Access control will ensure that users only interact with devices they are authorized to manage.

## Features

- **User Authentication**: Users must register and log in to access the portal. Permissions will be applied to restrict access to authorized devices only.
- **User Activity Log**: The portal will log all user actions to facilitate issue tracking and auditing.
- **Device CRUD Operations**: Users will be able to add, update, and remove network devices through a dedicated interface.
- **Device Connections**: The portal allows users to create and manage connections between network devices.
- **Access Control**: Validation ensures that users only see information and devices they have permission to manage.

### Exploration and Brainstorming

- **Exploration**: For the app to function, spaces will be provided to add, update, delete, and read devices. Access validation will ensure that users only view and interact with devices they have permission to manage.
- **Brainstorming**: We discussed whether to visualize connections between devices or represent them through text boxes.

## Required Screens

1. **Login Page**: A screen for user login.
2. **User CRUD Page**: A screen for creating, reading, updating, and deleting user information.
3. **Device CRUD Page**: A screen for performing CRUD operations on network devices.
4. **Connection CRUD Page**: A screen for managing the connections between network devices.
5. **User Logs Page**: A screen for accessing logs of user actions within the portal.

## Technology Stack

### Frontend

- **React.js**: For building UI components.
- **React Router**: For managing navigation between different views.

### Backend

- **Flask** or **Django**: To be used as the backend API, facilitating communication between the devices and the database.

### Database

- **MySQL**: The database was chosen for storing user data, device information, and logs.

### Network Virtualization

- **EVE-NG**: A network emulation tool that will be used to virtualize network devices.
  - [EVE-NG Official Website](https://www.eve-ng.net/)

## Additional Information

- **DER Proposal**: The design and engineering requirements have been discussed and are reflected in the portal's development plan.
  
## Visual Representation

The app will include diagrams to visualize the relationships between users, devices, and access control mechanisms. These diagrams will clarify how data flows between different components of the system, as well as how users will interact with devices.

## Conclusion

The **NetAdmin Portal** aims to simplify the management of network devices by offering a user-friendly platform for IT personnel. With strong emphasis on security, access control, and tracking user actions, the portal will ensure that only authorized users can manage the network devices, while keeping an audit trail of all actions performed.
