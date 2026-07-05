export interface AuthenticatedUser {
  id: string;
  email: string;
  displayName: string | null;
  activeAccount: string | null;
}