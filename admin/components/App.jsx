import React from 'react';
import {
  BrowserRouter as Router,
  Route,
} from 'react-router-dom';
import PeopleIcon from '@material-ui/icons/People';

import MenuItems from '../../client/components/MenuItems';
import QuerySelectedMembers from '../../client/components/QuerySelectedMembers';
import Layout from '../../client/components/Layout';

import MembersList from './MembersList';

const menuItems = [
  {
    links: [
      {
        key: 1, Icon: PeopleIcon, label: 'Membros', to: '/',
      },
    ],
    divider: { key: 2 },
  },
];

const App = () => (
  <QuerySelectedMembers>
    {(selectedMembers) => {
      const routes = [
        {
          key: 1,
          exact: true,
          path: '/',
          render: <MembersList selectedMembers={selectedMembers} />,
        },
      ];

      return (
        <Router>
          <Layout
            menuItems={<MenuItems data={menuItems} />}
          >
            {routes.map(({
              key, exact, path, render,
            }) => (
              <Route key={key} exact={exact} path={path} render={() => render} />
            ))}
          </Layout>
        </Router>
      );
    }}
  </QuerySelectedMembers>
);

export default App;
