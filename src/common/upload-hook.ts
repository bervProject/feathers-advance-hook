// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
import { Hook, HookContext } from '@feathersjs/feathers';
import { Storage } from '@google-cloud/storage';
import { extensions, lookup } from 'mime-types';
import { v4 as uuid } from 'uuid';

export default (): Hook => {
  return async (context: HookContext) => {
    const { app, method, type } = context;
    if (method === 'create' && type === 'after') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return new Promise<HookContext>((resolve: any, reject: any) => {
        const file = context.params.file;
        if (!file) {
          reject('File not found');
          return;
        }

        const fileTypes = lookup(file.originalname);

        if (!fileTypes) {
          reject('File extension not found');
          return;
        }

        const keyFileName = app.get('keyPath') || 'src/credentials/google.json';
        const storage = new Storage({
          keyFilename: keyFileName,
        });

        const bucket = storage.bucket(app.get('bucketName'));
        const blob = bucket.file(`${uuid()}.${extensions[fileTypes][0]}`);

        const stream = blob.createWriteStream({
          contentType: fileTypes,
          predefinedAcl: 'publicRead',
          resumable: true,
        });

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        stream.on('error', (err: any) => {
          reject(err);
        });

        stream.on('finish', () => {
          context.data.url = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
          resolve(context);
        });

        stream.end(file.buffer);
      });
    } else {
      return context;
    }
  };
};
