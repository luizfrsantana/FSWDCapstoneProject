import {useEffect, useState} from 'react';
import "./interfacepage.css"

import DataTable from  "react-data-table-component";

const getStatus = (status) => {
  return status.toLowerCase() === 'up' ? 'status-up' : 'status-down';
};

const InterfacePage = () => {

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
      name: "Status",
      selector: row => row.status,
      cell: row => (
        <div className={getStatus(row.status)} title={row.status}>
          {row.status}
        </div>
    ),
    },
    {
      name: "Speed",
      selector: row => row.speed,
      cell: row => <div title={row.speed}>{row.speed}</div>,
    },
    {
      name: "Vlan",
      selector: row => row.vlan,
      cell: row => <div title={row.vlan}>{row.vlan}</div>,
    },
    {
      name: "Last Active",
      selector: row => row.last_active,
      cell: row => <div title={row.last_active}>{row.last_active}</div>,
    },
  ];
  
  
  
  const getAllDevices = async () => {
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
    const filteredInt = interfaces.filter(row=>row.ip.toLowerCase().includes(e.target.value.toLowerCase()) || row.description.toLowerCase().includes(e.target.value.toLowerCase()))
    setfilteredInterfaces(filteredInt)
  }

  useEffect(()=>{
    getAllDevices();
  },[])

  const handleUpdBtnDevice = async () => {
    const newInterfaceValues = {
      ip,
      description,
    };
  
    try {
      const response = await fetch(`http://192.168.56.107:5000/api/device`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newInterfaceValues),
      });
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      getAllDevices();
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

  const handleSyncBtnDevice = async () => {
    try {
      const response = await fetch("http://192.168.56.107:5000/api/update_interfaces");
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      getAllDevices();

    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    }
  }

  const handleRowSelected = (selectedRows) => {
    if (selectedRows && selectedRows.selectedRows.length > 0) { 
      const selectedInterface = selectedRows.selectedRows[0];
      setSelectedInterface(selectedInterface);
      fillInputbox(selectedInterface)
    };

    
  };

  return (
      <div className='interfacepage'>
        <div className="addpanel">
          <div className="addpaneldiv">
            <label htmlFor="description">Description</label> <br />
            <input className="addpanelinput" 
                    type="text" 
                    name="description" 
                    id="description"
                    value={description}
                    onChange={handlerInputdescription}
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
            />
          </div>

          <button className="updBtnDevice" onClick={handleUpdBtnDevice}>Update</button>
          <button className="syncBtnDevice" onClick={handleSyncBtnDevice}>Sync Devices' Interface</button>
        </div>
        <input className="inputSearch" onChange={handleSearch} type="search" name="inputsearchinterface" id="inputsearchinterface" placeholder="Search Interface By Name or IP..." />
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