import User from './user';

export type Message = {
  id: string;
  userId: string;
  message: string;
  timestamp: Date;
  user?: User | null;
  usernameTmdb?: string;
  photoTmdb?: string;
};
