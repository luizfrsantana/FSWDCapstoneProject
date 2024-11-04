
# NetAdmin Portal

## Project Overview

The **NetAdmin Portal** is a web application designed to assist IT personnel, even those without prior knowledge of network devices, in configuring and activating new network equipment. The portal will offer an intuitive interface for managing network devices, including adding, updating, deleting, and connecting them. Access control will ensure that users only interact with devices they are authorized to manage.

The **NetAdmin Portal** aims to simplify the management of network devices by offering a user-friendly platform for IT personnel. With strong emphasis on security, access control, and tracking user actions, the portal will ensure that only authorized users can manage the network devices, while keeping an audit trail of all actions performed.


## Features

- **User Authentication**: Users must register and log in to access the portal. Permissions will be applied to restrict access to authorized devices only.
- **User Activity Log**: The portal will log all user actions to facilitate issue tracking and auditing --> TBD
- **Device CRUD Operations**: Users will be able to add, update, and remove network devices through a dedicated interface.
- **Device Connections**: The portal allows users to create and manage connections between network devices.
- **Access Control**: Validation ensures that users only see information and devices they have permission to manage.

### Exploration and Brainstorming

- **Exploration**: For the app to function, spaces will be provided to add, update, delete, and read devices. Access validation will ensure that users only view and interact with devices they have permission to manage.
- **Brainstorming**: We discussed whether to visualize connections between devices. https://github.com/visjs/vis-network

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
  - <img src="https://github.com/luizfrsantana/FSWDCapstoneProject/blob/main/readme_images/lab.jpg" alt="EVE-NG Image">

## Additional Information

- ERD: 

<img src="https://github.com/luizfrsantana/FSWDCapstoneProject/blob/main/DataBase/ERD.png" alt="ERD">


## Visual Representation

<img src="https://github.com/luizfrsantana/FSWDCapstoneProject/blob/main/FSWD%20Capstone%20Project.png?raw=true" alt="App HDL">


# Process flow 

## User Flow: User Login and Access Level Control

1. **User logs into the app.**
2. The **backend queries the users table** to verify if the user exists.
3. If the user is found in the table, the backend **grants access** to the app.
4. Once access is validated, the backend returns the **user's access level** to the frontend:
   - **0**: Administrator
   - **1**: Full Access
   - **2**: Read-Only
5. Based on the **access level**:
   - **Users with access level 2 (Read-Only)** will **not see the "Update", "Create", or "Delete" buttons**.
   - **Users with access level 0 (Administrator)** and **1 (Full Access)** will have full functionality with these buttons visible.

### Backend Actions
- The backend checks the **users table** for the login credentials.
- The **access level** is returned to the frontend upon successful validation of the user.

### Frontend Behavior
- The frontend **displays or hides** the "Update", "Create", and "Delete" buttons based on the user's access level:
   - For **read-only users (access level 2)**, these buttons are hidden.


### User Flow: Equipment Addition and Interface Retrieval

1. **User logs into the app.**
2. **User navigates to the "Equipment" screen.**
3. **User clicks the "Add Equipment" button.**
4. A screen appears requesting the **management IP of the equipment**.
5. User inputs the IP information and clicks **"Save"**.
6. A new entry is created in the **equipment table**.
7. The backend performs a query to retrieve the equipment's **name, interfaces, and IP addresses**.
8. Using this information, a new entry is created in the **interfaces table**, with the equipment's **primary key (PK)** linked as a **foreign key (FK)**.
9. The **equipment name and IP address** are displayed to the user on the "Equipment" screen.
10. There is a **"Details" button** next to the equipment entry.
11. When the user clicks the **"Details" button**, a screen appears showing all interfaces of the equipment along with their respective IP addresses.

#### Backend Actions
- The backend retrieves the equipment's data (name, interfaces, IPs) after a new equipment is added.
- The backend creates new entries in the **interfaces table**, linking them to the corresponding equipment entry using foreign key relationships.


