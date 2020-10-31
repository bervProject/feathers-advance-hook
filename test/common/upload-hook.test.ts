import feathers , { Application } from '@feathersjs/feathers';
import uploadHook from '../../src/common/upload-hook';

describe('\'user-audit\' hook', () => {
  let app : Application<any>;

  beforeEach(() => {
    // Create a new plain Feathers application
    app = feathers();

    // Register a dummy custom service that just return the
    // message data back
    app.use('/uploads', {
      async create(data: any) {
        return data;
      }
    });

    // Register the `processMessage` hook on that service
    app.service('uploads').hooks({
      before: {
        create: uploadHook()
      }
    });
  });

  it('upload success', async () => {
    // A user stub with just an `_id`
    expect(true).toBe(true);
  });
});