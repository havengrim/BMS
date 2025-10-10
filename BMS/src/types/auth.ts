export type UserProfile = {
  name: string;
  contact_number: string;
  address: string;
  civil_status: string;
  birthdate: string;
  role: string;         // role inside profile — keep this
  image: string | null;
};

export type User = {
  id: number;
  username: string;
  email: string;
  profile: UserProfile;
  // Remove this line:
  // role: string;
};
