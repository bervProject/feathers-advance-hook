import feathers, { NullableId, Params } from '@feathersjs/feathers';
import userAudit from '../../../src/common/user-audit-hook';

describe('\'user-audit\' hook', () => {
  let app;

  beforeEach(() => {
    // Create a new plain Feathers application
    app = feathers();

    // Register a dummy custom service that just return the
    // message data back
    app.use('/messages', {
      messages: [],
      incrementNode: 0,
      async create(data: any) {
        data.id = this.incrementNode;
        this.messages.push(data);
        this.incrementNode += 1;
        return data;
      },
      async get(id: NullableId) {
        return this.messages[id];
      },
      async update(id: NullableId, data: any) {
        const findingdata = this.messages[id];
        const result = Object.assign(findingdata, data);
        this.messages[id] = result;
        return result;
      },
      async remove(id: NullableId, params: Params) {
        const findingdata = this.messages[id];
        this.messages.splice(id, 1);
        return findingdata;
      }
    });

    app.use('/notaffected', {
      async create(data: any) {
        return data;
      },
      async update(id: NullableId, data: any) {
        return data;
      }
    });

    // Register the `processMessage` hook on that service
    app.service('messages').hooks({
      before: {
        get: userAudit(),
        create: userAudit(),
        update: userAudit()
      }
    });

    app.service('notaffected').hooks({
      after: {
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
    expect(message.createdBy).toEqual('test@test.com');

    // assume id one
    const updatedMessage = await app.service('messages').update(0, {
      text: message.text
    }, params);
    expect(updatedMessage.updatedBy).toEqual('test@test.com');

    const afterHook = await app.service('messages').get(0);
    expect(afterHook.createdBy).toEqual('test@test.com');
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

  it('will not affected for after hook', async () => {
    // A user stub with just an `_id`
    const user = { email: 'test@test.com' };
    // The service method call `params`
    const params = { user };

    const afterHook = await app.service('notaffected').create({
      text: 'Hellow'
    }, params);

    expect(afterHook.createdBy).toEqual(undefined);
  });
});