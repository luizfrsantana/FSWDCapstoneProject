import React, {useEffect, useState} from 'react';
import "./connectionpage.css"

import DataTable from  "react-data-table-component";
import NetworkMap from '../NetworkMap';

const ConnectionPage = () => {

  const columns = [
    {name:"Device A",
       selector:row=>row.device_name_a,
       cell: row => <div title={row.device_name_a}>{row.device_name_a}</div>,
    },
    {name:"Interface A",
       selector:row=>row.interface_name_a,
       cell: row => <div title={row.interface_name_a}>{row.interface_name_a}</div>,
    },
    {name:"IP A",
       selector:row=>row.ip_a,
       cell: row => <div title={row.ip_a}>{row.ip_a}</div>,
    },
    {name:"IP Z",
      selector:row=>row.ip_z,
      cell: row => <div title={row.ip_z}>{row.ip_z}</div>,
    },
    {name:"Interface Z",
      selector:row=>row.interface_name_z,
      cell: row => <div title={row.interface_name_z}>{row.interface_name_z}</div>,
    },
    {name:"Device Z",
      selector:row=>row.device_name_z,
      cell: row => <div title={row.device_name_z}>{row.device_name_z}</div>,
    },
    {name:"Connection Type",
      selector:row=>row.connection_type,
      cell: row => <div title={row.connection_type}>{row.connection_type}</div>,
    },
    {name:"Status",
      selector:row=>row.status,
      cell: row => <div title={row.status}>{row.status}</div>,
    },
    {name:"Speed",
      selector:row=>row.speed,
      cell: row => <div title={row.speed}>{row.speed}</div>,
    },
    {name:"Description",
      selector:row=>row.description,
      cell: row => <div title={row.description}>{row.description}</div>,
    },
    {name:"Created at",
      selector:row=>row.created_at,
      cell: row => <div title={row.created_at}>{row.created_at}</div>,
    },
    {name:"Last Updated",
      selector:row=>row.last_updated,
      cell: row => <div title={row.last_updated}>{row.last_updated}</div>
    },
  ];

  const [connections,setConnections] = useState([]);
  const [filteredConnections,setFilteredConnections] = useState([]);
  const [selectedConnection, setSelectedConnection] = useState(null);

  const [interfacesData, setInterfacesData] = useState([])
  const [selectedDevice_a, setSelectDevice_a] = useState("");
  const [selectedInterface_a, setSelectedInterface_a] = useState("");
  const [interfaceId_a, setInterfaceId_a] = useState(null);

  const [selectedDevice_z, setSelectDevice_z] = useState("");
  const [selectedInterface_z, setSelectedInterface_z] = useState("");
  const [interfaceId_z, setInterfaceId_z] = useState(null);

  const [connectionType, setConnectionType] = useState("copper");
  const [connectionStatus, setConnectionStatus] = useState("active");
  const [connectionSpeed, setConnectionSpeed] = useState("10 Mb/s");
  const [connectionDescription, setConnectionDescription] = useState("");
  
  const fillInputbox = (connection) => {
    setSelectDevice_a(connection.device_name_a || '')
    setSelectedInterface_a(connection.interface_name_a || '')
    setInterfaceId_a(connection.interfaceId_a || '')
    setInterfaceId_z(connection.interfaceId_z || '')
    setSelectDevice_z(connection.device_name_z || '')
    setSelectedInterface_z(connection.interface_name_z || '')
    setConnectionType(connection.connection_type || '')
    setConnectionStatus(connection.status || '')
    setConnectionSpeed(connection.speed || '')
    setConnectionDescription(connection.description || '')
  } 

  const deviceNames = [...new Set(interfacesData.map(item => item.device_name))];
  const interfaces_a = interfacesData.filter(item=>item.device_name === selectedDevice_a);
  const interfaces_z = interfacesData.filter(item=>item.device_name === selectedDevice_z);

  const getAllInterfaces = async () => {
    try {
      const response = await fetch("http://192.168.56.107:5000/api/interface");
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setInterfacesData(data);
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    }
  }

  const getAllConnections = async () => {
    try {
      const response = await fetch("http://192.168.56.107:5000/api/connections");
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setConnections(data);
      setFilteredConnections(data)
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    }
  }

  const handleAddBtnDevice = async () => {
    const newConnection = {
      "id_interface_a": interfaceId_a,
      "id_interface_z":interfaceId_z,
      "connection_type":connectionType,
      "status":connectionStatus,
      "speed":connectionSpeed,
      "description":connectionDescription,
    };

    try {
      const response = await fetch(`http://192.168.56.107:5000/api/connections`, 
        {method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newConnection),
        });
        console.log(newConnection)
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      getAllConnections();
      inputBoxDefaultValues();
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    }
  };

  const inputBoxDefaultValues =() =>{
    setSelectedConnection(null);
    fillInputbox({"device_name_a":"",
      interface_name_a:"",
      device_name_z:"",
      interface_name_z:"",
      connection_type:"copper",
      status:"active",
      speed:"10 Mb/s",
      description:""}) 
  }

  const handleDelBtnDevice = async () => {
    try {
      const response = await fetch(`http://192.168.56.107:5000/api/connections`, 
      {method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({"id_interface_a":interfaceId_a,"id_interface_z":interfaceId_z}),
        
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      getAllConnections();
      inputBoxDefaultValues();
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    }
  };

  const handleRowSelected = (selectedRows) => {
    if (selectedRows && selectedRows.selectedRows.length > 0) { 
      const selectedConnection = selectedRows.selectedRows[0];
      setSelectedConnection(selectedConnection);
      fillInputbox(selectedConnection);
    }else inputBoxDefaultValues();
  };

  const handleSearch = (e) => {
    const searchTerm = e.target.value.toLowerCase();
  
    const filteredConnections = connections.filter(row => 
      (row.device_name_a && row.device_name_a.toLowerCase().includes(searchTerm)) ||
      (row.device_name_z && row.device_name_z.toLowerCase().includes(searchTerm)) ||
      (row.description && row.description.toLowerCase().includes(searchTerm))
    );
  
    setFilteredConnections(filteredConnections);
  };

  const handleDeviceChange_a = (e) => {
    setSelectDevice_a(e.target.value);
    setSelectedInterface_a("");
    setInterfaceId_a(null);
  };

  const handleDeviceChange_z = (e) => {
    setSelectDevice_z(e.target.value);
    setSelectedInterface_z("");
    setInterfaceId_z(null);
  };

  const handleInterfaceChange_a = (e) => {
    const interfaceName = e.target.value;
    setSelectedInterface_a(interfaceName);

    const selectedInterfaceData = interfaces_a.find(item => item.interface_name === interfaceName)
    setInterfaceId_a(selectedInterfaceData?.id || null);
  }

  const handleInterfaceChange_z = (e) => {
    const interfaceName = e.target.value;
    setSelectedInterface_z(interfaceName);

    const selectedInterfaceData = interfaces_z.find(item => item.interface_name === interfaceName)
    setInterfaceId_z(selectedInterfaceData?.id || null);
  }

  const handlerConnectionType = (event) => {
    setConnectionType(event.target.value)
  }

  const handlerConnectionStatus = (event) => {
    setConnectionStatus(event.target.value)
  }

  const handlerConnectionSpeed = (event) => {
    setConnectionSpeed(event.target.value)
  }

  const handlerConnectionDescription = (event) => {
    setConnectionDescription(event.target.value)
  }
  
  useEffect(()=>{
    getAllConnections();
    getAllInterfaces();
  },[])

  return (
      <div className='connectionspage'>
        <div className="addpanel">
          <div className="addpaneldiv">
            <label htmlFor="device_a">Device A</label> <br />
            <select 
              className="addpanelinput"
              disabled={selectedConnection}
              name="device_a"
              id="device_a"
              value={selectedDevice_a}
              onChange={handleDeviceChange_a}
            >
              <option value="">Select a device</option>
              {deviceNames.map(device => (
                <option key={device} value={device}>{device}</option>
              ))}
            </select>
            <br />
          </div>
        {selectedDevice_a && (
          <div className="addpaneldiv">
            <label htmlFor="interface">Interface</label><br />
            <select 
              className="addpanelinput"
              disabled={selectedConnection}
              name="interface_a"
              id="interface_a"
              value={selectedInterface_a}
              onChange={handleInterfaceChange_a}
            >
              <option value="">Select a interface</option>
              {interfaces_a.map(interfaceItem => (
                <option key={interfaceItem.id} value={interfaceItem.interface_name}>
                  {interfaceItem.interface_name}
                </option>
              ))}
            </select>
          </div>
        )}

          <div className="addpaneldiv">
            <label htmlFor="device_z">Device Z</label> <br />
            <select 
              className="addpanelinput"
              disabled={selectedConnection}
              name="device_z"
              id="device_z"
              value={selectedDevice_z}
              onChange={handleDeviceChange_z}
            >
              <option value="">Select a device</option>
              {deviceNames.map(device => (
                <option key={device} value={device}>{device}</option>
              ))}
            </select>
            <br />
          </div>

          {selectedDevice_z && (
          <div className="addpaneldiv">
            <label htmlFor="interface">Interface</label><br />
            <select 
              className="addpanelinput"
              disabled={selectedConnection}
              name="interface_z"
              id="interface_z"
              value={selectedInterface_z}
              onChange={handleInterfaceChange_z}
            >
              <option value="">Select a interface</option>
              {interfaces_z.map(interfaceItem => (
                <option key={interfaceItem.id} value={interfaceItem.interface_name}>
                  {interfaceItem.interface_name}
                </option>
              ))}
            </select>
          </div>
        )}


          <div className="addpaneldiv">  
            <label htmlFor="connectiontype">Connection Type</label>  <br />
            <select className="addpanelinput"
                    disabled={selectedConnection}
                    name="connectiontype" 
                    id="connectiontype" 
                    value={connectionType} 
                    onChange={handlerConnectionType}>
                      <option>copper</option>
                      <option>fiber</option>
                      <option>wireless</option>
            </select>
          </div>

          <div className="addpaneldiv">  
            <label htmlFor="status">Status</label>  <br />
            <select className="addpanelinput"
                    disabled={selectedConnection}
                    name="status" 
                    id="status" 
                    value={connectionStatus} 
                    onChange={handlerConnectionStatus}>
                      <option>active</option>
                      <option>inactive</option>
                      <option>maintenance</option>
            </select>
          </div>

          <div className="addpaneldiv">  
            <label htmlFor="speed">Speed</label>  <br />
            <select className="addpanelinput"
                    disabled={selectedConnection}
                    name="speed" 
                    id="speed" 
                    value={connectionSpeed} 
                    onChange={handlerConnectionSpeed}>
                      <option>10 Mb/s</option>
                      <option>100 Mb/s</option>
                      <option>1 Gbs</option>
                      <option>10 Gb/s</option>
            </select>
          </div>

          <div className="addpaneldiv">  
            <label htmlFor="description">Description</label>  <br />
            <input className="addpanelinput"
                disabled={selectedConnection}
                type="text"
                name="description" 
                id="description" 
                value={connectionDescription} 
                onChange={handlerConnectionDescription} 
              />
          </div>

          {!selectedConnection && interfaceId_a && interfaceId_z && <button className="addBtnConnection" onClick={handleAddBtnDevice}>Add</button>}
          {selectedConnection && <button className="delBtnConnection" onClick={handleDelBtnDevice}>Delete</button>}
        </div>
        <input className="inputSearch"  onChange={handleSearch} type="search" name="inputsearchconnection" id="inputsearchconnection" placeholder="Search Connection By Description or Device..." />
        <DataTable 
          columns={columns} 
          data={filteredConnections} 
          fixedHeader  
          pagination
          selectableRows
          selectableRowsSingle
          onSelectedRowsChange={handleRowSelected} 
        />
      <NetworkMap connections={connections} /> 
      </div>
  );
}


export default ConnectionPage