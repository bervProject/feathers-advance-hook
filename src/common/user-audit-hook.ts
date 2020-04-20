// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
import { Hook, HookContext } from '@feathersjs/feathers';

export default (): Hook => {
  return async (context: HookContext) => {
    const { data, method, type, params } = context;
    if (type === 'after') {
      // only valid use in before hooks
      return context;
    }
    if (method !== 'create' && method !== 'update' && method !== 'patch') {
      return context;
    }
    const result: any = {};
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
    }
    context.data = Object.assign(data, result);
    return context;
  };
};
