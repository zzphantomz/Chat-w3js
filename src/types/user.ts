export interface User {
  id: string;
  avatar: string | null;
  email: string;
  username: string;
  firstname: string | null;
  lastname: string | null;
  title: string | null;
  bio: string | null;
  phone: string | null;
  gender: 'Male' | 'Female';
  birthday: string | null;
}
