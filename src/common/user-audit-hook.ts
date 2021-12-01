// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
import { Hook, HookContext } from '@feathersjs/feathers';
import { GeneralError } from '@feathersjs/errors';

// default type definition
const defaultCreatedColumn = 'createdBy';
const defaultUpdatedColumn = 'updatedBy';
const defaultDeletedColumn = 'deletedBy';
const defaultUserProperty = 'email';

/**
 * UserAuditHookOptions
 * Available options `createdColumn`, `updatedColumn`, `deletedColumn`, `userProperty`
 */
export interface UserAuditHookOptions {
  /**
   * Define to `createdColumn` for select which column will be filled when insert, by default using `createdBy`
   */
  createdColumn?: string;
  /**
   * Define to `updatedColumn` for select which column will be filled when update/patch, by default using `updatedBy`
   */
  updatedColumn?: string;
  /**
   * Define to `deletedColumn` for select which column will be filled when delete operation, only happened when use softDelete, by default using `deletedBy`
   */
  deletedColumn?: string;
  /**
   * Define to `userProperty` for select which column from user entity that will be filled to the audit columns, by default using `email`
   */
  userProperty?: string;
}

/**
 * UserAuditHook
 * Input options {@link UserAuditHookOptions}
 * @param {UserAuditHookOptions} options
 * @returns {Hook} UserAuditHook
 */
export default ({
  createdColumn = defaultCreatedColumn,
  updatedColumn = defaultUpdatedColumn,
  deletedColumn = defaultDeletedColumn,
  userProperty = defaultUserProperty,
}: UserAuditHookOptions = {}): Hook => {
  return async (context: HookContext) => {
    const { app, data, method, service, type, params } = context;
    const { disableSoftDelete } = params;

    if (app.version < '4.0.0') {
      throw new GeneralError(
        'The userAuditHook hook requires Feathers 4.0.0 or later',
      );
    }

    if (type === 'after') {
      // only valid use in before hooks
      return context;
    }
    if (
      method !== 'create' &&
      method !== 'update' &&
      method !== 'patch' &&
      method !== 'remove'
    ) {
      return context;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
