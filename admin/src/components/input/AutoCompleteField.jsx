import React from "react";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";

export default function AutoCompleteField({ name, value, label, data, onChange, multiple, required }) {
  return (
    <Autocomplete
      id="tags-standard"
      options={data}
      value={value.map((item) => {
        return {
          name: item.name,
          code: item.code
        }
      })}
      defaultValue={value.map((item) => {
        return {
          name: item.name,
          code: item.code
        }
      })}
      filterSelectedOptions
      getOptionLabel={(option) => option.name ? option.name : ''}
      getOptionSelected={(option, value) => option.name === value.name}
      fullWidth
      name={name}
      multiple={multiple}
      onChange={onChange}
      renderInput={(params) => (
        <TextField {...params} name={name} label={label} variant="outlined" />
      )}
    />
  );
}
