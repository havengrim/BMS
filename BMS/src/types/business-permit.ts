export type BusinessPermitStatus = "pending" | "approved" | "rejected" | "completed";

export type BusinessPermit = {
  id: number;
  business_name: string;
  business_type: string;
  owner_name: string;
  business_address: string;
  contact_number: string;
  owner_address: string;
  houseNum: number;
  business_description: string;
  is_renewal: boolean;
  status: BusinessPermitStatus;
  created_at: string;
  updated_at: string;
  user: number;
};

export type CreateBusinessPermitInput = {
  business_name: string;
  business_type: string;
  owner_name: string;
  business_address: string;
  contact_number: string;
  owner_address: string;
  business_description: string;
  is_renewal: boolean;
  houseNum: number;
  status: BusinessPermitStatus;
};

export type EditBusinessPermitInput = {
  id:number;
  business_name: string;
  business_type: string;
  owner_name: string;
  business_address: string;
  houseNum:number;
  contact_number: string;
  owner_address: string;
  business_description: string;
  is_renewal: boolean;
  status: BusinessPermitStatus;
};