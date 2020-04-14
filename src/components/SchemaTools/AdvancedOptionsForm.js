import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
// import PropTypes from 'prop-types';
import { withStyles, makeStyles } from "@material-ui/core/styles";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import Slider from "@material-ui/core/Slider";
// import Input from '@material-ui/core/Input'
import Checkbox from "@material-ui/core/Checkbox";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Collapse from "@material-ui/core/Collapse";
import SaveIcon from "@material-ui/icons/Save";
import CloseIcon from "@material-ui/icons/Close";
import RefreshIcon from "@material-ui/icons/Refresh";
import SettingsIcon from "@material-ui/icons/Settings";

import InputLabel from "@material-ui/core/InputLabel";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";

const useStyles = makeStyles((theme) => ({
  root: {
    transform: "scale(1.25)",
    margin: "0",
    width: "42px",
    minWidth: "0",
    maxWidth: "42px",
    marginRight: "-30px",
    marginTop: "-10px",
  },
  // header: {
  //   padding: '0.5rem',
  //   maxWidth: '64px',
  //   maxHeight: '64px'
  // },
  margin: {
    height: theme.spacing(3),
  },
  expand: {
    transform: "rotate(0deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: "rotate(180deg)",
  },
  form: {
    width: "100%",
    "& [type='range']": {
      width: 110,
    },
  },
  parentPanel: {},
  panel: {
    position: "absolute",
    zIndex: 10,
  },
  panelContent: {
    position: "relative",
    margin: "0 0 2.5rem 0",
    top: "0.45rem",
    background:
      "linear-gradient(to bottom, rgba(255,255,255,1) 0%, rgba(245,245,245,0.98) 25%, rgba(245,245,245,0.98) 75%, rgba(255,255,255,1) 100%)" /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */,
    // background: 'rgba(245, 245, 245, 0.985)',
    height: "auto",
    maxHeight: "calc(100vh - 7rem)",
    overflowY: "auto",
    minWidth: "400px",
  },
}));

// const WrapWithLabel = ({ label, children }) => <section className='form-field'>
//   <Typography as='label'>{label}: </Typography>
//   {children}
// </section>

// const SliderField = ({ name, label, value, control, ...args }) => (<WrapWithLabel label={label}>
//   <Controller
//     as={Slider}
//     {...args}
//     valueLabelDisplay='auto'
//     aria-label={label}
//     name={name}
//     control={control}
//     defaultValue={value}
//   />
// </WrapWithLabel>)
// // React.forwardRef((props, ref) => {
// const RangeInputField = React.forwardRef(({ name, label, value, control, register, ...args }, ref) => (<WrapWithLabel label={label}>
//   <input
//     type='number'
//     name={name}
//     aria-label={label}
//     defaultValue={value}
//     ref={ref}
//     {...args}
//   />
// </WrapWithLabel>))
const percentFormatter = new Intl.NumberFormat({
  style: "percent",
  minimumFractionDigits: 2,
});
const formatPercent = (number) =>
  number != null && Number(percentFormatter.format(number)).toFixed(2);

