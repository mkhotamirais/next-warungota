export type TUserRole = "superadmin" | "admin" | "editor" | "user";

export interface IUser {
  id: string;
  name: string | null;
  email: string | null;
  photoURL: string | null;
  role: TUserRole;
  createdAt?: Date;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  banner: string;
}

export interface IProduct {
  id: string;
  name: string;
  price: number;
}
