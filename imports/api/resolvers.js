import Member from './models/Member';
import Production from './models/Production';
import CoAuthorship from './models/CoAuthorship';

const resolvers = {
  Query: {
    hello: () => "Hello, World!",

    member: (root, { _id }) => Member.findById(_id),

    members: () => Member.find(),

    production: (root, { _id }) => Production.findById(_id),

    productions: () => Production.find(),

    coauthorships: () => CoAuthorship.find(),

    indicator: () =>
      Production.aggregate([
        {
          $group: {
            _id: { year: "$year", type: "$type" },
            count: { $sum: 1 },
          }
        },
        {
          $project: {
            _id: 0,
            year: "$_id.year",
            type: "$_id.type",
            count: 1,
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
