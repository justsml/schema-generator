import React, { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
// import PropTypes from 'prop-types';
import { withStyles, makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import Slider from '@material-ui/core/Slider'
// import Input from '@material-ui/core/Input'
import Checkbox from '@material-ui/core/Checkbox'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardContent from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/CardActions'
import Collapse from '@material-ui/core/Collapse'
import SaveIcon from '@material-ui/icons/Save'
import CloseIcon from '@material-ui/icons/Close'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import RefreshIcon from '@material-ui/icons/Refresh'
import SettingsIcon from '@material-ui/icons/Settings'

const useStyles = makeStyles(theme => ({
  root: {
    maxWidth: '50vw',
    width: 420 + theme.spacing(3) * 2
  },
  margin: {
    height: theme.spacing(3)
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },

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
// React.forwardRef((props, ref) => {
const RangeInputField = React.forwardRef(({ name, label, value, control, register, ...args }, ref) => (<WrapWithLabel label={label}>
  <input
    type='number'
    name={name}
    aria-label={label}
    defaultValue={value}
    ref={ref}
    {...args}
  />
</WrapWithLabel>))

export default function AdvancedOptionsForm ({ options, className, onSave = (opts) => console.log('TODO: Add onSave handler to options form', opts) }) {
  const classes = useStyles()
  const methods = useForm({ defaultValues: options })
  const { handleSubmit, control, reset, register } = methods
  const onSubmit = data => {
    console.log('Saved Options', data)
    if (onSave) onSave(data)
  }

  /*
strictMatching: true,
enumMinimumRowCount: 100,
enumAbsoluteLimit: 10,
enumPercentThreshold: 0.01,
nullableRowsThreshold: 0.02,
uniqueRowsThreshold: 1.0
*/
    const [expanded, setExpanded] = React.useState(false);

    const handleExpandClick = () => {
      setExpanded(!expanded);
    };

  return (
    <Card className={classes.root}>
      <CardHeader
        avatar={
          <SettingsIcon />
        }
        action={
          <IconButton aria-label='settings' onClick={handleExpandClick}>
            {expanded ? <CloseIcon /> : <ExpandMoreIcon />}
          </IconButton>
        }
        title='Advanced Options'
        // subheader='Control Detection Options'
      />


      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <form className={'schema-options ' + className} onSubmit={handleSubmit(onSubmit)}>
            <fieldset className='form-group'>
              <legend>Unique Detection</legend>
              <section className='input-group d-flex justify-content-between'>
                <Typography>Strict Matching</Typography>
                <Controller
                  as={<Checkbox name='strictMatching' />}
                  name='strictMatching'
                  value='strict'
                  control={control}
                />
              </section>
            </fieldset>

            <fieldset className='form-group'>
              <legend>Unique</legend>

              <label className='input-group d-flex justify-content-between'>
                <Typography>Rows Required to Detect Enumerations</Typography>
                <input type='number' name='enumMinimumRowCount' defaultValue={100} min={0} max={10000} step={10} ref={register({ min: 0, max: 10000 })} />
              </label>
              <label className='input-group d-flex justify-content-between'>
                <Typography>Max Size of Enumerations</Typography>
                <input type='number' name='enumAbsoluteLimit' defaultValue={10} min={0} max={100} step={1} ref={register({ min: 0, max: 100 })} />
              </label>
            </fieldset>

            <fieldset className='form-group'>
              <legend>Null Detection</legend>
              <label className='input-group'>
                <Typography>'Not Null' % Error Tolerance</Typography>
                <input type='range' class='custom-range' name='nullableRowsThreshold' defaultValue={0.02} min={0.0} max={0.10} step={0.005} ref={register({ min: 0.0, max: 0.10 })} />
              </label>
            </fieldset>

            <fieldset className='form-group'>
              <legend>Unique Detection</legend>
              <label className='input-group'>
                <Typography>% Unique Threshold</Typography>
                <input type='range' class='custom-range' name='uniqueRowsThreshold' defaultValue={1.0} min={0.80} max={1.0} step={0.005} ref={register({ min: 0.80, max: 1.0 })} />
              </label>
            </fieldset>

          </form>
        </CardContent>
        <CardActions disableSpacing className="d-flex justify-content-between">
          <Button variant='contained' type='submit' color='primary' startIcon={<SaveIcon />}>Save</Button>
          <Button variant='contained' type='reset' color='secondary' startIcon={<RefreshIcon />} onClick={reset}>Reset</Button>
        </CardActions>
      </Collapse>
    </Card>
  )
}