### User Flow: Equipment Management and Interface Update

1. **User logs into the app.**
2. **User navigates to the "Equipment" screen.**
3. **User clicks the "Details" button** for a specific piece of equipment.
4. On the details screen, each row displaying an interface and its IP address has an **"Update" button**.
5. When the user clicks the **"Update" button**, they are allowed to modify the IP address for that interface.
6. After making changes, the user clicks **"Save"**.
7. The updated information is sent to the backend.
8. The backend updates the **interfaces table** in the database.
9. The user returns to the **"Details" screen**.
10. On this screen, the user can either:
    - Update more interfaces, or
    - Click the **"Sync" button**.
11. When the **"Sync" button** is clicked, the frontend sends a request to the backend, asking to update the equipment's information with the current data from the interfaces database.
12. The user is redirected back to the **"Equipment" screen**.

#### Backend Actions
- The backend will handle updating the database upon IP modification.
- The **sync process** fetches the latest data from the interfaces database and updates the equipment's details accordingly.

### User Flow: Connection Management - Add and Remove Connections Only

### 1. **Login**
- The user logs into the system.

### 2. **Navigation to the "Connections" Screen**
- The user navigates to the "Connections" screen.

### 3. **Display of Current Connections**
- The screen shows the existing connections between equipment that have been saved in the database.
- The backend queries the physical connections that have already been established between devices.

### 4. **Sync Connections**
- The user can click the "Sync" button to update the connections table with the latest physical connection data.

### 5. **Connections Screen Layout**
- The screen is divided into two sections:
  - **Graphical representation of connections:** A visual view showing devices and their existing connections.
  - **Connections table:** A table below the graphical view, detailing the connections.

### 6. **Connection Table Row Details**
Each row in the connection table displays:
- **Equipment A** (name)
- **Interface and IP address of Equipment A**
- **Equipment Z** (name)
- **Interface and IP address of Equipment Z**

### 7. **Action Buttons**
- Each row includes a **Remove Connection** button that allows the user to delete an existing connection.
- An **Add Connection** button is available at the top or in an accessible part of the interface.
  
  - When clicking "Add Connection", the user selects:
    1. **Equipment A** and its corresponding interface.
    2. **Equipment Z** and its corresponding interface.
  
  - The backend checks if the selected interfaces are part of the **same network**, as previously configured in the "Equipment" screen.
  - If the validation succeeds, the connection is added.
  - Otherwise, an error message is displayed indicating that the interfaces are not part of the same network.

#### 8. **Backend Actions**
- The backend retrieves connection data by querying the database for associated equipment and their interfaces.
- The "Sync" button sends a request to the backend to update the connections table with any changes in the physical connection.

#### 9. **Frontend Behavior**
- The frontend displays:
  - A graphical view of the equipment and their connections.
  - A table with details about each connection, including equipment names, interfaces, and IP addresses.
  - Buttons to **Add** or **Remove** connections.
  

## Some images of the project

<img src="https://github.com/luizfrsantana/FSWDCapstoneProject/blob/main/readme_images/1.jpg" alt="Home" width="400">
<img src="https://github.com/luizfrsantana/FSWDCapstoneProject/blob/main/readme_images/2.jpg" alt="Uses" width="400">
<img src="https://github.com/luizfrsantana/FSWDCapstoneProject/blob/main/readme_images/3.jpg" alt="Devices" width="400">
<img src="https://github.com/luizfrsantana/FSWDCapstoneProject/blob/main/readme_images/4.jpg" alt="Interfaces" width="400">
<img src="https://github.com/luizfrsantana/FSWDCapstoneProject/blob/main/readme_images/5.jpg" alt="Connectios" width="400">
<img src="https://github.com/luizfrsantana/FSWDCapstoneProject/blob/main/readme_images/6.jpg" alt="Connections 2" width="400">



