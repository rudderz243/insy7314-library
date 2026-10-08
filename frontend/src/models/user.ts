// set the enum for what a users role can be
export type UserRole = "patron" | "librarian";

export interface User {
  _id: string;
  username: string;
  email: string;
  role: UserRole;
}

// when authenticating, a token becomes part of the reponse, so we extend
// our main user class to incorporate a token
export interface AuthResponse extends User {
  token: string;
}

// DTO -> encapsulates what data we will use for logging in
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  username: string;
  email: string;
  password: string;
  role?: UserRole;
}
