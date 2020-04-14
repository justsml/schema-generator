import React from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
// import { parse } from './adapters/readers.js'
import { render, writerLanguages } from '../adapters/writers.js'
import { useParams, useHistory } from 'react-router-dom'

export default function CodeGenerator ({
  schemaName = 'Users',
  schemaResults,
  resultsTimestamp,
  options,
  language = 'javascript',
  children
}) {
  const [generatedCode, setGeneratedCode] = React.useState('')
  
  const history = useHistory()

  if (!schemaResults) {
    console.warn('Request denied, reloads not supported.')
    history.push('/')
  }
  
  schemaName = options.schemaName || schemaName

  React.useEffect(() => {
    const renderCode = () => {
      return Promise.resolve(schemaResults)
        .then(render({ schemaName, options, writer: options.adapter || 'knex' }))
        .then(setGeneratedCode)
        .catch(error => {
          setGeneratedCode(`Oh noes! We ran into a problem!\n\n  ${error.message}`)
          console.error(error)
        })
    }
    renderCode({})
  }, [resultsTimestamp, options.adapter, options.schemaName, options.strictMatching, options.enumMinimumRowCount, options.enumAbsoluteLimit, options.enumPercentThreshold, options.nullableRowsThreshold, options.uniqueRowsThreshold, schemaName])

  return (
    <SyntaxHighlighter language={writerLanguages[options.adapter] || language} style={atomDark}>
      {generatedCode}
    </SyntaxHighlighter>
  )
}
