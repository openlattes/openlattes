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

const items = [
  {
    key: 1, label: 'Apresentação de Trabalho', color: '#111111', checked: true,
  },
  {
    key: 2, label: 'Artigo Aceito', color: '#282b30', checked: true,
  },
  {
    key: 3, label: 'Artigo em Periódico', color: '#434f63', checked: true,
  },
  {
    key: 4, label: 'Capítulo de Livro', color: '#fa648e', checked: true,
  },
  {
    key: 5, label: 'Livro', color: '#406cb2', checked: true,
  },
  {
    key: 6, label: 'Outra Produção Bibliográfica', color: '#256fe8', checked: true,
  },
  {
    key: 7, label: 'Resumo Expandido em Congresso', color: '#0061ff', checked: true,
  },
  {
    key: 8, label: 'Resumo em Congresso', color: '#9400ff', checked: true,
  },
  {
    key: 9, label: 'Texto em Jornal de Notícia', color: '#653787', checked: true,
  },
  {
    key: 10, label: 'Trabalho Completo em Congresso', color: '#4b3b56', checked: true,
  },
];


class ProductionIndicator extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedCheckboxes:
        new Set(Object
          .values(items)
          .filter(({ checked }) => checked)
          .map(({ label }) => label)),
    };


    this.updateSelectedCheckboxes = this.updateSelectedCheckboxes.bind(this);
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

    const colorHash = items.reduce((colors, { label, color }) =>
      Object.assign(colors, { [label]: color }), {});

    return (
      <Query query={GET_INDICATOR}>
        {({ loading, error, data }) => {
          if (loading) return 'Carregando...';
          if (error) return 'Não foi possível carregar o gráfico.';

          return (
            <div>
              <StackedBarChart
                data={data.indicator
                  .filter(({ type }) => selectedCheckboxes.has(type))}
                colorHash={colorHash}
              />
              <Checkboxes
                onChange={this.updateSelectedCheckboxes}
                items={items}
              />
            </div>
          );
        }}
      </Query>
    );
  }
}

export default ProductionIndicator;
