
import { pbkdf2Sync, randomBytes } from 'crypto';

export function savePassword(password: string) {
  const salt = randomBytes(16).toString('hex');
  const hash = pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  const passwordData = {
    salt: salt,
    hash: hash
  };
return passwordData;
}
