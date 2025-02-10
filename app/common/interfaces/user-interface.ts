import { Role } from '../enums/role.enum';

export interface User {
  email: string;
  sub: string;
  role: Role;
}
