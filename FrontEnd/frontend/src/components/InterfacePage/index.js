import {useEffect, useState} from 'react';
import "./interfacepage.css"
import { jwtDecode } from "jwt-decode";

import DataTable from  "react-data-table-component";

const getStatus = (status) => {
  return status && status.toLowerCase() === 'up' ? 'status-up' : 'status-down';
};

const InterfacePage = () => {

  const token = localStorage.getItem("authToken");
  const userData = token ? jwtDecode(token) : null;
  const userRole = userData?.sub?.role;

  const [interfaces,setInterfaces] = useState([]);
  const [filteredInterfaces,setfilteredInterfaces] = useState([]);
  const [selectedInterface, setSelectedInterface] = useState(null);

  const [ip, setIp] = useState("")
  const [description, setDescription] = useState("")

  const fillInputbox = (interfaceSelected) => {
    setDescription(interfaceSelected.description)
    setIp(interfaceSelected.ip)
  } 

  const columns = [
    {
      name: "Interface Name",
      selector: row => row.interface_name,
      cell: row => <div title={row.interface_name}>{row.interface_name}</div>,
    },
    {
      name: "Device Name",
      selector: row => row.device_name,
      cell: row => <div title={row.device_name}>{row.device_name}</div>,
    },
    {
      name: "Description",
      selector: row => row.description,
      cell: row => <div title={row.description}>{row.description}</div>,
    },
    {
      name: "IP",
      selector: row => row.ip,
      cell: row => <div title={row.ip}>{row.ip}</div>,
    },
    {
      name: "Vlan",
      selector: row => row.vlan,
      cell: row => <div title={row.vlan}>{row.vlan}</div>,
    },
    {
      name: "Last Up",
      selector: row => row.last_up,
      cell: row => <div title={row.last_up}>{row.last_up}</div>,
    },
    {
      name: "Last Down",
      selector: row => row.last_down,
      cell: row => <div title={row.last_down}>{row.last_down}</div>,
    },
    {
      name: "Physical Status",
      selector: row => row.physical_status,
      cell: row => <div title={row.physical_status}>{row.physical_status}</div>,
    },
    {
      name: "Protocol Status",
      selector: row => row.protocol_status,
      cell: row => <div className={getStatus(row.protocol_status)} title={row.protocol_status}>{row.protocol_status}</div>,
    },
  ];
  
  
  const getAllInterfaces = async () => {
    try {
      const response = await fetch("http://192.168.56.107:5000/api/interface");
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setInterfaces(data);
      setfilteredInterfaces(data);
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    }
  }

  const handleSearch = (e) => {
    const searchValue = e.target.value.toLowerCase();

    const filteredInt = interfaces.filter(row => {
        return (
            row.device_name && row.ip && row.description && 
            (
                row.device_name.toLowerCase().includes(searchValue) ||
                row.ip.toLowerCase().includes(searchValue) ||
                row.description.toLowerCase().includes(searchValue)
            )
        );
    });

    setfilteredInterfaces(filteredInt);
};

  useEffect(()=>{
    getAllInterfaces();
  },[])

  const handleUpdBtnInterface = async () => {
    const newInterfaceValues = {
      ip,
      description,
      device_id: selectedInterface.device_id,
      id: selectedInterface.id,
      interface_name: selectedInterface.interface_name,
    };
    console.log(newInterfaceValues)
  
    try {
      const response = await fetch(`http://192.168.56.107:5000/api/interface/update`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newInterfaceValues),
      });
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      handleSyncBtnInterface();
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    }
  };

  const handlerInputdescription = (event) => {
    setDescription(event.target.value)
  }

  const handlerInputIp = (event) => {
    setIp(event.target.value)
  }

  const handleSyncBtnInterface = async () => {
    try {
      const response = await fetch("http://192.168.56.107:5000/api/update_interfaces");
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      getAllInterfaces();

    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    }
  }

  const handleRowSelected = (selectedRows) => {
    if (selectedRows && selectedRows.selectedRows.length > 0) { 
      const selectedInterface = selectedRows.selectedRows[0];
      setSelectedInterface(selectedInterface);
      fillInputbox(selectedInterface)
    } else {
      setSelectedInterface(null)
      fillInputbox({description: "",ip: ""})
    };

    
  };

  return (
      <div className='interfacepage'>
        {(userRole === "Admin" || userRole === "full-access")  && <div className="addpanel">
          <div className="addpaneldiv">
            <label htmlFor="description">Description</label> <br />
            <input className="addpanelinput" 
                    type="text" 
                    name="description" 
                    id="description"
                    value={description}
                    onChange={handlerInputdescription}
                    disabled={!selectedInterface}
            />  
            <br />
          </div>
          <div className="addpaneldiv">  
            <label htmlFor="ip">IP</label>  <br />
            <input className="addpanelinput"
                    type="text"
                    name="ip" 
                    id="ip" 
                    value={ip} 
                    onChange={handlerInputIp}
                    disabled={!selectedInterface} 
            />
          </div>
          <br />
          {selectedInterface && <button className="updBtnInterface" onClick={handleUpdBtnInterface}>Update</button>}
          {!selectedInterface && <button className="syncBtnInterface" onClick={handleSyncBtnInterface}>Sync Devices' Interface</button>}
        </div>
      }
        <input className="inputSearch" onChange={handleSearch} type="search" name="inputsearchinterface" id="inputsearchinterface" placeholder="Search Interface By Device, Description or IP..." />
        <DataTable 
          columns={columns} 
          data={filteredInterfaces} 
          fixedHeader 
          pagination
          selectableRows
          selectableRowsSingle
          onSelectedRowsChange={handleRowSelected}
          >

        </DataTable>
      </div>
  );
}


export default InterfacePage