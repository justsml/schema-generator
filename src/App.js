import React, { useState } from "react";
import "./styles.css";
import { schemaBuilder } from "./schemaBuilder";
import { exampleUsers } from "./sampleData.js";

export default function App() {
  const [schemaName, setSchemaName] = useState("User");
  const [inputData, setInputData] = useState(exampleUsers);
  const [schemaOutput, setSchemaOutput] = useState("");

  const generateSchema = () => {
    let data = null;
    try {
      data = JSON.parse(inputData);
      schemaBuilder(schemaName, data).then(results => {
        results._uniques = undefined;
        results._totalRecords = undefined;
        setSchemaOutput(JSON.stringify(results, null, 2));
      });
    } catch (error) {
      setSchemaOutput(`ERROR!   ${error.message}`);
      console.error(error);
    }
  };

  return (
    <div className="App">
      <h1>Paste your data below</h1>
      <section className="input-data">
        <label>
          <strong>Schema Name:&#160;</strong>
          <input
            value={schemaName}
            onChange={e => setSchemaName(e.target.value)}
          />
        </label>
        <textarea
          value={inputData}
          onChange={e => setInputData(e.target.value)}
        />
      </section>
      <section className="btn-group d-flex justify-content-center">
        <button onClick={generateSchema} className="btn btn-success">
          Generate Schema
        </button>
        <button
          onClick={() => setInputData(exampleUsers)}
          className="btn btn-info"
        >
          Sample Data/Reset
        </button>
      </section>
      <section className="output-data">
        <textarea value={schemaOutput} readOnly={true} />
      </section>
    </div>
  );
}
