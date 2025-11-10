import { TokenDataInterface } from '@/modules/auth/interface/auth.interface';
import User from '@/sequelizeDir/models/user.model';
import { Transaction } from 'sequelize';

// Sequelize instance type
type UserInstance = InstanceType<typeof User>;

declare global {
  namespace Express {
    interface User extends UserInstance {}
    interface Request {
      currentUser: User;
      transaction?: Transaction;
      tokenData: TokenDataInterface;
    }
  }
}

// export {};
