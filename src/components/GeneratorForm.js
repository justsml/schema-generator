import React, { useState } from "react";
import { schemaBuilder } from "../schemaBuilder";
import { exampleUsers } from "../sampleData.js";
import { parse } from "../adapters/readers.js";
import { render } from "../adapters/writers.js";

export default function GeneratorForm() {
  const [schemaName, setSchemaName] = useState("User");
  const [inputData, setInputData] = useState(exampleUsers);
  const [schemaOutput, setSchemaOutput] = useState("");
  const [outputMode, setOutputMode] = useState("mongoose");

  const generateSchema = () => {
    return Promise.resolve(inputData)
      .then(parse)
      .then(data => schemaBuilder(schemaName, data))
      .then(render(schemaName, outputMode))
      .then(setSchemaOutput)
      .catch(error => {
        setSchemaOutput(`ERROR!   ${error.message}`);
        console.error(error);
      });
  };

  return (
    <form className="form w-100" onSubmit={e => e.preventDefault()}>
      <section className="input-data">
        <label className="w-100">
          <strong className="field-name">Schema Name:&#160;</strong>
          <input
            className="rounded"
            value={schemaName}
            onChange={e => setSchemaName(e.target.value)}
          />
        </label>
        <label className="w-100">
          <strong className="field-name">
            Paste your JSON or CSV data:&#160;
          </strong>
          <textarea
            className="rounded"
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
              defaultValue={outputMode}
            >
              <option value="mongoose">mongoose</option>
              <option value="knex">knex migration</option>
              <option value="sql">sql</option>
              {/* <option>yup validation</option> */}
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
      {schemaOutput && schemaOutput.length > 1 && (
        <section className="output-data">
          <textarea
            value={schemaOutput}
            readOnly={true}
            className="rounded text-monospace text-light bg-dark p-2"
            onClick={e => e.target.select()}
          />
        </section>
      )}
    </form>
  );
}
