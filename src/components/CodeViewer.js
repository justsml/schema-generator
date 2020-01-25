import React from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism'

export default function CodeViewer ({
  code,
  language = 'javascript',
  children
}) {
  return (
    <SyntaxHighlighter language={language} style={atomDark}>
      {code || children}
    </SyntaxHighlighter>
  )
}
