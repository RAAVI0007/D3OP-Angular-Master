export class User {
  id: number;
  username: String;
  email: String;
  password: String;
  adminUsername: String;
  adminPassword: String;
  firstName: String;
  lastName: String;
  userPassword: String;
  newPassword: String;
  confirmPassword: String;
  role: Object = {
    id: Number,
    name: String
  };
  firstLogin: boolean;
  isDefaultAdmin: String;
  isCurrentDefaultAdmin: String;
  isActive: String;
  constructor(username?: string, password?: string) { }
}