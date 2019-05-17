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

function productionsResolver(collection) {
  const { coll, typeField } = collections.get(collection);

  return async (obj, {
    year, member, types, members, campus,
  }) => {
    let memberNameMatch = {};
    let lookup = [];

    if (member) {
      memberNameMatch = {
        members_data: {
          $elemMatch: {
            fullName: member,
          },
        },
      };

      lookup = [{
        $lookup: {
          from: 'members',
          localField: 'members',
          foreignField: '_id',
          as: 'members_data',
        },
      }];
    }

    const ids = campus
      ? await Member.distinct('_id', { ...match('_id', toObjectIds(members)), campus })
      : toObjectIds(members);

    return coll.aggregate([
      ...lookup,
      {
        $match: {
          ...match('year', year),
          ...match(typeField.substr(1), types),
          ...memberNameMatch,
          ...match('members', ids),
        },
      },
    ]);
  };
}

const productionIndicator = {
  year({ coll, ids, typeField }) {
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
  member({
    coll, ids = [], typeField, limit = 30,
  }) {
    if (ids.length > 0 && ids.length <= limit) {
      // For a small set of members
      coll.aggregate([
        {
          $unwind: '$members',
        },
        {
          $match: match('members', ids),
        },
        {
          $group: {
            _id: { member: '$members', type: typeField },
            count: { $sum: 1 },
          },
        },
        {
          $sort: {
            '_id.type': -1,
          },
        },
        {
          $lookup: {
            from: 'members',
            localField: '_id.member',
            foreignField: '_id',
            as: 'members_data',
          },
        },
        {
          $project: {
            _id: 0,
            member: { $arrayElemAt: ['$members_data.fullName', 0] },
            type: '$_id.type',
            count: 1,
          },
        },
      ]);
    }

    // Too many members. Generate indicator for the top <limit> members.
    return coll.aggregate([
      {
        $unwind: '$members',
      },
      {
        $match: match('members', ids),
      },
      {
        $group: {
          _id: { member: '$members', type: typeField },
          count: { $sum: 1 },
        },
      },
      {
        $sort: {
          '_id.type': -1,
        },
      },
      {
        $group: {
          _id: '$_id.member',
          individual: { $push: { type: '$_id.type', count: '$count' } },
          total: { $sum: '$count' },
        },
      },
      {
        $sort: {
          total: -1,
        },
      },
      {
        $limit: limit,
      },
      {
        $unwind: '$individual',
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
          type: '$individual.type',
          count: '$individual.count',
        },
      },
    ]);
  },
};

const resolvers = {
  Query: {
    member: (obj, { _id }) => Member.findById(_id),

    members: (obj, { members, lattesIds }) => {
      // Try to query with Lattes ID if there is at least one
      if (lattesIds && lattesIds.length) {
        return Member.find(match('lattesId', lattesIds));
      }

      // Otherwise, query with ObjectIds or retrieve all members
      return Member.find(match('_id', toObjectIds(members)));
    },

    production: (obj, { _id }) => Production.findById(_id),

    productions: productionsResolver('BIBLIOGRAPHIC'),

    supervision: (obj, { _id }) => Supervision.findById(_id),

    supervisions: productionsResolver('SUPERVISION'),

    indicator: async (obj, {
      collection, by, members, campus,
    }) =>
      productionIndicator[by]({
        ids: campus
          ? await Member.distinct('_id', { ...match('_id', toObjectIds(members)), campus })
          : toObjectIds(members),
        ...collections.get(collection),
      }),

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
