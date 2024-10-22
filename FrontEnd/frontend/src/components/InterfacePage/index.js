import {useEffect, useState} from 'react';
import "./interfacepage.css"

import DataTable from  "react-data-table-component";

const InterfacePage = () => {

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
      cell: row => <div title={row.status}>{row.status}</div>,
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
  
  const [interfaces,setInterfaces] = useState([]);
  
  const getAllDevices = async () => {
    try {
      const response = await fetch("http://192.168.56.107:5000/api/interface");
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      console.log(data);
      setInterfaces(data);
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    }
  }
  
  useEffect(()=>{
    getAllDevices();
  },[])

  return (
      <div className='interfacepage'>
        <DataTable columns={columns} data={interfaces} fixedHeader pagination></DataTable>
      </div>
  );
}


export default InterfacePage