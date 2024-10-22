import {useEffect, useState} from 'react';
import "./connectionpage.css"

import DataTable from  "react-data-table-component";

const ConnectionPage = () => {

  const columns = [
    {name:"Device A", selector:row=>row.device_name_a},
    {name:"Interface A", selector:row=>row.interface_name_a},
    {name:"IP A", selector:row=>row.ip_a},
    {name:"IP Z", selector:row=>row.ip_z},
    {name:"Interface Z", selector:row=>row.interface_name_z},
    {name:"Device Z", selector:row=>row.device_name_z},
  ];
  
  const [connections,setConnections] = useState([]);
  
  const getAllConnections = async () => {
    try {
      const response = await fetch("http://192.168.56.107:5000/api/connections");
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      console.log(data);
      setConnections(data);
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    }
  }
  
  useEffect(()=>{
    getAllConnections();
  },[])

  return (
      <div className='connectionspage'>
        <DataTable columns={columns} data={connections} fixedHeader pagination></DataTable>
      </div>
  );
}


export default ConnectionPage