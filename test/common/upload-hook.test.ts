import { BadRequest } from '@feathersjs/errors';
import feathers, { Application } from '@feathersjs/feathers';
import uploadHook from '../../src/common/upload-hook';

describe("'user-audit' hook", () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let app: Application<any>;

  beforeAll(() => {
    // Create a new plain Feathers application
    app = feathers();

    // Register a dummy custom service that just return the
    // message data back
    app.use('/uploads', {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      async create(data: any) {
        return data;
      },
    });

    // Register the `processMessage` hook on that service
    app.service('uploads').hooks({
      after: {
        create: uploadHook(),
      },
    });
  });

  it('upload failed because not have any file', async () => {
    const params = {
      file: null,
    };
    await expect(app.service('uploads').create({}, params)).rejects.toThrow(
      BadRequest,
    );
  });

  it('upload failed because wrong filename', async () => {
    const params = {
      file: {
        originalname: 'randomname',
      },
    };
    await expect(app.service('uploads').create({}, params)).rejects.toThrow(
      BadRequest,
    );
  });
});
