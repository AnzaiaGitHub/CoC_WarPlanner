export interface User {
  id: string;
  email: string;
  displayName?: string;
  passwordHash: string;
  createdAt: Date;
  ownedAccounts: string[]; // Array of account Tags owned by the user
}