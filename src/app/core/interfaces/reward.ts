import { Child } from "./child";

export interface Reward {
  id: number;
  name: string;
  description: string;
  price: number;
  children: Child[];
}
