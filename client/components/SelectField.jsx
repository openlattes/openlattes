import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';

const styles = theme => ({
  root: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200,
  },
  menu: {
    width: 200,
  },
});

const SelectField = ({
  classes, options, onChange, value, label, helperText,
}) => (
  <TextField
    select
    label={label}
    className={classes.root}
    value={value}
    onChange={onChange}
    SelectProps={{
      MenuProps: {
        className: classes.menu,
      },
    }}
    helperText={helperText}
    margin="normal"
  >
    {options.map(option => (
      <MenuItem key={option.value} value={option.value}>
        {option.label}
      </MenuItem>
    ))}
  </TextField>
);

SelectField.propTypes = {
  classes: PropTypes.shape({
    root: PropTypes.string,
    menu: PropTypes.string,
  }).isRequired,
  options: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.string,
    label: PropTypes.string,
  })).isRequired,
  onChange: PropTypes.func,
  value: PropTypes.string,
  label: PropTypes.string,
  helperText: PropTypes.string,
};

SelectField.defaultProps = {
  onChange: undefined,
  label: undefined,
  value: undefined,
  helperText: undefined,
};

export default withStyles(styles)(SelectField);
