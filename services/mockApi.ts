
// Removed GenderType as it is not exported from types.ts and unused in this file
import { VerificationResult, Entity, UserProfile } from '../types';
import { MOCK_ENTITIES, BASE_PRICE, decodeQR } from '../constants';

const securityStore = {
  otpAttempts: {} as Record<string, number>,
  loginAttempts: {} as Record<string, number>,
  lockouts: {} as Record<string, number>,
};

let MOCK_USERS: UserProfile[] = [
  // CORPORATE EMPLOYEES (TC-2024-001 to TC-2024-007)
  {
    id: 'u-corp-1',
    first_name: 'Arjun',
    last_name: 'Reddy',
    email: 'arjun.reddy@techcorp.com',
    gender: 'Male',
    employee_student_id: 'TC-2024-001',
    department_grade: 'Engineering',
    designation_section: 'Senior Developer',
    status: 'inactive',
    institution_id: 'ENT-002'
  },
  {
    id: 'u-corp-2',
    first_name: 'Kavya',
    last_name: 'Nair',
    email: 'kavya.nair@techcorp.com',
    gender: 'Female',
    employee_student_id: 'TC-2024-002',
    department_grade: 'Marketing',
    designation_section: 'Marketing Manager',
    status: 'inactive',
    institution_id: 'ENT-002'
  },
  {
    id: 'u-corp-3',
    first_name: 'Vikram',
    last_name: 'Singh',
    email: 'vikram.singh@techcorp.com',
    gender: 'Male',
    employee_student_id: 'TC-2024-003',
    department_grade: 'Sales',
    designation_section: 'Sales Director',
    status: 'inactive',
    institution_id: 'ENT-002'
  },
  {
    id: 'u-corp-4',
    first_name: 'Ananya',
    last_name: 'Gupta',
    email: 'ananya.gupta@techcorp.com',
    gender: 'Female',
    employee_student_id: 'TC-2024-004',
    department_grade: 'HR',
    designation_section: 'HR Executive',
    status: 'inactive',
    institution_id: 'ENT-002'
  },
  {
    id: 'u-corp-5',
    first_name: 'Rohan',
    last_name: 'Mehta',
    email: 'rohan.mehta@techcorp.com',
    gender: 'Male',
    employee_student_id: 'TC-2024-005',
    department_grade: 'Finance',
    designation_section: 'Financial Analyst',
    status: 'inactive',
    institution_id: 'ENT-002'
  },
  {
    id: 'u-corp-6',
    first_name: 'Meera',
    last_name: 'Iyer',
    email: 'meera.iyer@techcorp.com',
    gender: 'Female',
    employee_student_id: 'TC-2024-006',
    department_grade: 'Operations',
    designation_section: 'Operations Manager',
    status: 'inactive',
    institution_id: 'ENT-002'
  },
  {
    id: 'u-corp-7',
    first_name: 'Karthik',
    last_name: 'Rao',
    email: 'karthik.rao@techcorp.com',
    gender: 'Male',
    employee_student_id: 'TC-2024-007',
    department_grade: 'Engineering',
    designation_section: 'DevOps Lead',
    status: 'inactive',
    institution_id: 'ENT-002'
  },

  // SCHOOL STUDENTS (SCH2024-10A-001 to SCH2024-11B-007)
  {
    id: 'u-sch-1',
    first_name: 'Aarav',
    last_name: 'Sharma',
    email: 'aarav.sharma@school.edu',
    gender: 'Male',
    employee_student_id: 'SCH2024-10A-001',
    department_grade: 'Grade 10',
    designation_section: 'Section A',
    status: 'inactive',
    institution_id: 'ENT-001'
  },
  {
    id: 'u-sch-2',
    first_name: 'Diya',
    last_name: 'Patel',
    email: 'diya.patel@school.edu',
    gender: 'Female',
    employee_student_id: 'SCH2024-09B-002',
    department_grade: 'Grade 9',
    designation_section: 'Section B',
    status: 'inactive',
    institution_id: 'ENT-001'
  },
  {
    id: 'u-sch-3',
    first_name: 'Ishaan',
    last_name: 'Verma',
    email: 'ishaan.verma@school.edu',
    gender: 'Male',
    employee_student_id: 'SCH2024-11A-003',
    department_grade: 'Grade 11',
    designation_section: 'Section A',
    status: 'inactive',
    institution_id: 'ENT-001'
  },
  {
    id: 'u-sch-4',
    first_name: 'Ananya',
    last_name: 'Kapoor',
    email: 'ananya.kapoor@school.edu',
    gender: 'Female',
    employee_student_id: 'SCH2024-10C-004',
    department_grade: 'Grade 10',
    designation_section: 'Section C',
    status: 'inactive',
    institution_id: 'ENT-001'
  },
  {
    id: 'u-sch-5',
    first_name: 'Vihaan',
    last_name: 'Joshi',
    email: 'vihaan.joshi@school.edu',
    gender: 'Male',
    employee_student_id: 'SCH2024-12A-005',
    department_grade: 'Grade 12',
    designation_section: 'Section A',
    status: 'inactive',
    institution_id: 'ENT-001'
  },
  {
    id: 'u-sch-6',
    first_name: 'Saanvi',
    last_name: 'Desai',
    email: 'saanvi.desai@school.edu',
    gender: 'Female',
    employee_student_id: 'SCH2024-08A-006',
    department_grade: 'Grade 8',
    designation_section: 'Section A',
    status: 'inactive',
    institution_id: 'ENT-001'
  },
  {
    id: 'u-sch-7',
    first_name: 'Reyansh',
    last_name: 'Pillai',
    email: 'reyansh.pillai@school.edu',
    gender: 'Male',
    employee_student_id: 'SCH2024-11B-007',
    department_grade: 'Grade 11',
    designation_section: 'Section B',
    status: 'inactive',
    institution_id: 'ENT-001'
  }
];

