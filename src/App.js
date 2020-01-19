import React, { useState } from "react";
import "./styles.css";
import Header from "./components/Header";
import NavBar from "./components/NavBar";
import GeneratorForm from "./components/GeneratorForm";

export default function App() {
  return (
    <div className="App container">
      <NavBar />
      <Header />
      <GeneratorForm />
    </div>
  );
}
