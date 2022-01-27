import { User } from '@pdftron/collab-client';
import { uploadFile } from './s3';

export default async function createSampleDoc(user: User) {
  const blob = await fetch(`${process.env.AUTH_URL}/static/sample.pdf`).then((r) => r.blob());
  const { id } = await uploadFile(blob, 'sample-doc.pdf');
  return await user.createDocument({
    document: blob,
    id,
    name: 'sample-doc.pdf',
  });
}
