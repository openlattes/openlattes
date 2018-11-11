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
        {data.reduce((list, { divider, subheader, links }) => {
          const subheaderList = subheader
            ? [<ListSubheader key={subheader.key}>{subheader.title}</ListSubheader>]
            : [];

          const linksList = links.map(({
            key, Icon, label, to,
          }) => (
            <ListItem
              onClick={() => client.writeData({ data: { selectedMembers: [] } })}
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

          const dividerList = divider ? [<Divider key={divider.key} />] : [];

          return [...list, ...subheaderList, ...linksList, ...dividerList];
        }, [])}
      </List>
    )}
  </ApolloConsumer>
);

MenuItems.propTypes = {
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

export default MenuItems;
