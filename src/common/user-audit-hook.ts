// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
import { Hook, HookContext } from '@feathersjs/feathers';
const defaultCreatedColumn = 'createdBy';
const defaultUpdatedColumn = 'updatedBy';
const defaultDeletedColumn = 'deletedBy';
const defaultUserProperty = 'email';

export default ({
  createdColumn = defaultCreatedColumn,
  updatedColumn = defaultUpdatedColumn,
  deletedColumn = defaultDeletedColumn,
  userProperty = defaultUserProperty
} = {}): Hook => {
  return async (context: HookContext) => {
    const { data, method, service, type, params } = context;
    const { disableSoftDelete } = params;
    if (type === 'after') {
      // only valid use in before hooks
      return context;
    }
    if (method !== 'create' && method !== 'update' && method !== 'patch' && method !== 'remove') {
      return context;
    }
    const result: any = {};
    const paramUser = userProperty;
    const user = params.user;
    let userModifier = 'SYSTEM';
    if (user && user[paramUser]) {
      userModifier = user[paramUser];
    }
    if (method === 'create') {
      const paramColumn = createdColumn;
      result[paramColumn] = userModifier;
    } else if (method === 'update' || method === 'patch') {
      const paramColumn = updatedColumn;
      result[paramColumn] = userModifier;
    } else if (method === 'remove' && !disableSoftDelete) {
      const paramColumn = deletedColumn;
      result[paramColumn] = userModifier;
      const updatedData = Object.assign(data, result);
      const id = context.id || null;
      await service.patch(id, updatedData, params);
    }
    context.data = Object.assign(data, result);
    return context;
  };
};
