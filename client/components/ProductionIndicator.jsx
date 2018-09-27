import React, { Component } from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { OrdinalFrame } from 'semiotic';

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

const items = {
  'Apresentação de Trabalho': {
    key: 1, label: 'Apresentação de Trabalho', color: '#111111', checked: true,
  },
  'Artigo Aceito': {
    key: 2, label: 'Artigo Aceito', color: '#282b30', checked: true,
  },
  'Artigo em Periódico': {
    key: 3, label: 'Artigo em Periódico', color: '#434f63', checked: true,
  },
  'Capítulo de Livro': {
    key: 4, label: 'Capítulo de Livro', color: '#fa648e', checked: true,
  },
  Livro: {
    key: 5, label: 'Livro', color: '#406cb2', checked: true,
  },
  'Outra Produção Bibliográfica': {
    key: 6, label: 'Outra Produção Bibliográfica', color: '#256fe8', checked: true,
  },
  'Resumo Expandido em Congresso': {
    key: 7, label: 'Resumo Expandido em Congresso', color: '#0061ff', checked: true,
  },
  'Resumo em Congresso': {
    key: 8, label: 'Resumo em Congresso', color: '#9400ff', checked: true,
  },
  'Texto em Jornal de Notícia': {
    key: 9, label: 'Texto em Jornal de Notícia', color: '#653787', checked: true,
  },
  'Trabalho Completo em Congresso': {
    key: 10, label: 'Trabalho Completo em Congresso', color: '#4b3b56', checked: true,
  },
};


class StackedBar extends Component {
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

    return (
      <Query query={GET_INDICATOR}>
        {({ loading, error, data }) => {
          if (loading) return 'Carregando...';
          if (error) return 'Não foi possível carregar o gráfico.';

          return (
            <div>
              <OrdinalFrame
                size={[900, 500]}
                data={
                  data.indicator.filter(({ type }) =>
                    selectedCheckboxes.has(type))
                }
                oAccessor="year"
                rAccessor="count"
                style={d => ({ fill: items[d.type].color, stroke: 'white' })}
                type="bar"
                projection="vertical"
                axis={{
                  orient: 'left',
                }}
                margin={{
                  top: 10, bottom: 50, right: 10, left: 100,
                }}
                oLabel={d => (
                  <text transform="translate(-15,0)rotate(45)">{d}</text>
                )}
                sortO={(a, b) => a > b}
                oPadding={2}
                baseMarkProps={{ forceUpdate: true }}
              />
              <Checkboxes
                onChange={this.updateSelectedCheckboxes}
                items={Object.values(items)}
              />
            </div>
          );
        }}
      </Query>
    );
  }
}

export default StackedBar;
