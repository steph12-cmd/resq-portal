import * as admin from 'firebase-admin';

if (!admin.apps?.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      // TypeScript types for firebase-admin may not expose `credential` in some versions;
      // cast to any to access at runtime.
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      // Vercel stores \n as literal \n — this converts it back to real newlines
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

export default admin;

export function getAuth() {
  return admin.auth();
}

export function auth() {
  return admin.auth();
}
