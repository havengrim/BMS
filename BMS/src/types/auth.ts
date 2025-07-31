// src/types/auth.ts
export type UserProfile = {
  name: string;
  contact_number: string;
  address: string;
  civil_status: string;
  birthdate: string;
  role: string;
  image: string | null;
};

export type User = {
  id: number;
  username: string;
  email: string;
  profile: UserProfile;
};
