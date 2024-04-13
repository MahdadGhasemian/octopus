import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);

export class AuthCommon {
  static async createHash(data): Promise<string> {
    const salt = randomBytes(10).toString('hex');
    const hash = (await scrypt(data, salt, 32)) as Buffer;
    return salt + '.' + hash.toString('hex');
  }

  static async compareHash(
    hashed_data: string,
    data: string,
  ): Promise<boolean> {
    const [salt, storedHash] = hashed_data.split('.');

    const hash = (await scrypt(data, salt, 32)) as Buffer;

    return storedHash === hash.toString('hex');
  }
}
