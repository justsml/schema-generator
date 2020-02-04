import React from 'react'
import Paper from '@material-ui/core/Paper'
import { Link, useParams, useHistory } from 'react-router-dom'
// import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import TextareaAutosize from '@material-ui/core/TextareaAutosize'
// import ChevronRight from '@material-ui/icons/ChevronRightOutlined'

export default function InputProcessor ({
  hasInputData,
  displayStatus,
  inputData = '',
  setInputData,
  setStatusMessage,
  className = ''
}) {
  const { source: name } = useParams()
  const history = useHistory()

  const loadData = () => {
    let filePath = ''
    if (name === 'products') filePath = '/products-3000.csv'
    if (name === 'listings') filePath = '/real-estate.example.json'
    if (name === 'people') filePath = '/swapi-people.json'
    if (name === 'users') filePath = '/users.example.json'
    if (!filePath) return ''
    setStatusMessage(`One moment...\nImporting ${name} dataset...`)
    return fetch(filePath)
      .then(response => response.text())
      .then(data => {
        // setSchemaName(name)
        setInputData(data)
      })
      .catch(error => {
        console.error('ERROR:', error)
        setStatusMessage(`Oh noes! Failed to load the ${name} dataset.
            Please file an issue on the project's GitHub Issues.`)
      })
  }

  React.useEffect(() => {
    loadData()
  }, [name])

  const textareaOpts = hasInputData ? { rowsMin: 14 } : { rowsMin: 9 }
  if (hasInputData) {
    className += ' appears-valid'
  }
  return <Paper elevation={3} className={className}>
    <section className='position-relative w-100 h-100 d-flex flex-column align-items-center justify-content-center '>
      {displayStatus(() => history.push('/results/code/knex'))}

      <TextareaAutosize
        className='w-100 h-100 border-0 m-1 p-1'
        aria-label='Input or Paste your CSV or JSON data'
        placeholder='Paste your data here or Start Again to choose a Sample Data Set'
        value={inputData}
        onChange={e => setInputData(e.target.value)}
        {...textareaOpts}
      />
      {/* <textarea
        className='muted w-100 h-100'

      /> */}
      {/* {children} */}
    </section>
  </Paper>
}

/*
*/
