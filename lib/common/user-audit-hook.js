// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

// eslint-disable-next-line no-unused-vars
module.exports = function (options = {}) {
  return async context => {
    const { data, method, type, params } = context;
    if (type === 'after') {
      // only valid use in before hooks
      return context;
    }
    if (method !== 'create' && method !== 'update' && method !== 'remove') {
      return context;
    }
    if (!data) {
      data = {}
    }
    const result = {};
    const paramUser = 'email';
    const user = params.user;
    let userModifier = 'SYSTEM';
    if (user && user[paramUser]) {
      userModifier = user[paramUser];
    }
    if (method === 'create') {
      const paramColumn = 'createdBy';
      result[paramColumn] = userModifier;
    } else if (method === 'update' || method === 'patch') {
      const paramColumn = 'updatedBy';
      result[paramColumn] = userModifier;
    } else if (method === 'remove') {
      const paramColumn = 'deletedBy';
      result[paramColumn] = userModifier;
    }
    context.data = Object.assign(data, result);
    return context;
  };
};