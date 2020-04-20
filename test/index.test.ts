import hooks from '../src/index';

describe('Test hook definition', () => {
  it('have these modules', () => {
    expect(typeof hooks.uploadHook).toEqual('function');
    expect(typeof hooks.userAuditHook).toEqual('function');
  });
});