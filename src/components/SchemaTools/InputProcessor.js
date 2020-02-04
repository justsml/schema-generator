import React from 'react'
import Paper from '@material-ui/core/Paper';
import {Link} from "react-router-dom";
// import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
// import ChevronRight from '@material-ui/icons/ChevronRightOutlined'

export default function InputProcessor({
  children, onSave,
  currentData = '', className = ''
}) {
  let { source: name } = useParams();

  const loadData = React.useCallback(() => {
      let filePath = ''
      if (name === 'products') filePath = 'products-3000.csv'
      if (name === 'listings') filePath = 'real-estate.example.json'
      if (name === 'people') filePath = 'swapi-people.json'
      if (name === 'users') filePath = 'users.example.json'
      if (!filePath) return ''
      setInputData(`One moment...\nImporting ${name} dataset...`)
      return fetch(filePath)
        .then(response => response.text())
        .then(data => {
          setSchemaName(name)
          setInputData(data)
        })
        .catch(error => {
          console.error('ERROR:', error)
          setInputData(`Oh noes! Failed to load the ${name} dataset.
            Please file an issue on the project's GitHub Issues.`)
        })
    },
    [name]
  )

  React.useEffect(() => {
    loadData()
  }, [name])

  return <Paper elevation={3} className={className}>
    <section className='w-100 h-100 d-flex flex-column align-items-center'>
      <Typography style={{height: 60}} variant="h3" className='field-name'>
        Paste your JSON or CSV data&#160;
      </Typography>
      <TextareaAutosize
        className='flex-fill'
        aria-label="Input or Paste your CSV or JSON data"
        rowsMin={9}
        placeholder="Paste your data here or select a Sample Set"
        value={inputData}
        onChange={e => setInputData(e.target.value)}
      />
      {/* <textarea
        className='muted w-100 h-100'

      /> */}
      {children}
    </section>
  </Paper>
}

/*
*/