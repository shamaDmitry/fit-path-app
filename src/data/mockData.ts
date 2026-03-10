export interface Trainer {
  id: string;
  full_name: string;
  bio: string;
  avatar_url: string;
  specialty: string;
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
    specialty: "Strength Training",
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
    specialty: "Yoga & Pilates",
    rating: 4.8,
    experience_years: 6,
    color: trainerColors.t2,
    certifications: ["RYT-500", "Pilates Certified", "Meditation Coach"],
    phone: "+1 555-0102",
    email: "sofia@fitpath.com",
  },
  {
    id: "t3",
    full_name: "David Chen",
    bio: "Former competitive athlete turned coach. Specializing in HIIT, athletic performance, and sports-specific training.",
    avatar_url: "",
    specialty: "HIIT & Athletics",
    rating: 4.7,
    experience_years: 10,
    color: trainerColors.t3,
    certifications: ["ACE-CPT", "USAW Level 2", "First Aid"],
    phone: "+1 555-0103",
    email: "david@fitpath.com",
  },
  {
    id: "t4",
    full_name: "Aisha Williams",
    bio: "Nutrition-focused trainer combining workout programs with dietary guidance for sustainable results.",
    avatar_url: "",
    specialty: "Nutrition & Fitness",
    rating: 4.9,
    experience_years: 5,
    color: trainerColors.t4,
    certifications: ["ISSA-CPT", "Precision Nutrition L1", "FMS Certified"],
    phone: "+1 555-0104",
    email: "aisha@fitpath.com",
  },
  {
    id: "t5",
    full_name: "Ryan O'Brien",
    bio: "CrossFit Level 2 trainer passionate about functional fitness. Building strong foundations for everyday movement.",
    avatar_url: "",
    specialty: "CrossFit",
    rating: 4.6,
    experience_years: 7,
    color: trainerColors.t5,
    certifications: ["CrossFit L2", "Olympic Lifting", "Mobility WOD"],
    phone: "+1 555-0105",
    email: "ryan@fitpath.com",
  },
  {
    id: "t6",
    full_name: "Elena Petrova",
    bio: "Dance and cardio specialist making fitness fun. Classes include Zumba, dance cardio, and barre workouts.",
    avatar_url: "",
    specialty: "Dance & Cardio",
    rating: 4.8,
    experience_years: 9,
    color: trainerColors.t6,
    certifications: ["Zumba Licensed", "Barre Certified", "Group Fitness"],
    phone: "+1 555-0106",
    email: "elena@fitpath.com",
  },
];

