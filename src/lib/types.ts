export type UserRole = 'brand' | 'club';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  created_at: string;
}

export interface Brand {
  id: string;
  user_id: string;
  name: string;
  description: string;
  website: string;
  logo_url: string;
}

export interface RunClub {
  id: string;
  user_id: string;
  name: string;
  description: string;
  location: string;
  member_count: number;
  website: string;
  logo_url: string;
}

export interface Opportunity {
  id: string;
  brand_id: string;
  title: string;
  description: string;
  budget_range: string;
  event_date: string;
  location: string;
  requirements: string;
  status: 'open' | 'closed';
  created_at: string;
}

export interface Application {
  id: string;
  opportunity_id: string;
  club_id: string;
  status: 'pending' | 'accepted' | 'rejected';
  proposal: string;
  created_at: string;
}