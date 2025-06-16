import { Child } from "./child";

export interface Parent {
  id: number;
  username: string;
  password: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  isActive: boolean;
  country: string;
  createdAt: Date;
  updatedAt: Date;
  children: Child[];
}