export const mockTimeslots: Timeslot[] = [
  // Marcus Johnson
  {
    id: "ts1",
    trainer_id: "t1",
    date: "2026-03-04",
    start_time: "09:00",
    end_time: "10:00",
    is_booked: true,
  },
  {
    id: "ts2",
    trainer_id: "t1",
    date: "2026-03-04",
    start_time: "10:00",
    end_time: "11:00",
    is_booked: false,
  },
  {
    id: "ts3",
    trainer_id: "t1",
    date: "2026-03-04",
    start_time: "14:00",
    end_time: "15:00",
    is_booked: false,
  },
  {
    id: "ts4",
    trainer_id: "t1",
    date: "2026-03-05",
    start_time: "09:00",
    end_time: "10:00",
    is_booked: false,
  },
  {
    id: "ts5",
    trainer_id: "t1",
    date: "2026-03-05",
    start_time: "11:00",
    end_time: "12:00",
    is_booked: false,
  },
  {
    id: "ts6",
    trainer_id: "t1",
    date: "2026-03-06",
    start_time: "08:00",
    end_time: "09:00",
    is_booked: false,
  },
  {
    id: "ts7",
    trainer_id: "t1",
    date: "2026-03-06",
    start_time: "15:00",
    end_time: "16:00",
    is_booked: false,
  },
  // Sofia Martinez
  {
    id: "ts8",
    trainer_id: "t2",
    date: "2026-03-04",
    start_time: "08:00",
    end_time: "09:00",
    is_booked: false,
  },
  {
    id: "ts9",
    trainer_id: "t2",
    date: "2026-03-05",
    start_time: "14:00",
    end_time: "15:00",
    is_booked: true,
  },
  {
    id: "ts10",
    trainer_id: "t2",
    date: "2026-03-05",
    start_time: "16:00",
    end_time: "17:00",
    is_booked: false,
  },
  {
    id: "ts11",
    trainer_id: "t2",
    date: "2026-03-06",
    start_time: "10:00",
    end_time: "11:00",
    is_booked: false,
  },
  {
    id: "ts12",
    trainer_id: "t2",
    date: "2026-03-07",
    start_time: "13:00",
    end_time: "14:00",
    is_booked: true,
  },
  // David Chen
  {
    id: "ts13",
    trainer_id: "t3",
    date: "2026-03-04",
    start_time: "06:00",
    end_time: "07:00",
    is_booked: false,
  },
  {
    id: "ts14",
    trainer_id: "t3",
    date: "2026-03-04",
    start_time: "17:00",
    end_time: "18:00",
    is_booked: false,
  },
  {
    id: "ts15",
    trainer_id: "t3",
    date: "2026-03-05",
    start_time: "06:00",
    end_time: "07:00",
    is_booked: false,
  },
  {
    id: "ts16",
    trainer_id: "t3",
    date: "2026-03-06",
    start_time: "16:00",
    end_time: "17:00",
    is_booked: false,
  },
  // Aisha Williams
  {
    id: "ts17",
    trainer_id: "t4",
    date: "2026-03-04",
    start_time: "11:00",
    end_time: "12:00",
    is_booked: false,
  },
  {
    id: "ts18",
    trainer_id: "t4",
    date: "2026-03-05",
    start_time: "09:00",
    end_time: "10:00",
    is_booked: false,
  },
  {
    id: "ts19",
    trainer_id: "t4",
    date: "2026-03-06",
    start_time: "10:00",
    end_time: "11:00",
    is_booked: true,
  },
  {
    id: "ts20",
    trainer_id: "t4",
    date: "2026-03-07",
    start_time: "14:00",
    end_time: "15:00",
    is_booked: false,
  },
  // Ryan O'Brien
  {
    id: "ts21",
    trainer_id: "t5",
    date: "2026-03-04",
    start_time: "07:00",
    end_time: "08:00",
    is_booked: false,
  },
  {
    id: "ts22",
    trainer_id: "t5",
    date: "2026-03-05",
    start_time: "07:00",
    end_time: "08:00",
    is_booked: false,
  },
  {
    id: "ts23",
    trainer_id: "t5",
    date: "2026-03-06",
    start_time: "17:00",
    end_time: "18:00",
    is_booked: false,
  },
  // Elena Petrova
  {
    id: "ts24",
    trainer_id: "t6",
    date: "2026-03-04",
    start_time: "12:00",
    end_time: "13:00",
    is_booked: false,
  },
  {
    id: "ts25",
    trainer_id: "t6",
    date: "2026-03-05",
    start_time: "12:00",
    end_time: "13:00",
    is_booked: false,
  },
  {
    id: "ts26",
    trainer_id: "t6",
    date: "2026-03-06",
    start_time: "18:00",
    end_time: "19:00",
    is_booked: false,
  },
  {
    id: "ts27",
    trainer_id: "t6",
    date: "2026-03-07",
    start_time: "09:00",
    end_time: "10:00",
    is_booked: false,
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
  {
    id: "a2",
    user_id: "u1",
    user_name: "Alex Turner",
    trainer_id: "t2",
    trainer_name: "Sofia Martinez",
    start_time: "2026-03-05T14:00:00Z",
    end_time: "2026-03-05T15:00:00Z",
    status: "scheduled",
    created_at: "2026-03-01T13:00:00Z",
    timeslot_id: "ts9",
    price: 65,
    paid: false,
  },
  {
    id: "a3",
    user_id: "u2",
    user_name: "Jordan Lee",
    trainer_id: "t1",
    trainer_name: "Marcus Johnson",
    start_time: "2026-03-03T11:00:00Z",
    end_time: "2026-03-03T12:00:00Z",
    status: "completed",
    created_at: "2026-02-28T09:00:00Z",
    price: 75,
    paid: true,
  },
  {
    id: "a4",
    user_id: "u3",
    user_name: "Sam Parker",
    trainer_id: "t3",
    trainer_name: "David Chen",
    start_time: "2026-03-02T16:00:00Z",
    end_time: "2026-03-02T17:00:00Z",
    status: "cancelled",
    created_at: "2026-02-27T10:00:00Z",
    price: 80,
    paid: false,
  },
  {
    id: "a5",
    user_id: "u2",
    user_name: "Jordan Lee",
    trainer_id: "t4",
    trainer_name: "Aisha Williams",
    start_time: "2026-03-06T10:00:00Z",
    end_time: "2026-03-06T11:00:00Z",
    status: "scheduled",
    created_at: "2026-03-02T14:00:00Z",
    timeslot_id: "ts19",
    price: 70,
    paid: true,
  },
  {
    id: "a6",
    user_id: "u1",
    user_name: "Alex Turner",
    trainer_id: "t5",
    trainer_name: "Ryan O'Brien",
    start_time: "2026-03-01T08:00:00Z",
    end_time: "2026-03-01T09:00:00Z",
    status: "completed",
    created_at: "2026-02-26T11:00:00Z",
    price: 60,
    paid: true,
  },
  {
    id: "a7",
    user_id: "u3",
    user_name: "Sam Parker",
    trainer_id: "t2",
    trainer_name: "Sofia Martinez",
    start_time: "2026-03-07T13:00:00Z",
    end_time: "2026-03-07T14:00:00Z",
    status: "scheduled",
    created_at: "2026-03-03T08:00:00Z",
    timeslot_id: "ts12",
    price: 65,
    paid: false,
  },
  {
    id: "a8",
    user_id: "u2",
    user_name: "Jordan Lee",
    trainer_id: "t6",
    trainer_name: "Elena Petrova",
    start_time: "2026-02-28T15:00:00Z",
    end_time: "2026-02-28T16:00:00Z",
    status: "completed",
    created_at: "2026-02-25T09:00:00Z",
    price: 55,
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
  {
    id: "u2",
    email: "jordan@fitpath.com",
    full_name: "Jordan Lee",
    role: "user",
    phone: "+1 555-1002",
    joined_at: "2026-01-10T00:00:00Z",
  },
  {
    id: "u3",
    email: "sam@fitpath.com",
    full_name: "Sam Parker",
    role: "user",
    phone: "+1 555-1003",
    joined_at: "2026-02-01T00:00:00Z",
  },
  {
    id: "admin1",
    email: "admin@fitpath.com",
    full_name: "Admin User",
    role: "admin",
    joined_at: "2025-01-01T00:00:00Z",
  },
  {
    id: "t1",
    email: "marcus@fitpath.com",
    full_name: "Marcus Johnson",
    role: "trainer",
    joined_at: "2025-06-01T00:00:00Z",
  },
];
