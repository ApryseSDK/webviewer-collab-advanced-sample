import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
const saltRounds = 10;

export const User = (data) => ({
  userName: data.userName || data.email,
  email: data.email,
  id: data.id,
  password: data.password,
});

export type UserAuth = {
  id: string;
};
/**
 * Uses bcrypt to get a password hash
 */
export const getHash = (plainTextPassword: string): Promise<string> => {
  return new Promise((resolve) =>
    bcrypt.hash(plainTextPassword, saltRounds, function (err, hash) {
      resolve(hash);
    })
  );
};

export const getUserFromToken = async (token: string): Promise<UserAuth> => {
  if (token) {
    return new Promise((resolve) => {
      jwt.verify(token, process.env.COLLAB_KEY, function (err, decoded) {
        resolve(decoded);
      });
    });
  }
  return null;
};
