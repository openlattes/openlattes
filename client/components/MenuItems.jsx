import React from 'react';
import PropTypes from 'prop-types';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import { Link } from 'react-router-dom';
import { ApolloConsumer } from 'react-apollo';

const MenuItems = ({ data }) => (
  <ApolloConsumer>
    {client => (
      <List>
        {data.reduce((list, { subheader, links }) => {
          const dividerList = list.length ? [<Divider />] : [];
          const subheaderList = subheader ? [<ListSubheader>{subheader}</ListSubheader>] : [];

          const linksList = links.map(({ Icon, label, to }) => (
            <ListItem
              onClick={() => client.writeData({ data: { selectedMembers: [] } })}
              component={Link}
              to={to}
              button
            >
              <ListItemIcon>
                <Icon />
              </ListItemIcon>
              <ListItemText primary={label} />
            </ListItem>
          ));

          return [...list, ...dividerList, ...subheaderList, ...linksList];
        }, [])}
      </List>
    )}
  </ApolloConsumer>
);

MenuItems.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({
    subheader: PropTypes.string,
    links: PropTypes.arrayOf(PropTypes.shape({
      Icon: PropTypes.func.isRequired,
      label: PropTypes.string.isRequired,
      to: PropTypes.string.isRequired,
    }).isRequired).isRequired,
  }).isRequired).isRequired,
};

export default MenuItems;
