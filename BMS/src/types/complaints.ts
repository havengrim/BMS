export type FileWithPreview = File & {
  preview?: string;
};

export interface FormData {
  fullname: string;
  contact_number: string;
  email_address: string;
  address: string;
  type: string;
  subject: string;
  detailed_description: string;
  respondent_name: string;
  respondent_address: string;
  request_mediation: boolean;
  agree_to_terms: boolean;
}

export interface FormDataType {
  fullname: string;
  contact_number: string;
  email_address: string;
  address: string;
  type: string;
  subject: string;
  detailed_description: string;
  respondent_name: string;
  respondent_address: string;
  request_mediation: boolean;
  agree_to_terms: boolean;
}