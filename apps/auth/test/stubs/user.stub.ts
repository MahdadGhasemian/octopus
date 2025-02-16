import { User } from '../../src/libs';

export const userStub = (): User => {
  return {
    id: 1,
    email: 'test@example.com',
    full_name: 'John Doe',
    hashed_password: 'hashedpassword123',
    accesses: [],
  };
};
