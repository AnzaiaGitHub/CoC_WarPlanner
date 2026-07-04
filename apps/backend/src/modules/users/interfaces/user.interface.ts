export interface User {
  createdAt: Date;
  id: string;
  email: string;
  passwordHash: string;
  displayName?: string;
  activeAccount?: string; // Tag of the active account for the user
  claimedAccounts: string[]; // Array of account Tags owned by the user
}