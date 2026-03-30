export interface Specialty {
  id: string;
  label: string;
  value: string;
}

export interface Trainer {
  id: string;
  full_name: string;
  bio: string;
  avatar_url: string;
  specialty_id: string;
  specialty?: Specialty;
  rating: number;
  experience_years: number;
  color: string;
  certifications?: string[];
  phone?: string;
  email?: string;
  is_active?: boolean;
}

export interface Timeslot {
  id: string;
  trainer_id: string;
  date: string; // YYYY-MM-DD
  start_time: string; // HH:mm
  end_time: string; // HH:mm
  is_booked: boolean;
}

export interface Appointment {
  id: string;
  user_id: string;
  user_name: string;
  trainer_id: string;
  trainer_name: string;
  start_time: string;
  end_time: string;
  status: "scheduled" | "completed" | "cancelled";
  created_at: string;
  timeslot_id?: string;
  notes?: string;
  price?: number;
  paid?: boolean;
  trainer?: Trainer;
}

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: "user" | "trainer" | "admin";
  avatar_url?: string;
  phone?: string;
  joined_at?: string;
}

export type RepeatType = "none" | "daily" | "every_other" | "weekly";