const checkLockout = (id: string) => {
  const lockTime = securityStore.lockouts[id.toUpperCase()];
  if (lockTime && Date.now() < lockTime) {
    const remaining = Math.ceil((lockTime - Date.now()) / 60000);
    throw new Error(`Account locked. Please try again in ${remaining} minutes.`);
  }
};

export const validateMemberFields = (data: Partial<UserProfile>) => {
  const nameRegex = /^[A-Za-z\s]{1,50}$/;
  if (data.first_name && !nameRegex.test(data.first_name)) throw new Error("First Name: Letters and spaces only (Max 50).");
  if (data.last_name && !nameRegex.test(data.last_name)) throw new Error("Last Name: Letters and spaces only (Max 50).");
  if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) throw new Error("Invalid email format.");
  if (data.employee_student_id && !/^[A-Z0-9-_]{1,20}$/i.test(data.employee_student_id)) throw new Error("ID: Max 20 chars, Alphanumeric/Hyphen/Underscore.");
};

export const checkAccountStatus = async (id: string) => {
  await new Promise(r => setTimeout(r, 800));
  const cleanId = id.trim().toUpperCase();
  checkLockout(cleanId);

  const user = MOCK_USERS.find(u => u.employee_student_id.toUpperCase() === cleanId);
  if (!user) return { exists: false };
  
  return {
    exists: true,
    status: user.status,
    requires_activation: user.status === 'inactive',
    first_name: user.first_name
  };
};

export const requestActivationOTP = async (id: string, phone: string) => {
  await new Promise(r => setTimeout(r, 1000));
  const cleanId = id.trim().toUpperCase();
  
  // Rule: Valid Indian format (6-9 prefix, 10 digits)
  if (!/^[6-9]\d{9}$/.test(phone)) throw new Error("Invalid mobile format. Must be 10 digits starting with 6, 7, 8, or 9.");
  
  const existing = MOCK_USERS.find(u => u.phone_number === phone);
  if (existing && existing.employee_student_id.toUpperCase() !== cleanId) {
    return { success: false, message: "This phone number is already registered with another ID.", expires_in: 0 };
  }

  return { success: true, message: `OTP sent to ${phone}`, expires_in: 300 };
};

