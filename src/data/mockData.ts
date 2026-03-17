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

// Trainer color palette for visual distinction
export const trainerColors: Record<string, string> = {
  t1: "158 64% 32%", // emerald
  t2: "280 60% 50%", // purple
  t3: "210 80% 52%", // blue
  t4: "30 90% 55%", // orange
  t5: "340 65% 50%", // rose
  t6: "45 85% 40%", // amber
};

export const mockTrainers: Trainer[] = [
  {
    id: "t1",
    full_name: "Marcus Johnson",
    bio: "NASM certified personal trainer specializing in strength training and body transformation. 8+ years helping clients achieve their goals.",
    avatar_url: "",
    specialty_id: "s1", // placeholder
    rating: 4.9,
    experience_years: 8,
    color: trainerColors.t1,
    certifications: ["NASM-CPT", "CSCS", "TRX Certified"],
    phone: "+1 555-0101",
    email: "marcus@fitpath.com",
  },
  {
    id: "t2",
    full_name: "Sofia Martinez",
    bio: "Yoga and pilates instructor with a holistic approach to fitness. Focused on flexibility, mindfulness, and functional movement.",
    avatar_url: "",
    specialty_id: "s2", // placeholder
    rating: 4.8,
    experience_years: 6,
    color: trainerColors.t2,
    certifications: ["RYT-500", "Pilates Certified", "Meditation Coach"],
    phone: "+1 555-0102",
    email: "sofia@fitpath.com",
  },
];

export const mockTimeslots: Timeslot[] = [
  {
    id: "ts1",
    trainer_id: "t1",
    date: "2026-03-04",
    start_time: "09:00",
    end_time: "10:00",
    is_booked: true,
  },
];

export const mockAppointments: Appointment[] = [
  {
    id: "a1",
    user_id: "u1",
    user_name: "Alex Turner",
    trainer_id: "t1",
    trainer_name: "Marcus Johnson",
    start_time: "2026-03-04T09:00:00Z",
    end_time: "2026-03-04T10:00:00Z",
    status: "scheduled",
    created_at: "2026-03-01T12:00:00Z",
    timeslot_id: "ts1",
    price: 75,
    paid: true,
  },
];

export const mockUsers: User[] = [
  {
    id: "u1",
    email: "alex@fitpath.com",
    full_name: "Alex Turner",
    role: "user",
    phone: "+1 555-1001",
    joined_at: "2025-12-15T00:00:00Z",
  },
];
