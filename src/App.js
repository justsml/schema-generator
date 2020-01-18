import React, { useState } from "react";
import "./styles.css";
import { schemaBuilder } from "./schemaBuilder";
import { exampleUsers } from "./sampleData.js";
import { parse } from "./adapters/readers.js";
import { render } from "./adapters/writers.js";

export default function App() {
  const [schemaName, setSchemaName] = useState("User");
  const [inputData, setInputData] = useState(exampleUsers);
  const [schemaOutput, setSchemaOutput] = useState("");
  const [outputMode, setOutputMode] = useState("mongoose");

  const generateSchema = () => {
    return Promise.resolve(inputData)
      .then(parse)
      .then(data => schemaBuilder(schemaName, data))
      .then(render(schemaName, outputMode))
      .then(output => {
        setSchemaOutput(output);
      })
      .catch(error => {
        setSchemaOutput(`ERROR!   ${error.message}`);
        console.error(error);
      });
  };

  return (
    <div className="App">
      <h1>Paste your data below</h1>
      <section className="input-data">
        <label className="w-100">
          <strong>Schema Name:&#160;</strong>
          <input
            value={schemaName}
            onChange={e => setSchemaName(e.target.value)}
          />
        </label>
        <label className="w-100">
          <strong>Paste your sample data:&#160;</strong>
          <textarea
            value={inputData}
            onChange={e => setInputData(e.target.value)}
          />
        </label>
      </section>
      <section className="output-ui">
        <div className="d-flex justify-content-between m-2">
          <button onClick={generateSchema} className="btn btn-success mx-auto">
            Generate Schema
          </button>
          <label className="w-50">
            <strong>Renderer:&#160;</strong>
            <select
              className="w-100 custom-select"
              onChange={e => setOutputMode(e.target.value)}
              value={outputMode}
            >
              <option selected>mongoose</option>
              <option>knex migration</option>
              <option>sql</option>
              <option>yup validation</option>
            </select>
          </label>
        </div>
        {/* <button
          onClick={() => setInputData(exampleUsers)}
          className="btn btn-info"
        >
          Sample Data/Reset
        </button> */}
      </section>
      <section className="output-data">
        <textarea value={schemaOutput} readOnly={true} />
      </section>
    </div>
  );
}
