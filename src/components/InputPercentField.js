import React from 'react';
import NumberFormat from 'react-number-format';

export default function InputPercentField(props) {
  const { inputRef, onChange, inputProps = {}, ...other } = props;

  return (
    <NumberFormat
      {...inputProps}
      {...other}
      getInputRef={inputRef}
      onValueChange={(values) => {
        onChange({
          target: {
            name: props.name,
            value: values.value,
          },
        });
      }}
      thousandSeparator
      isNumericString
      fixedDecimalScale={true}
      suffix="%"
    />
  );
}
