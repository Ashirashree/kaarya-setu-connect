export interface Job {
  id: string;
  title: string;
  category: string;
  description: string;
  location: string;
  date: string;
  time: string;
  pay: string;
  employer?: string;
  employer_id?: string;
  urgent?: boolean;
  lat?: number;
  lng?: number;
  distance?: number | null;
  status?: string;
  created_at?: string;
  updated_at?: string;
}