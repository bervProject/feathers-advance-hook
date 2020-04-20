import feathers from '@feathersjs/feathers';
import userAudit from '../../../src/common/user-audit-hook';

describe('\'user-audit\' hook', () => {
  let app;

  beforeEach(() => {
    // Create a new plain Feathers application
    app = feathers();

    // Register a dummy custom service that just return the
    // message data back
    app.use('/messages', {
      async create(data: any) {
        return data;
      }
    });

    // Register the `processMessage` hook on that service
    app.service('messages').hooks({
      before: {
        create: userAudit()
      }
    });
  });

  it('the user id included in message', async () => {
    // A user stub with just an `_id`
    const user = { email: 'test@test.com' };
    // The service method call `params`
    const params = { user };

    // Create a new message with params that contains our user
    const message = await app.service('messages').create({
      text: 'Hi there'
    }, params);

    expect(message.text).toEqual('Hi there');
    // `userId` was set
    expect(message.createdBy).toEqual('test@test.com');
  });

  it('without user in message', async () => {
    // Create a new message with params that contains our user
    const message = await app.service('messages').create({
      text: 'Hi there'
    });

    expect(message.text).toEqual('Hi there');
    // `userId` was set
    expect(message.createdBy).toEqual('SYSTEM');
  });
});