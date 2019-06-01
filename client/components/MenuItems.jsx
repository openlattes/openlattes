import React from 'react';
import PropTypes from 'prop-types';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import { Link } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';

const styles = () => ({
  divider: {
    marginTop: 10,
  },
  subheader: {
    marginTop: 10,
    marginBottom: 3,
  },
});

const MenuItems = ({ data, classes }) => (
  <List>
    {data.reduce((list, { divider, subheader, links }) => {
      const subheaderList =
        subheader ? [(
          <ListSubheader key={subheader.key} className={classes.subheader}>
            {subheader.title}
          </ListSubheader>
        )] : [];

      const linksList = links.map(({
        key, Icon, label, to,
      }) => (
        <ListItem
          component={Link}
          to={to}
          button
          key={key}
        >
          <ListItemIcon>
            <Icon />
          </ListItemIcon>
          <ListItemText primary={label} />
        </ListItem>
      ));

      const dividerList = divider ? [(
        <Divider key={divider.key} className={classes.divider} />
      )] : [];

      return [...list, ...subheaderList, ...linksList, ...dividerList];
    }, [])}
  </List>
);

MenuItems.propTypes = {
  /* eslint-disable react/forbid-prop-types */
  classes: PropTypes.object.isRequired,
  /* eslint-enable react/forbid-prop-types */
  data: PropTypes.arrayOf(PropTypes.shape({
    subheader: PropTypes.shape({
      key: PropTypes.number,
      title: PropTypes.string,
    }),
    links: PropTypes.arrayOf(PropTypes.shape({
      Icon: PropTypes.func.isRequired,
      label: PropTypes.string.isRequired,
      to: PropTypes.string.isRequired,
      key: PropTypes.number.isRequired,
    }).isRequired).isRequired,
    divider: PropTypes.shape({
      key: PropTypes.number,
    }),
  }).isRequired).isRequired,
};

export default withStyles(styles)(MenuItems);
