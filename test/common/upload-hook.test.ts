import { BadRequest, GeneralError } from '@feathersjs/errors';
import { feathers } from '@feathersjs/feathers';
import uploadHook from '../../src/common/upload-hook';

describe("'user-audit' hook", () => {
  let app;

  beforeAll(() => {
    // Create a new plain Feathers application
    app = feathers();

    // Register a dummy custom service that just return the
    // message data back
    app.use('uploads', {
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

  it('upload failed because google cloud not setup bucketname', async () => {
    const params = {
      file: {
        originalname: 'randomname.txt',
      },
    };
    await expect(app.service('uploads').create({}, params)).rejects.toThrow(
      Error,
    );
  });

  it('upload failed because google cloud wrong credential', async () => {
    app.set('bucketName', 'test');
    const params = {
      file: {
        originalname: 'randomname.txt',
      },
    };
    await expect(app.service('uploads').create({}, params)).rejects.toThrow(
      GeneralError,
    );
  });
});
