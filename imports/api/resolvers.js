import Member from './models/Member';
import Production from './models/Production';

const resolvers = {
  Query: {
    hello: () => "Hello, World!",

    member: (root, { _id }) => Member.findById(_id),

    members: () => Member.find(),

    production: (root, { _id }) => Production.findById(_id),

    productions: () => Production.find(),

    indicator: () =>
      Production.aggregate([
        {
          $group: {
            _id: { ano: "$ano", type: "$type" },
            qtd: { $sum: 1 },
          }
        },
        {
          $project: {
            _id: 0,
            ano: "$_id.ano",
            type: "$_id.type",
            qtd: 1,
          },
        },
        {
          $sort: {
            type: 1,
            ano: -1
          }
        },
      ])
  },

  Production: {
    members: ({ members }) => Member.find({ _id: { $in: members } }),
  },
};

export default resolvers;
