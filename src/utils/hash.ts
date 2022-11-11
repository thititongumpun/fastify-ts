import crypto from "crypto";
import * as bcrypt from "bcrypt";

export const hashPassword = (password: string) => {
  const salt = bcrypt.genSaltSync(10);
  const hashPassword = bcrypt.hashSync(password, salt);

  return hashPassword;
};

export const verifyPassword = (
  password: string,
  existsPassword: string
): boolean => {
  return bcrypt.compareSync(password, existsPassword);
};
