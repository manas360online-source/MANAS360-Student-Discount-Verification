
export type EntityType = 'school' | 'college' | 'corporate' | 'healthcare' | 'government';

export interface UserProfile {
  id: string;
  employee_student_id: string;
  first_name: string;
  last_name: string;
  email: string;
  gender: string;
  // Updated property names to match mock data structure and CSV requirements
  department_grade?: string;
  designation_section?: string;
  phone_number?: string;
  status: 'inactive' | 'active' | 'locked' | 'suspended';
  institution_id: string;
}

export interface Entity {
  id: string;
  name: string;
  type: EntityType;
  subtype?: string;
  code: string;
  admin_name: string;
  admin_email: string;
  status: 'active' | 'pending' | 'suspended';
}

export interface Counselor {
  id: string;
  name: string;
  specialty: string;
  assigned_members: number;
  max_capacity: number;
  status: 'online' | 'offline';
}

export interface AnalyticsData {
  participation: {
    total_enrolled: number;
    total_active: number;
    rate: number;
  };
  engagement: {
    assessments_completed: number;
    therapy_sessions: number;
    avg_sessions_per_member: number;
  };
  wellness: {
    avg_mood: number;
    avg_phq9: number;
    avg_gad7: number;
    interpretation: string;
  };
  top_concerns: Record<string, number>;
}

export interface VerificationResult {
  success: boolean;
  has_partnership: boolean;
  entity_name?: string;
  institution_name?: string;
  entity_type?: EntityType;
  discount_percentage?: number;
  discount_amount?: number;
  original_price?: number;
  final_price?: number;
  discount_valid_until?: string;
  message: string;
  price?: number;
  user?: UserProfile;
}

export enum AppStep {
  WELCOME,
  ADMIN_REGISTRATION,
  ADMIN_DASHBOARD,
  SCANNING,
  AUTH_FLOW,
  RESULT,
  CONFIRMED
}
