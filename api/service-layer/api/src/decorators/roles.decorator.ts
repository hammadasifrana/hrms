import { SetMetadata } from '@nestjs/common';

// Define a constant for the metadata key
export const ROLES_KEY = 'roles';

// Create a decorator function for setting roles
export const Roles = (...roles: string[]) => 
  SetMetadata(ROLES_KEY, roles);