export default function AdvancedOptionsForm({
  expanded,
  setExpanded,
  options = {
    adapter: 'knex',
    strictMatching: true,
    enumMinimumRowCount: 100,
    enumAbsoluteLimit: 10,
    enumPercentThreshold: 0.01,
    nullableRowsThreshold: 0.02,
    uniqueRowsThreshold: 1.0,
  },
  className = "",
  onSave = (opts) =>
    console.log("TODO: Add onSave handler to options form", opts),
}) {
  const classes = useStyles();
  const methods = useForm({ defaultValues: options });
  const $formRef = React.useRef()
  const { handleSubmit, control, reset, register, watch } = methods;
  const onSubmit = (data) => {
    const updatedOptions = {
      ...data,
      nullableRowsThreshold: data.nullableRowsThreshold / 100.0,
      uniqueRowsThreshold: data.uniqueRowsThreshold / 100.0,
    };
    console.log("Saved Options", updatedOptions);

    if (onSave) onSave(updatedOptions);
    // setExpanded(false);
  };


  const handleExpandClick = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setExpanded(!expanded);
  };

  const displayNullableRowsThreshold = formatPercent(
    100.0 * watch("nullableRowsThreshold")
  );
  const displayUniqueRowsThreshold =
    100 - formatPercent(100.0 * watch("uniqueRowsThreshold"));

  const autoSaveForm = event => {
    console.info('AutoSave.onChange', options)
    handleSubmit(onSubmit)(event)
    // if ($formRef.current && $formRef.current.submit) $formRef.current.submit();
  }

  return (
    <>
      <Button
        id="btn-toggle-settings"
        className={classes.root + " py-2"}
        aria-label="open settings panel"
        onClick={handleExpandClick}
        disableRipple
        title="Advanced Options"
      >
        {expanded ? (
          <CloseIcon aria-label="Close" />
        ) : (
          <SettingsIcon aria-label="Open Advanced Options" />
        )}
      </Button>
      <Card raised={false} style={{ marginLeft: "-300px" }}>
        <Collapse in={expanded} className={classes.panel} timeout="auto">
          <form
            className={"schema-options " + className + " " + classes.form}
            onSubmit={handleSubmit(onSubmit)}
            onChange={autoSaveForm}
          >
            <Paper elevation={3} className={classes.panelContent}>
              <CardContent className="pb-1 px-3 pt-2">
                <fieldset className="form-group">
                  <legend className="mb-1">Global Rules</legend>
                  <section className="input-group d-flex justify-content-between">
                    <Typography>Strict Matching</Typography>
                    <Controller
                      as={
                        <Checkbox
                          name="strictMatching"
                          style={{ padding: "0" }}
                        />
                      }
                      name="strictMatching"
                      value="strict"
                      defaultValue={options.strictMatching}
                      control={control}
                    />
                  </section>
                  <section className="input-group d-flex justify-content-between">
                    <InputLabel htmlFor="adapter">
                      <Typography>Output Adapter</Typography>
                    </InputLabel>
                    <Select
                      native
                      defaultValue={options.adapter}
                      inputProps={{
                        name: "adapter",
                        id: "adapter",
                      }}
                      inputRef={register()}
                    >
                      <option value={"knex"}>Knex</option>
                      <option value={"mongoose"}>Mongoose</option>
                      <option value={"typescript"}>TypeScript Type</option>
                    </Select>
                  </section>
                </fieldset>

                <fieldset className="form-group">
                  <legend className="mb-1">Enumerations</legend>

                  <label className="input-group d-flex justify-content-between">
                    <Typography>Min. Rows for Enumerations</Typography>
                    <input
                      type="number"
                      name="enumMinimumRowCount"
                      defaultValue={100}
                      min={0}
                      max={10000}
                      step={10}
                      title="Between 0-10000, Default: 100"
                      ref={register({ min: 0, max: 10000 })}
                    />
                  </label>
                  <label className="input-group d-flex justify-content-between">
                    <Typography>Enumeration Item Limit</Typography>
                    <input
                      type="number"
                      name="enumAbsoluteLimit"
                      defaultValue={10}
                      min={0}
                      max={100}
                      step={1}
                      title="Between 0-100, Default=10"
                      ref={register({ min: 0, max: 100 })}
                    />
                  </label>
                </fieldset>

                <fieldset className="form-group">
                  <legend className="mb-1">Null Detection</legend>
                  <label className="input-group d-flex justify-content-between">
                    <Typography>'Not Null' % Tolerance</Typography>
                    <input
                      type="range"
                      name="nullableRowsThreshold"
                      defaultValue={0.02}
                      min={0.0}
                      max={0.1}
                      step={0.005}
                      title="Between 0.0-0.10, Default: 0.02"
                      ref={register({ min: 0.0, max: 0.1 })}
                    />
                    <span>{displayNullableRowsThreshold}%</span>
                  </label>
                </fieldset>

                <fieldset className="form-group">
                  <legend className="mb-1">Uniqueness Detection</legend>
                  <label className="input-group d-flex justify-content-between">
                    <Typography>% Not Unique Threshold</Typography>
                    <input
                      type="range"
                      name="uniqueRowsThreshold"
                      defaultValue={1.0}
                      min={0.8}
                      max={1.0}
                      step={0.005}
                      ref={register({ min: 0.8, max: 1.0 })}
                    />
                    <span>{displayUniqueRowsThreshold}%</span>
                  </label>
                </fieldset>

                {/* <div className="input-group mb-3">
                <div className="input-group-prepend">
                  <span className="input-group-text">$</span>
                </div>
                <input type="text" className="form-control" aria-label="Amount (to the nearest dollar)" />
                <div className="input-group-append">
                  <span className="input-group-text">.00</span>
                </div>
              </div> */}
              </CardContent>
              <CardActions
                disableSpacing
                className="d-flex justify-content-around"
              >
                <Button
                  variant="contained"
                  type="submit"
                  color="primary"
                  size="small"
                  startIcon={<SaveIcon />}
                >
                  Save
                </Button>
              </CardActions>
            </Paper>
          </form>
        </Collapse>
      </Card>
    </>
  );
}
