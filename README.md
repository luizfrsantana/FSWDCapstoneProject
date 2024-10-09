# NetAdmin Portal

## Project Overview

The **NetAdmin Portal** is a web application designed to assist IT personnel, even those without prior knowledge of network devices, in configuring and activating new network equipment. The portal will offer an intuitive interface for managing network devices, including adding, updating, deleting, and connecting them. Access control will ensure that users only interact with devices they are authorized to manage.

The **NetAdmin Portal** aims to simplify the management of network devices by offering a user-friendly platform for IT personnel. With strong emphasis on security, access control, and tracking user actions, the portal will ensure that only authorized users can manage the network devices, while keeping an audit trail of all actions performed.


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

- **Flask**: To be used as the backend API, facilitating communication between the devices and the database.

### Database

- **MySQL**: The database was chosen for storing user data, device information, and logs.

### Network Virtualization

- **EVE-NG**: A network emulation tool that will be used to virtualize network devices.
  - [EVE-NG Official Website](https://www.eve-ng.net/)
  - <img src="https://packet-warrior.net/p/how-to-add-custom-symbols-in-eve-ng/eve_symbol_2.png" alt="EVE-NG Image">

## Additional Information

- **DER Proposal**: The design and engineering requirements have been discussed and are reflected in the portal's development plan.

<img src="https://github.com/luizfrsantana/FSWDCapstoneProject/blob/main/DER%20Capstone%20Project.png?raw=true" alt="DER">


## Visual Representation

<img src="https://github.com/luizfrsantana/FSWDCapstoneProject/blob/main/FSWD%20Capstone%20Project.png?raw=true" alt="App HDL">


## Process flow 
- ## Add new device
- **1**. User logs into the app.
- **2**. User navigates to the "Equipment" screen.
- **3**. User clicks on the "Add Equipment" button.
- **4**. A screen appears requesting the management IP of the equipment.
- **5**. User inputs the IP information and saves it.
- **6**. A new entry is created in the equipment table.
- **7**. The backend performs a query to retrieve the equipment's name, interfaces, and IP addresses.
- **8**. Using this information, a new entry is created in the interfaces table, with the equipment's primary key (PK) linked as a foreign key (FK).
- **9**. The equipment name and IP address are displayed to the user on the equipment screen.
- **10**. There is a "Details" button next to the equipment entry.
- **11**. When the user clicks this button, a screen shows all interfaces of the equipment along with their respective IP addresses.
