import React from 'react';
import PropTypes from 'prop-types';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import { withStyles } from '@material-ui/core/styles';

const styles = () => ({
  checkbox: {
    paddingTop: '0px',
    paddingBottom: '0px',
  },
});

const Checkboxes = ({
  classes, items, colorHash, selected, onChange,
}) => (
  <div>
    <FormGroup>
      {items.map(label => (
        <FormControlLabel
          label={label}
          key={label}
          control={
            <Checkbox
              className={classes.checkbox}
              checked={selected.has(label)}
              onChange={onChange}
              value={label}
              style={{ color: colorHash.get(label) }}
            />
          }
        />
      ))}
    </FormGroup>
  </div>
);

Checkboxes.propTypes = {
  classes: PropTypes.shape({
    checkbox: PropTypes.string,
  }).isRequired,
  items: PropTypes.arrayOf(PropTypes.string).isRequired,
  colorHash: PropTypes.instanceOf(Map).isRequired,
  selected: PropTypes.instanceOf(Set).isRequired,
  onChange: PropTypes.func.isRequired,
};

export default withStyles(styles)(Checkboxes);
