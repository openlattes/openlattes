import { makeExecutableSchema, addMockFunctionsToSchema, mockServer } from 'apollo-server-express';
import { graphql } from 'graphql';
import typeDefs from './schema';

const members = [
  {
    id: 'single member, all fields',
    query: `
      {
        member(_id: "1") {
          _id
          id
          fullName
          citationName
          lattesId
          cvLastUpdate
          campus
        }
      }
    `,
    expected: {
      data: {
        member: {
          _id: '1',
          id: '1',
          fullName: 'Word',
          citationName: 'Word',
          lattesId: 'Word',
          cvLastUpdate: 'Word',
          campus: 'Word',
        },
      },
    },
  },
  {
    id: 'list of members, only names',
    query: `
      {
        members {
          fullName
        }
      }
    `,
    variables: {},
    context: {},
    expected: {
      data: {
        members: [
          { fullName: 'Word' },
          { fullName: 'Word' },
        ],
      },
    },
  },
  {
    id: 'list of selected members, only lattesId',
    query: `
      {
        members(members: ["1", "1", "1", "1", "1"]) {
          lattesId
        }
      }
    `,
    variables: {},
    context: {},
    expected: {
      data: {
        members: [
          { lattesId: 'Word' },
          { lattesId: 'Word' },
        ],
      },
    },
  },
];

const productions = [
  {
    id: 'single production, all fields',
    query: `
      {
        production(_id: "1") {
          _id
          title
          year
          authors
          magazine
          volume
          type
        }
      }
    `,
    expected: {
      data: {
        production: {
          _id: '1',
          title: 'Word',
          year: 1,
          authors: 'Word',
          magazine: 'Word',
          volume: 'Word',
          type: 'Word',
        },
      },
    },
  },
  {
    id: 'list of productions, only titles',
    query: `
      {
        productions {
          title
        }
      }
    `,
    variables: {},
    context: {},
    expected: {
      data: {
        productions: [
          { title: 'Word' },
          { title: 'Word' },
        ],
      },
    },
  },
  {
    id: 'list of productions, of a year, only authors',
    query: `
      {
        productions(year: 1) {
          authors
        }
      }
    `,
    variables: {},
    context: {},
    expected: {
      data: {
        productions: [
          { authors: 'Word' },
          { authors: 'Word' },
        ],
      },
    },
  },
];

const supervisions = [
  {
    id: 'single supervision, all fields',
    query: `
      {
        supervision(_id: "1") {
          _id
          supervisedStudent
          fundingAgency
          documentTitle
          completed
          degreeType
          year
          institution
        }
      }
    `,
    expected: {
      data: {
        supervision: {
          _id: '1',
          supervisedStudent: 'Word',
          fundingAgency: 'Word',
          documentTitle: 'Word',
          completed: false,
          degreeType: 'Word',
          year: 1,
          institution: 'Word',
        },
      },
    },
  },
  {
    id: 'list of supervisions, only documentTitle',
    query: `
      {
        supervisions {
          documentTitle
        }
      }
    `,
    variables: {},
    context: {},
    expected: {
      data: {
        supervisions: [
          { documentTitle: 'Word' },
          { documentTitle: 'Word' },
        ],
      },
    },
  },
  {
    id: 'list of supervisions, of a year, only degreeType',
    query: `
      {
        supervisions(year: 1) {
          degreeType
        }
      }
    `,
    variables: {},
    context: {},
    expected: {
      data: {
        supervisions: [
          { degreeType: 'Word' },
          { degreeType: 'Word' },
        ],
      },
    },
  },
];

