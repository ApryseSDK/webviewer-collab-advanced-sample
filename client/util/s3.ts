import AWS from 'aws-sdk';
import { v4 } from 'uuid';

AWS.config.update({
  region: process.env.BUCKET_REGION,
  credentials: new AWS.CognitoIdentityCredentials({
    IdentityPoolId: process.env.IDENTITY_POOL_ID,
  }),
});

const s3 = new AWS.S3({
  apiVersion: '2006-03-01',
  params: { Bucket: process.env.BUCKET_NAME },
});

export const downloadFile = async (id: string): Promise<{ blob: Blob; name: string }> => {
  const key = `${id}`;

  return new Promise((resolve, reject) => {
    s3.getObject(
      {
        Bucket: process.env.BUCKET_NAME,
        Key: key,
      },
      async (err, data) => {
        if (err) {
          return reject(err);
        }

        const params = {
          Bucket: process.env.BUCKET_NAME,
          Key: key,
        };
        const metaData = await s3.headObject(params).promise();

        resolve({
          blob: data.Body as Blob,
          name: metaData.Metadata.name,
        });
      }
    );
  });
};

export const uploadFile = async (blob: Blob, name: string) => {
  const id = v4();
  const key = `${id}`;

  return new Promise((resolve, reject) => {
    s3.upload(
      {
        Bucket: process.env.BUCKET_NAME,
        Key: key,
        Body: blob,
        ContentType: 'application/pdf',
        ACL: 'public-read',
        Metadata: {
          name,
        },
      },
      (err, data) => {
        if (err) {
          return reject(err);
        }
        resolve({
          path: data.Location,
          id,
        });
      }
    );
  });
};
