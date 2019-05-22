import React from 'react';
import PropTypes from 'prop-types';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

const styles = () => ({
  checkbox: {
    paddingTop: '0px',
    paddingBottom: '0px',
  },
});

const Checkboxes = ({
  classes, items, colorHash, selected, onChange,
}) => {
  const divide = 5;
  const checkboxes2 = items.map(label => (
    <Grid item key={label}>
      <FormControlLabel
        label={label}
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
    </Grid>
  ));

  const checkboxes1 = checkboxes2.splice(0, divide);
  const xs = checkboxes2.length ? 6 : 12;

  return (
    <FormGroup>
      <Grid container justify="center">
        <Grid container direction="column" item xs={xs}>
          {checkboxes1}
        </Grid>
        {checkboxes2.length ? (
          <Grid container direction="column" item xs={xs}>
            {checkboxes2}
          </Grid>
        ) : undefined}
      </Grid>
    </FormGroup>
  );
};

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
