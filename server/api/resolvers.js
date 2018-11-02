import mongoose from 'mongoose';

import Member from './models/Member';
import Production from './models/Production';
import Supervision from './models/Supervision';
import Collaboration from './models/Collaboration';

const { ObjectId } = mongoose.Types;

const collections = new Map([
  [
    'BIBLIOGRAPHIC',
    { coll: Production, typeField: '$type' },
  ],
  [
    'SUPERVISION',
    { coll: Supervision, typeField: '$degreeType' },
  ],
]);

function toObjectIds(arr) {
  return arr ? arr.map(ObjectId) : arr;
}

function match(field, value) {
  if (value) {
    const arr = value instanceof Array ? value : [value];

    if (arr.length > 0) {
      return {
        [field]: (arr.length > 1) ? { $in: arr } : arr[0],
      };
    }
  }

  return {};
}

const resolvers = {
  Query: {
    member: (obj, { _id }) => Member.findById(_id),

    members: () => Member.find(),

    production: (obj, { _id }) => Production.findById(_id),

    productions: () => Production.find(),

    supervision: (obj, { _id }) => Supervision.findById(_id),

    supervisions: () => Supervision.find(),

    indicator: async (obj, { collection, members, campus }) => {
      const { coll, typeField } = collections.get(collection);

      const ids = campus
        ? await Member
          .distinct('_id', { ...match('_id', toObjectIds(members)), campus })
        : toObjectIds(members);

      return coll.aggregate([
        {
          $match: match('members', ids),
        },
        {
          $group: {
            _id: { year: '$year', type: typeField },
            count: { $sum: 1 },
          },
        },
        {
          $project: {
            _id: 0,
            year: '$_id.year',
            type: '$_id.type',
            count: 1,
          },
        },
        {
          $sort: {
            type: -1,
            year: -1,
          },
        },
      ]);
    },

    typeIndicator: (obj, { collection, members }) => {
      const { coll, typeField } = collections.get(collection);

      return coll.aggregate([
        {
          $match: match('members', toObjectIds(members)),
        },
        {
          $group: {
            _id: typeField,
            count: { $sum: 1 },
          },
        },
        {
          $project: {
            type: '$_id',
            _id: 0,
            count: 1,
          },
        },
      ]);
    },

    memberIndicator: () =>
      Production.aggregate([
        {
          $unwind: '$members',
        },
        {
          $group: {
            _id: '$members',
            count: { $sum: 1 },
          },
        },
        {
          $lookup: {
            from: 'members',
            localField: '_id',
            foreignField: '_id',
            as: 'members_data',
          },
        },
        {
          $project: {
            _id: 0,
            member: { $arrayElemAt: ['$members_data.fullName', 0] },
            count: 1,
          },
        },
      ]),

    nodes: (obj, { members }) =>
      Member.aggregate([
        {
          $match: match('_id', toObjectIds(members)),
        },
      ]),

    edges: (obj, { members }) =>
      Collaboration.aggregate([
        {
          $match: match('members', toObjectIds(members)),
        },
        {
          $project: {
            _id: 0,
            source: { $arrayElemAt: ['$members', 0] },
            target: { $arrayElemAt: ['$members', 1] },
            weight: { $size: '$productions' },
            productions: 1,
          },
        },
      ]),
  },

  Production: {
    members: ({ members }) => Member.find({ _id: { $in: members } }),
  },

  Supervision: {
    members: ({ members }) => Member.find({ _id: { $in: members } }),
  },

  Edge: {
    productions: ({ productions }) => Production.find({ _id: { $in: productions } }),
  },
};

export default resolvers;
