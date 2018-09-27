import React, { Component } from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

import StackedBarChart from './StackedBarChart';
import Checkboxes from './Checkboxes';

const GET_INDICATOR = gql`
  {
    indicator {
      year
      count
      type
    }
  }
`;

class ProductionIndicator extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedCheckboxes: new Set(),
    };

    this.initSelectedCheckboxes = this.initSelectedCheckboxes.bind(this);
    this.updateSelectedCheckboxes = this.updateSelectedCheckboxes.bind(this);
  }

  initSelectedCheckboxes(itemsArray) {
    this.setState({
      selectedCheckboxes: new Set(itemsArray),
    });
  }

  updateSelectedCheckboxes(e) {
    const { selectedCheckboxes } = this.state;
    const label = e.target.value;

    if (selectedCheckboxes.has(label)) {
      selectedCheckboxes.delete(label);
    } else {
      selectedCheckboxes.add(label);
    }

    this.setState({
      selectedCheckboxes: new Set(selectedCheckboxes),
    });
  }

  render() {
    const { selectedCheckboxes } = this.state;

    return (
      <Query query={GET_INDICATOR}>
        {({ loading, error, data }) => {
          if (loading) return 'Carregando...';
          if (error) return 'Não foi possível carregar o gráfico.';

          const typesSet = data.indicator
            .reduce((set, { type }) => set.add(type), new Set());

          const colors = [
            '#111111', '#282b30', '#434f63', '#fa648e', '#406cb2',
            '#256fe8', '#0061ff', '#9400ff', '#653787', '#4b3b56',
          ];

          const typesArray = Array.from(typesSet.values());

          const items = typesArray
            .reverse()
            .map(type => ({
              label: type,
              checked: true,
              color: colors.pop(),
            }));

          const colorHash = items.reduce((obj, { label, color }) =>
            Object.assign(obj, { [label]: color }), {});

          const indicator = data.indicator
            .filter(({ type }) => selectedCheckboxes.has(type));

          return (
            <div>
              <StackedBarChart
                data={indicator}
                colorHash={colorHash}
              />
              <Checkboxes
                items={items}
                onMount={this.initSelectedCheckboxes}
                onChange={this.updateSelectedCheckboxes}
              />
            </div>
          );
        }}
      </Query>
    );
  }
}

export default ProductionIndicator;
