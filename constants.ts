
import { Entity, AnalyticsData, Counselor } from './types';

export const BASE_PRICE = 4500;

export const MOCK_ENTITIES: Entity[] = [
  {
    id: 'ENT-001',
    name: 'Delhi Public School, R.K. Puram',
    type: 'school',
    code: 'DPS-RKP-01',
    admin_name: 'Dr. Anita Karwal',
    admin_email: 'principal@dpsrkp.edu.in',
    status: 'active'
  },
  {
    id: 'ENT-002',
    name: 'IBM India Pvt Ltd',
    type: 'corporate',
    code: 'IBM-IND-BLR',
    admin_name: 'Priya Rao',
    admin_email: 'hr.wellbeing@ibm.com',
    status: 'active'
  }
];

export const MOCK_COUNSELORS: Counselor[] = [
  { id: 'C-01', name: 'Dr. Sameer Malhotra', specialty: 'Adolescent Psychology', assigned_members: 45, max_capacity: 50, status: 'online' },
  { id: 'C-02', name: 'Ms. Shalini Garg', specialty: 'Trauma & CBT', assigned_members: 12, max_capacity: 50, status: 'online' },
  { id: 'C-03', name: 'Dr. Rohan Varma', specialty: 'Career Counseling', assigned_members: 30, max_capacity: 40, status: 'offline' }
];

export const MOCK_PARTNERSHIPS = MOCK_ENTITIES.map(e => ({
  institution_name: e.name,
  discount_percentage: 25,
  contract_end_date: '2026-12-31'
}));

export const MOCK_ANALYTICS: Record<string, AnalyticsData> = {
  'ENT-001': {
    participation: { total_enrolled: 1200, total_active: 840, rate: 70 },
    engagement: { assessments_completed: 750, therapy_sessions: 420, avg_sessions_per_member: 3.2 },
    wellness: { 
      avg_mood: 6.8, 
      avg_phq9: 8.2, 
      avg_gad7: 7.5, 
      interpretation: "Moderate exam-related stress noted. Wellness workshops recommended." 
    },
    top_concerns: { "Academic Pressure": 65, "Anxiety": 45, "Sleep Issues": 30 }
  },
  'ENT-002': {
    participation: { total_enrolled: 5000, total_active: 2100, rate: 42 },
    engagement: { assessments_completed: 1800, therapy_sessions: 950, avg_sessions_per_member: 2.1 },
    wellness: { 
      avg_mood: 6.2, 
      avg_phq9: 9.1, 
      avg_gad7: 8.5, 
      interpretation: "High work-life balance concerns. Corporate burnout risk detected." 
    },
    top_concerns: { "Work Stress": 72, "Burnout": 45, "Depression": 25 }
  }
};

export const encodeQR = (data: any): string => btoa(JSON.stringify(data));
export const decodeQR = (base64: string): any => {
  try { return JSON.parse(atob(base64)); } catch (e) { return null; }
};

export const SAMPLE_QR_SCHOOL = encodeQR({ entity_id: 'ENT-001', member_id: 'STU-123' });
export const SAMPLE_QR_CORP = encodeQR({ entity_id: 'ENT-002', member_id: 'EMP-456' });
export const SAMPLE_VALID_QR = SAMPLE_QR_SCHOOL;
export const SAMPLE_INVALID_QR = "invalid_payload_data";