export const verifyActivationOTP = async (id: string, phone: string, otp: string): Promise<VerificationResult> => {
  await new Promise(r => setTimeout(r, 1200));
  const cleanId = id.trim().toUpperCase();
  
  if (otp !== '123456') {
    const attempts = (securityStore.otpAttempts[cleanId] || 0) + 1;
    securityStore.otpAttempts[cleanId] = attempts;
    
    if (attempts >= 3) {
      securityStore.lockouts[cleanId] = Date.now() + 15 * 60000;
      securityStore.otpAttempts[cleanId] = 0;
      return { success: false, has_partnership: false, message: "3 failed attempts. Account locked for 15 minutes." };
    }
    return { success: false, has_partnership: false, message: `Incorrect OTP. ${3 - attempts} attempts left.` };
  }

  const userIndex = MOCK_USERS.findIndex(u => u.employee_student_id.toUpperCase() === cleanId);
  if (userIndex !== -1) {
    MOCK_USERS[userIndex].status = 'active';
    MOCK_USERS[userIndex].phone_number = phone;
    securityStore.otpAttempts[cleanId] = 0;
    return { success: true, has_partnership: true, message: "Account activated!", user: MOCK_USERS[userIndex] };
  }
  return { success: false, has_partnership: false, message: "Sync error." };
};

export const loginUser = async (id: string, phone: string): Promise<VerificationResult> => {
  await new Promise(r => setTimeout(r, 1000));
  const cleanId = id.trim().toUpperCase();
  checkLockout(cleanId);

  const user = MOCK_USERS.find(u => u.employee_student_id.toUpperCase() === cleanId && u.phone_number === phone);
  
  if (user) {
    securityStore.loginAttempts[cleanId] = 0;
    return { success: true, has_partnership: true, message: "Login successful", user };
  } else {
    const attempts = (securityStore.loginAttempts[cleanId] || 0) + 1;
    securityStore.loginAttempts[cleanId] = attempts;
    if (attempts >= 5) {
      securityStore.lockouts[cleanId] = Date.now() + 24 * 60 * 60000; // 24h or until admin unlock
      return { success: false, has_partnership: false, message: "5 failed attempts. Account locked. Contact Admin." };
    }
    return { success: false, has_partnership: false, message: `Invalid credentials. ${5 - attempts} attempts left.` };
  }
};

/**
 * Verifies institutional membership via QR code data.
 */
export const verifyEntityMember = async (qrData: string): Promise<VerificationResult> => {
  await new Promise(r => setTimeout(r, 1000));
  const decoded = decodeQR(qrData);
  
  if (!decoded || !decoded.entity_id) {
    return { success: false, has_partnership: false, message: "Invalid QR code format." };
  }

  const entity = MOCK_ENTITIES.find(e => e.id === decoded.entity_id);
  if (!entity) {
    return { success: false, has_partnership: false, message: "Institution not found in our partnership records." };
  }

  // Calculate mock benefits
  const discountPercentage = 25;
  const discountAmount = Math.round(BASE_PRICE * (discountPercentage / 100));
  const finalPrice = BASE_PRICE - discountAmount;

  return {
    success: true,
    has_partnership: true,
    institution_name: entity.name,
    entity_name: entity.name,
    entity_type: entity.type,
    discount_percentage: discountPercentage,
    discount_amount: discountAmount,
    original_price: BASE_PRICE,
    final_price: finalPrice,
    discount_valid_until: '2026-12-31',
    message: `Verification successful for ${entity.name}. Benefit applied.`
  };
};
