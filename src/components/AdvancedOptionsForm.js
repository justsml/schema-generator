import React, { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
// import PropTypes from 'prop-types';
import { withStyles, makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import Slider from '@material-ui/core/Slider'
import Input from '@material-ui/core/Input'
import Checkbox from '@material-ui/core/Checkbox'

const useStyles = makeStyles(theme => ({
  root: {
    width: 300 + theme.spacing(3) * 2
  },
  margin: {
    height: theme.spacing(3)
  }
}))

const StyledSlider = withStyles({
  root: {
    color: '#52af77',
    height: 8
  },
  thumb: {
    height: 24,
    width: 24,
    backgroundColor: '#fff',
    border: '2px solid currentColor',
    marginTop: -8,
    marginLeft: -12,
    '&:focus,&:hover,&$active': {
      boxShadow: 'inherit'
    }
  },
  active: {},
  valueLabel: {
    left: 'calc(-50% + 4px)'
  },
  track: {
    height: 8,
    borderRadius: 4
  },
  rail: {
    height: 8,
    borderRadius: 4
  }
})(Slider)

const WrapWithLabel = ({ label, children }) => <section className='form-field'>
  <Typography as='label'>{label}: </Typography>
  {children}
</section>

const SliderField = ({ name, label, value, control, ...args }) => (<WrapWithLabel label={label}>
  <Controller
    as={Slider}
    {...args}
    valueLabelDisplay='auto'
    aria-label={label}
    name={name}
    control={control}
    defaultValue={value}
  />
</WrapWithLabel>)
const RangeInputField = ({ name, label, value, control, ...args }) => (<WrapWithLabel label={label}>
  <Controller
    as={<Input
      valueLabelDisplay='auto'
      aria-label={label}
      name={name}
      control={control}
      defaultValue={value}
      {...args}
        />}
  />
                                                                       </WrapWithLabel>)

export default function AdvancedOptionsForm ({ options, className }) {
  const classes = useStyles()
  const methods = useForm()
  const { handleSubmit, control, reset } = methods
  const onSubmit = data => console.log(data)

  /*
strictMatching: true,
enumMinimumRowCount: 100,
enumAbsoluteLimit: 10,
enumPercentThreshold: 0.01,
nullableRowsThreshold: 0.02,
uniqueRowsThreshold: 1.0
*/
  return (
    <form className={'schema-options ' + className} onSubmit={handleSubmit(onSubmit)}>
      <section>
        <Typography as='label'>Strict Matching: </Typography>
        <Controller
          as={<Checkbox name='strictMatching' />}
          name='strictMatching'
          value='strict'
          control={control}
          defaultValue={false}
        />
      </section>

      <SliderField name='enumMinimumRowCount' label='Enable Enum at # of Rows' value={100} min={0} max={10000} step={10} control={control} />
      <SliderField name='enumAbsoluteLimit' label='Max # of Unique Value In an Enumeration' value={10} min={0} max={100} step={1} control={control} />
      <SliderField name='nullableRowsThreshold' label='% of Null Tolerance' value={0.02} min={0.0} max={0.10} step={0.005} control={control} />
      <SliderField name='uniqueRowsThreshold' label='% Unique Threshold' value={1.0} min={0.80} max={1.0} step={0.005} control={control} />
      <Button type='submit' color='primary'>Save Options</Button>
      <Button type='submit' color='secondary' onClick={reset}>Save Options</Button>
    </form>
  )
}
