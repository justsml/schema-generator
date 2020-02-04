import React from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';

import ChooseInput from './ChooseInput'
import AdvancedOptionsForm from './AdvancedOptionsForm';
import InputProcessor from './InputProcessor.js'
import { Button } from '@material-ui/core';

export default function SchemaTools({}) {
  const [schemaResults, setSchemaResults] = React.useState('')
  const [inputData, setInputData] = React.useState('')
  const [statusMessage, setStatusMessage] = React.useState('')
  const [options, setOptions] = React.useState({
    strictMatching: true,
    enumMinimumRowCount: 100,
    enumAbsoluteLimit: 10,
    enumPercentThreshold: 0.01,
    nullableRowsThreshold: 0.02,
    uniqueRowsThreshold: 1.0
  })

  const loadData = name => {
    let filePath = ''
    if (name === 'products') filePath = 'products-3000.csv'
    if (name === 'listings') filePath = 'real-estate.example.json'
    if (name === 'people') filePath = 'swapi-people.json'
    if (name === 'users') filePath = 'users.example.json'
    if (!filePath) {
      setStatusMessage('')
      setInputData('')
      return
    }
    setStatusMessage(`One moment...\nImporting ${name} dataset...`)
    return fetch(filePath)
      .then(response => response.text())
      .then(data => {
        setSchemaName(name)
        setInputData(data)
        setStatusMessage('Loaded Sample Dataset 🎉')
      })
      .catch(error => {
        console.error('ERROR:', error)
        setStatusMessage(`Oh noes! Failed to load the ${name} dataset.
          Please file an issue on the project's GitHub Issues.`)
      })
  }

  return <main className="shadow-lg p-3 mb-5 bg-white rounded">
    <Router>
    <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
      <Link color="inherit" to="/">Start Over</Link>
      <Link color="inherit" to="/input">Input Data</Link>
      <Link color="inherit" to="/generator">Generated Code</Link>
      <Link color="inherit" to="/visualize">Charts &amp; Summary</Link>
    </Breadcrumbs>

    <aside className="d-flex float-right">
      <AdvancedOptionsForm options={options} onSave={opts => setOptions(opts)} />
    </aside>

    <Switch>
      <Route exact path="/">
        <h1>Welcome! Click continue.</h1>
        <h4>TODO: Insert recording of app</h4>
        <ChooseInput onSelect={} />
      </Route>
      <Route path="/input/:source?">
        <InputProcessor currentData={inputData} onSave={setInputData}>
          <Button>Next</Button>
        </InputProcessor>
      </Route>
      <Route path="/generator/:adapter?">
        <Dashboard />
      </Route>
    </Switch>

  </Router>
  </main>
}
