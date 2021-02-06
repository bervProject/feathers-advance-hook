import { uploadHook, userAuditHook } from '../src/index';

describe('Test hook definition', () => {
  it('have these modules', () => {
    expect(typeof uploadHook).toEqual('function');
    expect(typeof userAuditHook).toEqual('function');
  });
});
