import React, { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
// import PropTypes from 'prop-types';
import { withStyles, makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import ButtonGroup from '@material-ui/core/ButtonGroup'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import Paper from '@material-ui/core/Paper'
import SampleDataMenu from './SampleDataMenu'

export default function ChooseInput({ text = '', onSelect, children }) {
  return <Paper elevation={3} className="input-panel d-flex align-items-center justify-content-center">
    <section className='main-panel m-3 d-flex justify-content-between'>
      <ButtonGroup orientation='vertical' variant='contained' className='main-options'>
        <Button>Paste from Clipboard</Button>
        <Button>From File (processed locally)</Button>
      </ButtonGroup>
      <SampleDataMenu onSelect={onSelect} options={[
        'Load Sample Users JSON',
        'Load Sample People JSON',
        'Load Sample Listings JSON',
        'Load Sample Products CSV'
      ]} />

      {/* <ButtonGroup orientation='vertical' color='default' className='demo-options'>
        <Button>Load Sample Users JSON</Button>
        <Button>Load Sample People JSON</Button>
        <Button>Load Sample Listings JSON</Button>
        <Button>Load Sample Products CSV</Button>
      </ButtonGroup> */}
    </section>
  </Paper>
}
