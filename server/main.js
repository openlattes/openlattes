import { createApolloServer } from 'meteor/apollo';

import schema from '../imports/api/schema';

createApolloServer({ schema });
