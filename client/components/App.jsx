import React from 'react';
import {
  BrowserRouter as Router,
  Route,
} from 'react-router-dom';
import PeopleIcon from '@material-ui/icons/People';
import ShareIcon from '@material-ui/icons/Share';
import BarChartIcon from '@material-ui/icons/BarChart';

import Layout from './Layout';
import MenuItems from './MenuItems';
import MembersList from './MembersList';
import CollaborationIndicator from './CollaborationIndicator';
import ProductionIndicator from './ProductionIndicator';
import QuerySelectedMembers from './QuerySelectedMembers';

const menuItems = [
  {
    links: [
      {
        key: 1, Icon: PeopleIcon, label: 'Membros', to: '/',
      },
    ],
    divider: { key: 2 },
  },
  {
    subheader: { key: 3, title: 'Produções Bibliográficas' },
    links: [
      {
        key: 4, Icon: BarChartIcon, label: 'Produtividade', to: '/productions',
      },
      {
        key: 5, Icon: ShareIcon, label: 'Coautorias', to: '/collaborations',
      },
    ],
    divider: { key: 6 },
  },
  {
    subheader: { key: 7, title: 'Orientações Concluídas' },
    links: [
      {
        key: 8, Icon: BarChartIcon, label: 'Produtividade', to: '/supervisions',
      },
    ],
    divider: { key: 9 },
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
        {
          key: 2,
          exact: false,
          path: '/collaborations',
          render: <CollaborationIndicator selectedMembers={selectedMembers} />,
        },
        {
          key: 3,
          exact: false,
          path: '/productions',
          render: <ProductionIndicator selectedMembers={selectedMembers} />,
        },
        {
          key: 4,
          exact: false,
          path: '/supervisions',
          render: <ProductionIndicator collection="SUPERVISION" selectedMembers={selectedMembers} />,
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
