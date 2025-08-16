import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';

export interface SampleLoanRequest {
  name: string;
  email: string;
  mobileNumber: string;
  idNumber: string;
  amount: number;
  repaymentPeriod: number;
  purpose: string;
  category: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: Date;
  borrowerRating: number;
  riskLevel: 'low' | 'medium' | 'high';
  description: string;
  monthlyIncome?: number;
  employmentStatus?: string;
  creditScore?: number;
}

export const sampleLoanRequests: SampleLoanRequest[] = [
  {
    name: "أحمد محمد",
    email: "ahmed.mohammed@example.com",
    mobileNumber: "+966501234567",
    idNumber: "1234567890",
    amount: 2500,
    repaymentPeriod: 6,
    purpose: "Home renovation and furniture purchase",
    category: "Home",
    status: "approved",
    submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    borrowerRating: 4.8,
    riskLevel: "low",
    description: "Need funds to renovate my living room and purchase new furniture. I have a stable job and can afford monthly payments.",
    monthlyIncome: 8000,
    employmentStatus: "Full-time",
    creditScore: 750
  },
  {
    name: "فاطمة علي",
    email: "fatima.ali@example.com",
    mobileNumber: "+966502345678",
    idNumber: "2345678901",
    amount: 1500,
    repaymentPeriod: 3,
    purpose: "Medical expenses and dental treatment",
    category: "Medical",
    status: "approved",
    submittedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    borrowerRating: 4.5,
    riskLevel: "low",
    description: "Urgent need for dental treatment and medical expenses. I have insurance but need additional funds for uncovered procedures.",
    monthlyIncome: 6000,
    employmentStatus: "Full-time",
    creditScore: 720
  },
  {
    name: "محمد عبدالله",
    email: "mohammed.abdullah@example.com",
    mobileNumber: "+966503456789",
    idNumber: "3456789012",
    amount: 4000,
    repaymentPeriod: 12,
    purpose: "Small business expansion and equipment purchase",
    category: "Business",
    status: "pending",
    submittedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    borrowerRating: 4.2,
    riskLevel: "medium",
    description: "Expanding my small electronics repair shop. Need funds to purchase new tools and equipment to serve more customers.",
    monthlyIncome: 12000,
    employmentStatus: "Self-employed",
    creditScore: 680
  },
  {
    name: "سارة أحمد",
    email: "sara.ahmed@example.com",
    mobileNumber: "+966504567890",
    idNumber: "4567890123",
    amount: 800,
    repaymentPeriod: 2,
    purpose: "Educational materials and online courses",
    category: "Education",
    status: "approved",
    submittedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
    borrowerRating: 4.7,
    riskLevel: "low",
    description: "Investing in my professional development through online courses and educational materials. This will help me advance in my career.",
    monthlyIncome: 7000,
    employmentStatus: "Full-time",
    creditScore: 780
  },
  {
    name: "علي حسن",
    email: "ali.hassan@example.com",
    mobileNumber: "+966505678901",
    idNumber: "5678901234",
    amount: 3000,
    repaymentPeriod: 8,
    purpose: "Debt consolidation and credit card payoff",
    category: "Debt",
    status: "pending",
    submittedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    borrowerRating: 3.8,
    riskLevel: "high",
    description: "Consolidating multiple high-interest credit card debts into one manageable loan. This will help me save on interest and pay off faster.",
    monthlyIncome: 9000,
    employmentStatus: "Full-time",
    creditScore: 620
  },
  {
    name: "نورا محمد",
    email: "nora.mohammed@example.com",
    mobileNumber: "+966506789012",
    idNumber: "6789012345",
    amount: 1200,
    repaymentPeriod: 4,
    purpose: "Vehicle maintenance and repairs",
    category: "Personal",
    status: "approved",
    submittedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), // 6 days ago
    borrowerRating: 4.3,
    riskLevel: "medium",
    description: "My car needs urgent repairs to pass inspection. This is essential for my daily commute to work.",
    monthlyIncome: 6500,
    employmentStatus: "Full-time",
    creditScore: 700
  },
  {
    name: "خالد سعد",
    email: "khalid.saad@example.com",
    mobileNumber: "+966507890123",
    idNumber: "7890123456",
    amount: 5000,
    repaymentPeriod: 10,
    purpose: "Wedding expenses and celebration",
    category: "Personal",
    status: "pending",
    submittedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
    borrowerRating: 4.1,
    riskLevel: "medium",
    description: "Planning my wedding celebration and need funds for venue, catering, and other arrangements. This is a once-in-a-lifetime event.",
    monthlyIncome: 11000,
    employmentStatus: "Full-time",
    creditScore: 690
  },
  {
    name: "ريم عبدالرحمن",
    email: "reem.abdulrahman@example.com",
    mobileNumber: "+966508901234",
    idNumber: "8901234567",
    amount: 1800,
    repaymentPeriod: 5,
    purpose: "Travel and vacation expenses",
    category: "Personal",
    status: "approved",
    submittedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000), // 8 days ago
    borrowerRating: 4.6,
    riskLevel: "low",
    description: "Family vacation to visit relatives abroad. This is important for maintaining family connections and creating memories.",
    monthlyIncome: 8500,
    employmentStatus: "Full-time",
    creditScore: 760
  }
];

export const populateSampleData = async () => {
  try {
    console.log('Starting to populate sample data...');
    
    for (const loanRequest of sampleLoanRequests) {
      await addDoc(collection(db, "loanRequests"), {
        ...loanRequest,
        submittedAt: serverTimestamp(),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        userId: `sample-user-${Math.random().toString(36).substr(2, 9)}`,
        kycStatus: "approved",
        idPhotoUrl: "https://via.placeholder.com/150x200/4F46E5/FFFFFF?text=ID+Photo",
        documents: [],
        adminNotes: "Sample loan request for demonstration purposes",
        adminReview: {
          adminId: "sample-admin",
          reviewedAt: serverTimestamp(),
          status: loanRequest.status,
          notes: "Auto-approved sample request"
        }
      });
      console.log(`Added loan request for ${loanRequest.name}`);
    }
    
    console.log('Sample data population completed successfully!');
    return true;
  } catch (error) {
    console.error('Error populating sample data:', error);
    return false;
  }
};

export const clearSampleData = async () => {
  try {
    // This would require additional setup to delete documents
    // For now, we'll just log that this function exists
    console.log('Clear sample data function called - requires manual cleanup');
    return true;
  } catch (error) {
    console.error('Error clearing sample data:', error);
    return false;
  }
};
