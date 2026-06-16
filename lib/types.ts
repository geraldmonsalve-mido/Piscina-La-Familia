export type ReservationStatus =
  | "pending"
  | "confirmed"
  | "cancelled"
  | "completed"
  | "no_show";

export type QuoteStatus =
  | "pending"
  | "reviewing"
  | "quoted"
  | "accepted"
  | "rejected";

export type UserRole = "client" | "admin" | "staff";

export interface Location {
  id: string;
  name: string;
  address: string;
  phone: string | null;
  capacity_max: number;
  description: string | null;
  amenities: string[] | null;
  images: string[] | null;
  is_active: boolean;
  created_at: string;
}

export interface ReservationType {
  id: string;
  name: string;
  description: string | null;
  price_base: number;
  duration_hours: number;
  requires_quote: boolean;
  is_active: boolean;
  sort_order: number;
  created_at: string;
}

export interface TimeBlock {
  id: string;
  location_id: string;
  day_of_week: number[];
  start_time: string;
  end_time: string;
  price: number;
  capacity: number | null;
  is_active: boolean;
  created_at: string;
}

export interface Profile {
  id: string;
  full_name: string | null;
  phone: string | null;
  dni: string | null;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface Reservation {
  id: string;
  profile_id: string | null;
  location_id: string;
  reservation_type_id: string;
  time_block_id: string;
  reservation_date: string;
  num_adults: number;
  num_children: number;
  total_price: number;
  status: ReservationStatus;
  notes: string | null;
  qr_code: string | null;
  checked_in_at: string | null;
  cancelled_at: string | null;
  cancellation_reason: string | null;
  created_at: string;
  updated_at: string;
  // Joins
  location?: Location;
  reservation_type?: ReservationType;
  time_block?: TimeBlock;
  profile?: Profile;
}

export interface QuoteRequest {
  id: string;
  profile_id: string | null;
  location_id: string;
  reservation_type_id: string;
  name: string;
  email: string;
  phone: string;
  event_date: string | null;
  num_guests: number | null;
  event_details: string | null;
  status: QuoteStatus;
  quoted_price: number | null;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
  // Joins
  location?: Location;
  reservation_type?: ReservationType;
}

export interface BlockedDate {
  id: string;
  location_id: string | null;
  blocked_date: string;
  reason: string | null;
  created_at: string;
}

// Form types
export interface ReservationFormData {
  location_id: string;
  reservation_type_id: string;
  time_block_id: string;
  reservation_date: string;
  num_adults: number;
  num_children: number;
  notes?: string;
}

export interface QuoteFormData {
  location_id: string;
  reservation_type_id: string;
  name: string;
  email: string;
  phone: string;
  event_date?: string;
  num_guests?: number;
  event_details?: string;
}

// Stats for admin dashboard
export interface DashboardStats {
  total_reservations: number;
  confirmed_reservations: number;
  pending_reservations: number;
  total_revenue: number;
  occupancy_rate: number;
  reservations_this_week: number;
  pending_quotes: number;
}
