export interface IUser {
  id: string;
  name: string | null;
  email: string | null;
  photoURL: string | null;
  role: "admin" | "editor" | "user";
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
