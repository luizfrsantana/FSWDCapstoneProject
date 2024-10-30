import React, {useEffect, useState} from 'react';
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

  const getAllInterfaces = async () => {
    try {
      const response = await fetch("http://192.168.56.107:5000/api/interface");
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setInterfacesData(data)
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    }
  }

  const [interfacesData, setInterfacesData] = useState([])
  
  const [connections,setConnections] = useState([]);
  const [selectedDevice, setSelectDevice] = useState("");
  const [selectedInterface, setSelectedInterface] = useState("");
  const [interfaceId, setInterfaceId] = useState(null);

  getAllInterfaces()
  const deviceNames = [...new Set(interfacesData.map(item => item.device_name))];
  const interfaces = interfacesData.filter(item=>item.device_name === selectedDevice);

  const handleDeviceChange = (e) => {
    setSelectDevice(e.target.value);
    setSelectedInterface("");
    setInterfaceId(null);
  };

  const handleInterfaceChange = (e) => {
    const interfaceName = e.target.value;
    setSelectedInterface(interfaceName);

    const selectedInterfaceData = interfaces.find(item => item.interface_name === interfaceName)
    setInterfaceId(selectedInterfaceData?.id || null);
  }
  
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

  const saveConnection = () => {
    // Função para salvar a conexão no banco de dados
    console.log("Salvando conexão:", {
      device: selectedDevice,
      interface: selectedInterface,
      interfaceId: interfaceId
    });
    // Aqui você faria a chamada para a API de salvamento no banco de dados
  };
  
  useEffect(()=>{
    getAllConnections();
  },[])

  return (
      <div className='connectionspage'>
        <div className="addpanel">
          <div className="addpaneldiv">
            <label htmlFor="device_a">Device A</label> <br />
            <select 
              className="addpanelinput"
              name="device_a"
              id="device_a"
              value={selectedDevice}
              onChange={handleDeviceChange}
            >
              <option value="">Select a device</option>
              {deviceNames.map(device => (
                <option key={device} value={device}>{device}</option>
              ))}
            </select>
            <br />
          </div>
        {selectedDevice && (
          <div className="addpaneldiv">
            <label htmlFor="interface">Interface</label><br />
            <select 
              className="addpanelinput"
              name="interface"
              id="interface"
              value={selectedInterface}
              onChange={handleInterfaceChange}
            >
              <option value="">Selecione uma interface</option>
              {interfaces.map(interfaceItem => (
                <option key={interfaceItem.id} value={interfaceItem.interface_name}>
                  {interfaceItem.interface_name}
                </option>
              ))}
            </select>
          </div>
        )}

          {interfaceId && (
            <button onClick={saveConnection}>Salvar Conexão</button>
          )}

          <button className="addBtnConnection" >Add</button>
          <button className="delBtnConnection" >Delete</button>
        </div>
        <input className="inputSearch"  type="search" name="inputsearchconnection" id="inputsearchconnection" placeholder="Search Connection By Description or Device..." />
        <DataTable columns={columns} data={connections} fixedHeader pagination></DataTable>
      </div>
  );
}


export default ConnectionPage