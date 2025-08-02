// --- API Request Payloads ---
export interface CreateClassroomRequest {
    name: string;
    imageUrl?: string;
  }
  
  export interface CreateMentorRequest {
    firstName: string;
    lastName:string;
    email: string;
    address: string;
    title: string;
    sessionFee: number;
    profession: string;
    bio: string;
    phoneNumber: string;
    qualification: string;
    imageUrl?: string;
    classroomIds: number[];
  }
  
  export interface CreateBookingRequest {
    classroomId: number;
    mentorId: number;
    sessionDateTime: string; // ISO string format
    duration: number;
    bankSlipUrl: string;
  }
  
  
  // --- API Response Payloads ---
  export interface Classroom {
    id: number;
    name: string;
    imageUrl: string;
    mentors?: Mentor[]; // Often lazy-loaded
  }
  
  export interface Mentor {
      id: number;
      firstName: string;
      lastName: string;
      email: string;
      address: string;
      title: string;
      sessionFee: number;
      profession: string;
      bio: string;
      phoneNumber: string;
      qualification: string;
      imageUrl: string;
      classrooms?: Classroom[];
  }
  
  export interface BookingDetailsResponse {
      bookingId: number;
      className: string;
      studentName: string;
      mentorName: string;
      sessionDate: string;
      status: 'PENDING' | 'ACCEPTED' | 'COMPLETED';
  }
  
  export interface StudentDashboardResponse {
      className: string;
      mentorName: string;
      sessionDate: string;
      status: 'PENDING' | 'ACCEPTED' | 'COMPLETED';
  }
  
  export interface MentorClassDto {
      name: string;
      studentCount: number;
  }
  
  export interface MentorProfileResponse {
      mentor: Mentor;
      classes: MentorClassDto[];
  }