const productionIndicators = (collection) => {
  const id = `${collection.toLowerCase()} indicator`;

  return [
    {
      id: `${id} by year`,
      query: `
        query ($collection: Collection, $by: By) {
          indicator(collection: $collection, by: $by) {
            year
            count
            type
          }
        }
      `,
      variables: {
        collection,
        by: 'year',
      },
      expected: {
        data: {
          indicator: [
            { year: 1, count: 1, type: 'Word' },
            { year: 1, count: 1, type: 'Word' },
          ],
        },
      },
    },
    {
      id: `${id} by year, one member`,
      query: `
        query ($collection: Collection, $by: By, $members: [ID]) {
          indicator(collection: $collection, by: $by, members: $members) {
            year
            count
            type
          }
        }
      `,
      variables: {
        collection,
        by: 'year',
        members: '1',
      },
      expected: {
        data: {
          indicator: [
            { year: 1, count: 1, type: 'Word' },
            { year: 1, count: 1, type: 'Word' },
          ],
        },
      },
    },
    {
      id: `${id} by year, five members`,
      query: `
        query ($collection: Collection, $by: By, $members: [ID]) {
          indicator(collection: $collection, by: $by, members: $members) {
            year
            count
            type
          }
        }
      `,
      variables: {
        collection,
        by: 'year',
        members: ['1', '1', '1', '1', '1'],
      },
      expected: {
        data: {
          indicator: [
            { year: 1, count: 1, type: 'Word' },
            { year: 1, count: 1, type: 'Word' },
          ],
        },
      },
    },
    {
      id: `${id} by year, one campus`,
      query: `
        query ($collection: Collection, $by: By, $campus: [String]) {
          indicator(collection: $collection, by: $by, campus: $campus) {
            year
            count
            type
          }
        }
      `,
      variables: {
        collection,
        by: 'year',
        campus: 'Word',
      },
      expected: {
        data: {
          indicator: [
            { year: 1, count: 1, type: 'Word' },
            { year: 1, count: 1, type: 'Word' },
          ],
        },
      },
    },
    {
      id: `${id} by year, five campus`,
      query: `
        query ($collection: Collection, $by: By, $campus: [String]) {
          indicator(collection: $collection, by: $by, campus: $campus) {
            year
            count
            type
          }
        }
      `,
      variables: {
        collection,
        by: 'year',
        campus: ['Word', 'Word', 'Word', 'Word', 'Word'],
      },
      expected: {
        data: {
          indicator: [
            { year: 1, count: 1, type: 'Word' },
            { year: 1, count: 1, type: 'Word' },
          ],
        },
      },
    },
    {
      id: `${id} by year, one member, one campus`,
      query: `
        query ($collection: Collection, $by: By, $members: [ID], $campus: [String]) {
          indicator(collection: $collection, by: $by, members: $members, campus: $campus) {
            year
            count
            type
          }
        }
      `,
      variables: {
        collection,
        by: 'year',
        members: '1',
        campus: 'Word',
      },
      expected: {
        data: {
          indicator: [
            { year: 1, count: 1, type: 'Word' },
            { year: 1, count: 1, type: 'Word' },
          ],
        },
      },
    },
    {
      id: `${id} by year, five members, five campus`,
      query: `
        query ($collection: Collection, $by: By, $members: [ID], $campus: [String]) {
          indicator(collection: $collection, by: $by, members: $members, campus: $campus) {
            year
            count
            type
          }
        }
      `,
      variables: {
        collection,
        by: 'year',
        members: ['1', '1', '1', '1', '1'],
        campus: ['Word', 'Word', 'Word', 'Word', 'Word'],
      },
      expected: {
        data: {
          indicator: [
            { year: 1, count: 1, type: 'Word' },
            { year: 1, count: 1, type: 'Word' },
          ],
        },
      },
    },
    {
      id: `${id} by member`,
      query: `
        query ($collection: Collection, $by: By) {
          indicator(collection: $collection, by: $by) {
            member
            count
            type
          }
        }
      `,
      variables: {
        collection,
        by: 'member',
      },
      expected: {
        data: {
          indicator: [
            { member: 'Word', count: 1, type: 'Word' },
            { member: 'Word', count: 1, type: 'Word' },
          ],
        },
      },
    },
    {
      id: `${id} by member, one member`,
      query: `
        query ($collection: Collection, $by: By, $members: [ID]) {
          indicator(collection: $collection, by: $by, members: $members) {
            member
            count
            type
          }
        }
      `,
      variables: {
        collection,
        by: 'member',
        members: '1',
      },
      expected: {
        data: {
          indicator: [
            { member: 'Word', count: 1, type: 'Word' },
            { member: 'Word', count: 1, type: 'Word' },
          ],
        },
      },
    },
    {
      id: `${id} by member, five members`,
      query: `
        query ($collection: Collection, $by: By, $members: [ID]) {
          indicator(collection: $collection, by: $by, members: $members) {
            member
            count
            type
          }
        }
      `,
      variables: {
        collection,
        by: 'member',
        members: ['1', '1', '1', '1', '1'],
      },
      expected: {
        data: {
          indicator: [
            { member: 'Word', count: 1, type: 'Word' },
            { member: 'Word', count: 1, type: 'Word' },
          ],
        },
      },
    },
    {
      id: `${id} by member, one campus`,
      query: `
        query ($collection: Collection, $by: By, $campus: [String]) {
          indicator(collection: $collection, by: $by, campus: $campus) {
            member
            count
            type
          }
        }
      `,
      variables: {
        collection,
        by: 'member',
        campus: 'Word',
      },
      expected: {
        data: {
          indicator: [
            { member: 'Word', count: 1, type: 'Word' },
            { member: 'Word', count: 1, type: 'Word' },
          ],
        },
      },
    },
    {
      id: `${id} by member, five campus`,
      query: `
        query ($collection: Collection, $by: By, $campus: [String]) {
          indicator(collection: $collection, by: $by, campus: $campus) {
            member
            count
            type
          }
        }
      `,
      variables: {
        collection,
        by: 'member',
        campus: ['Word', 'Word', 'Word', 'Word', 'Word'],
      },
      expected: {
        data: {
          indicator: [
            { member: 'Word', count: 1, type: 'Word' },
            { member: 'Word', count: 1, type: 'Word' },
          ],
        },
      },
    },
    {
      id: `${id} by member, one member, one campus`,
      query: `
        query ($collection: Collection, $by: By, $members: [ID], $campus: [String]) {
          indicator(collection: $collection, by: $by, members: $members, campus: $campus) {
            member
            count
            type
          }
        }
      `,
      variables: {
        collection,
        by: 'member',
        members: '1',
        campus: 'Word',
      },
      expected: {
        data: {
          indicator: [
            { member: 'Word', count: 1, type: 'Word' },
            { member: 'Word', count: 1, type: 'Word' },
          ],
        },
      },
    },
    {
      id: `${id} by member, five members, five campus`,
      query: `
        query ($collection: Collection, $by: By, $members: [ID], $campus: [String]) {
          indicator(collection: $collection, by: $by, members: $members, campus: $campus) {
            member
            count
            type
          }
        }
      `,
      variables: {
        collection,
        by: 'member',
        members: ['1', '1', '1', '1', '1'],
        campus: ['Word', 'Word', 'Word', 'Word', 'Word'],
      },
      expected: {
        data: {
          indicator: [
            { member: 'Word', count: 1, type: 'Word' },
            { member: 'Word', count: 1, type: 'Word' },
          ],
        },
      },
    },
  ];
};

describe('Schema', () => {
  // Array of case types
  const cases = [
    ...members,
    ...productions,
    ...supervisions,
    ...productionIndicators('BIBLIOGRAPHIC'),
    ...productionIndicators('SUPERVISION'),
  ];

  const mockSchema = makeExecutableSchema({ typeDefs });

  // Return payloads of mocked types
  addMockFunctionsToSchema({
    schema: mockSchema,
    mocks: {
      Boolean: () => false,
      ID: () => '1',
      Int: () => 1,
      Float: () => 12.34,
      String: () => 'Word',
    },
  });

  test('has valid type definitions', async () => {
    expect(async () => {
      const MockServer = mockServer(typeDefs);

      await MockServer.query('{ __schema { types { name } } }');
    }).not.toThrow();
  });

  cases.forEach(({
    id, query, variables, context: ctx, expected,
  }) => {
    test(`query: ${id}`, async () =>
      expect(graphql(mockSchema, query, null, { ctx }, variables))
        .resolves.toEqual(expected));
  });
});
