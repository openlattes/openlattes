import React from 'react';
import {
  BrowserRouter as Router,
  Route,
} from 'react-router-dom';
import DashboardIcon from '@material-ui/icons/Dashboard';
import ShareIcon from '@material-ui/icons/Share';
import BarChartIcon from '@material-ui/icons/BarChart';

import Layout from './Layout';
import MenuItems from './MenuItems';
import MembersList from './MembersList';
import CollaborationIndicator from './CollaborationIndicator';
import ProductionIndicator from './ProductionIndicator';
import QuerySelectedMembers from './QuerySelectedMembers';

const RotatedBarChartIcon = () => <BarChartIcon style={{ transform: 'rotate(90deg)' }} />;

const menuItems = [
  {
    links: [
      {
        key: 1, Icon: DashboardIcon, label: 'Home', to: '/',
      },
    ],
    divider: { key: 2 },
  },
  {
    subheader: { key: 3, title: 'Produções Bibliográficas' },
    links: [
      {
        key: 4, Icon: BarChartIcon, label: 'Evolução', to: '/productions_year',
      },
      {
        key: 5, Icon: RotatedBarChartIcon, label: 'Membros', to: '/productions_member',
      },
      {
        key: 6, Icon: ShareIcon, label: 'Coautorias', to: '/collaborations',
      },
    ],
    divider: { key: 7 },
  },
  {
    subheader: { key: 8, title: 'Orientações' },
    links: [
      {
        key: 9, Icon: BarChartIcon, label: 'Evolução', to: '/supervisions_year',
      },
      {
        key: 11, Icon: RotatedBarChartIcon, label: 'Membros', to: '/supervisions_member',
      },
    ],
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
          path: '/productions_year',
          render: <ProductionIndicator selectedMembers={selectedMembers} />,
        },
        {
          key: 4,
          exact: false,
          path: '/productions_member',
          render: <ProductionIndicator selectedMembers={selectedMembers} />,
        },
        {
          key: 5,
          exact: false,
          path: '/supervisions_year',
          render: <ProductionIndicator collection="SUPERVISION" selectedMembers={selectedMembers} />,
        },
        {
          key: 6,
          exact: false,
          path: '/supervisions_member',
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
