import React from 'react';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';

const styles = theme => ({
  header: {
    backgroundColor: theme.palette.primary.light,
    padding: 5,
  },
  content: {
    padding: 5,
  },
});

const CustomCard = props => (
  <Card>
    <CardHeader
      disableTypography
      title={(
        <Typography variant="subtitle2" align="center">
          {props.title}
        </Typography>
      )}
      className={props.classes.header}
    />
    <CardContent
      style={{ paddingBottom: 5 }}
      className={props.classes.content}
    >
      {props.content}
    </CardContent>
  </Card>
);

CustomCard.propTypes = {
  classes: PropTypes.shape({
    header: PropTypes.string,
    content: PropTypes.string,
  }).isRequired,
  title: PropTypes.string.isRequired,
  /* eslint-disable react/forbid-prop-types */
  content: PropTypes.object.isRequired,
  /* eslint-enable react/forbid-prop-types */
};

export default withStyles(styles)(CustomCard);
