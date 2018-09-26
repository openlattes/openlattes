import React from 'react';
import PropTypes from 'prop-types';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';

class Checkboxes extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
    props.items.forEach(({ label, checked }) => {
      this.state[label] = checked;
    });

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    this.setState({ [e.target.value]: e.target.checked });
    this.props.onChange(e);
  }

  render() {
    return (
      <div>
        <FormGroup>
          {this.props.items.map(({ key, label, color }) => (
            <FormControlLabel
              label={label}
              key={key}
              control={
                <Checkbox
                  checked={this.state[label]}
                  onChange={this.handleChange}
                  value={label}
                  style={{ color }}
                />
              }
            />
          ))}
        </FormGroup>
      </div>
    );
  }
}

Checkboxes.propTypes = {
  onChange: PropTypes.func.isRequired,
  items: PropTypes.arrayOf(PropTypes.shape({
    key: PropTypes.number.isRequired,
    label: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired,
    checked: PropTypes.bool.isRequired,
  })).isRequired,
};

export default Checkboxes;
