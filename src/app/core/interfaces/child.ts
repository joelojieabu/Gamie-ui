import { Parent } from './parent';
import { Reward } from './reward';

export interface Child {
  id: number;
  parentId: number;
  firstName: string;
  lastName: string;
  userName: string;
  dateOfBirth: Date;
  isActive: boolean;
  createdAt: Date;
  level: number;
  tokens: number;
  accountNumber: number;
  parent: Parent;
  rewards: Reward[];
}
