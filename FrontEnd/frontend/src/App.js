import React from "react";
import Banner from "./components/Banner";
import Form from "./components/Form";

export default function App() {
  return (
    <div className="App">
      <Banner />
      <Form object="user"/>
    </div>  
  );
}
