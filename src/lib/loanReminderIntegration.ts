// Loan Reminder Integration Service
// Integrates repayment reminders with existing loan management system

import { reminderScheduler, type LoanRecord } from './reminderScheduler';
import { emailService, type ReminderEmailData } from './emailService';
import { AdminWorkflow, type AdminReview } from './adminWorkflow';
import { MatchingEngine, type LoanRequest } from './matchingEngine';

export interface ActiveLoan {
  id: string;
  borrowerId: string;
  borrowerName: string;
  borrowerEmail: string;
  loanAmount: number;
  remainingAmount: number;
  dueDate: string;
  status: 'active' | 'overdue' | 'completed' | 'defaulted';
  lenderId?: string;
  lenderName?: string;
  interestRate: number;
  termMonths: number;
  monthlyPayment: number;
  paymentLink: string;
  createdAt: string;
  lastPaymentDate?: string;
  nextPaymentDate: string;
  reminderCount: number;
  lastReminderSent?: string;
}

export interface PaymentRecord {
  id: string;
  loanId: string;
  amount: number;
  paymentDate: string;
  paymentMethod: 'bank_transfer' | 'credit_card' | 'wallet' | 'cash';
  status: 'pending' | 'completed' | 'failed';
  reference?: string;
}

export interface ReminderStats {
  totalActiveLoans: number;
  loansWithUpcomingPayments: number;
  overdueLoans: number;
  remindersSentToday: number;
  remindersSentThisWeek: number;
  averageDaysOverdue: number;
}

class LoanReminderIntegration {
  private activeLoans: Map<string, ActiveLoan> = new Map();
  private paymentRecords: Map<string, PaymentRecord[]> = new Map();

  constructor() {
    this.loadData();
    this.startPeriodicSync();
  }

  // Initialize reminder system for approved loans
  async initializeLoanReminders(adminReview: AdminReview, loanRequest: LoanRequest): Promise<void> {
    if (adminReview.status !== 'approved' || !adminReview.approvedAmount) {
      console.log('⚠️ Cannot initialize reminders for non-approved loan');
      return;
    }

    const activeLoan: ActiveLoan = {
      id: adminReview.loanRequestId,
      borrowerId: loanRequest.borrowerId,
      borrowerName: loanRequest.borrowerName,
      borrowerEmail: loanRequest.borrowerEmail,
      loanAmount: adminReview.approvedAmount,
      remainingAmount: adminReview.approvedAmount,
      dueDate: this.calculateDueDate(adminReview.approvedTerms || 12),
      status: 'active',
      lenderId: adminReview.adminId,
      lenderName: 'Garshain Platform',
      interestRate: adminReview.interestRate || 0,
      termMonths: adminReview.approvedTerms || 12,
      monthlyPayment: this.calculateMonthlyPayment(
        adminReview.approvedAmount,
        adminReview.interestRate || 0,
        adminReview.approvedTerms || 12
      ),
      paymentLink: `https://garshain.com/pay/${adminReview.loanRequestId}`,
      createdAt: new Date().toISOString(),
      nextPaymentDate: this.calculateNextPaymentDate(adminReview.approvedTerms || 12),
      reminderCount: 0,
    };

    // Save loan to active loans
    this.activeLoans.set(activeLoan.id, activeLoan);
    this.saveData();

    // Convert to LoanRecord for reminder scheduler
    const loanRecord: LoanRecord = {
      id: activeLoan.id,
      borrowerName: activeLoan.borrowerName,
      borrowerEmail: activeLoan.borrowerEmail,
      loanAmount: activeLoan.loanAmount,
      remainingAmount: activeLoan.remainingAmount,
      dueDate: activeLoan.dueDate,
      status: activeLoan.status,
      lenderName: activeLoan.lenderName,
      paymentLink: activeLoan.paymentLink,
    };

    // Schedule reminders
    reminderScheduler.scheduleLoanReminders(loanRecord);
    
    console.log(`✅ Initialized reminders for loan ${activeLoan.id}`);
  }

  // Process payment and update loan status
  async processPayment(payment: PaymentRecord): Promise<boolean> {
    const loan = this.activeLoans.get(payment.loanId);
    if (!loan) {
      console.error(`❌ Loan ${payment.loanId} not found`);
      return false;
    }

    if (payment.status !== 'completed') {
      console.log(`ℹ️ Payment ${payment.id} not completed, skipping processing`);
      return false;
    }

    // Update loan remaining amount
    loan.remainingAmount = Math.max(0, loan.remainingAmount - payment.amount);
    loan.lastPaymentDate = payment.paymentDate;

    // Check if loan is fully paid
    if (loan.remainingAmount <= 0) {
      loan.status = 'completed';
      loan.nextPaymentDate = '';
      // Cancel all pending reminders for this loan
      reminderScheduler.clearLoanSchedules(loan.id);
      console.log(`🎉 Loan ${loan.id} fully paid and completed`);
    } else {
      // Update next payment date
      loan.nextPaymentDate = this.calculateNextPaymentDate(loan.termMonths, new Date(payment.paymentDate));
    }

    // Add payment to records
    const payments = this.paymentRecords.get(payment.loanId) || [];
    payments.push(payment);
    this.paymentRecords.set(payment.loanId, payments);

    // Save updated data
    this.activeLoans.set(loan.id, loan);
    this.saveData();

    console.log(`✅ Processed payment for loan ${loan.id}: ${payment.amount} ر.س`);
    return true;
  }

  // Update loan status based on due dates
  async updateLoanStatuses(): Promise<void> {
    const now = new Date();
    let updatedCount = 0;

    for (const [loanId, loan] of this.activeLoans) {
      if (loan.status === 'completed') continue;

      const dueDate = new Date(loan.dueDate);
      const daysOverdue = Math.ceil((now.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));

      let newStatus = loan.status;
      if (daysOverdue > 0 && loan.status === 'active') {
        newStatus = 'overdue';
        updatedCount++;
      } else if (daysOverdue > 90) {
        newStatus = 'defaulted';
        updatedCount++;
      }

      if (newStatus !== loan.status) {
        loan.status = newStatus;
        this.activeLoans.set(loanId, loan);
      }
    }

    if (updatedCount > 0) {
      this.saveData();
      console.log(`📊 Updated status for ${updatedCount} loans`);
    }
  }

  // Get reminder statistics
  getReminderStats(): ReminderStats {
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const activeLoans = Array.from(this.activeLoans.values());
    const schedules = reminderScheduler.getSchedules();

    const loansWithUpcomingPayments = activeLoans.filter(loan => {
      const dueDate = new Date(loan.dueDate);
      const daysUntilDue = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      return daysUntilDue <= 7 && daysUntilDue > 0;
    }).length;

    const overdueLoans = activeLoans.filter(loan => loan.status === 'overdue').length;

    const remindersSentToday = schedules.filter(schedule => 
      schedule.status === 'sent' && 
      schedule.sentAt && 
      schedule.sentAt.startsWith(today)
    ).length;

    const remindersSentThisWeek = schedules.filter(schedule => 
      schedule.status === 'sent' && 
      schedule.sentAt && 
      schedule.sentAt >= weekAgo
    ).length;

    const overdueDays = activeLoans
      .filter(loan => loan.status === 'overdue')
      .map(loan => {
        const dueDate = new Date(loan.dueDate);
        return Math.ceil((now.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));
      });

    const averageDaysOverdue = overdueDays.length > 0 
      ? overdueDays.reduce((sum, days) => sum + days, 0) / overdueDays.length 
      : 0;

    return {
      totalActiveLoans: activeLoans.length,
      loansWithUpcomingPayments,
      overdueLoans,
      remindersSentToday,
      remindersSentThisWeek,
      averageDaysOverdue: Math.round(averageDaysOverdue * 10) / 10,
    };
  }

  // Get loans requiring attention
  getLoansRequiringAttention(): ActiveLoan[] {
    const now = new Date();
    return Array.from(this.activeLoans.values())
      .filter(loan => {
        if (loan.status === 'completed') return false;
        
        const dueDate = new Date(loan.dueDate);
        const daysUntilDue = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        
        // Include loans that are overdue or due within 3 days
        return daysUntilDue <= 3;
      })
      .sort((a, b) => {
        const aDue = new Date(a.dueDate);
        const bDue = new Date(b.dueDate);
        return aDue.getTime() - bDue.getTime();
      });
  }

  // Send manual reminder
  async sendManualReminder(loanId: string, reminderType: 'upcoming' | 'overdue' | 'final'): Promise<boolean> {
    const loan = this.activeLoans.get(loanId);
    if (!loan) {
      console.error(`❌ Loan ${loanId} not found`);
      return false;
    }

    const emailData: ReminderEmailData = {
      borrowerName: loan.borrowerName,
      borrowerEmail: loan.borrowerEmail,
      loanAmount: loan.loanAmount,
      remainingAmount: loan.remainingAmount,
      dueDate: loan.dueDate,
      daysOverdue: reminderType !== 'upcoming' ? this.getDaysOverdue(loan.dueDate) : undefined,
      loanId: loan.id,
      paymentLink: loan.paymentLink,
      lenderName: loan.lenderName,
    };

    const success = await emailService.sendReminderEmail(emailData, reminderType);
    
    if (success) {
      loan.reminderCount += 1;
      loan.lastReminderSent = new Date().toISOString();
      this.activeLoans.set(loanId, loan);
      this.saveData();
      console.log(`✅ Manual reminder sent for loan ${loanId}`);
    }

    return success;
  }

  // Get loan details
  getLoan(loanId: string): ActiveLoan | undefined {
    return this.activeLoans.get(loanId);
  }

  // Get all active loans
  getAllLoans(): ActiveLoan[] {
    return Array.from(this.activeLoans.values());
  }

  // Get payment history for a loan
  getPaymentHistory(loanId: string): PaymentRecord[] {
    return this.paymentRecords.get(loanId) || [];
  }

  // Calculate due date based on loan terms
  private calculateDueDate(termMonths: number): string {
    const dueDate = new Date();
    dueDate.setMonth(dueDate.getMonth() + termMonths);
    return dueDate.toISOString().split('T')[0];
  }

  // Calculate next payment date
  private calculateNextPaymentDate(termMonths: number, fromDate?: Date): string {
    const baseDate = fromDate || new Date();
    const nextPayment = new Date(baseDate);
    nextPayment.setMonth(nextPayment.getMonth() + 1);
    return nextPayment.toISOString().split('T')[0];
  }

  // Calculate monthly payment amount
  private calculateMonthlyPayment(principal: number, annualRate: number, termMonths: number): number {
    if (annualRate === 0) {
      return principal / termMonths;
    }
    
    const monthlyRate = annualRate / 100 / 12;
    const monthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, termMonths)) / 
                          (Math.pow(1 + monthlyRate, termMonths) - 1);
    
    return Math.round(monthlyPayment * 100) / 100;
  }

  // Get days overdue
  private getDaysOverdue(dueDate: string): number {
    const due = new Date(dueDate);
    const now = new Date();
    const diffTime = now.getTime() - due.getTime();
    return Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  }

  // Start periodic sync with reminder system
  private startPeriodicSync(): void {
    // Update loan statuses every hour
    setInterval(() => {
      this.updateLoanStatuses();
    }, 60 * 60 * 1000);

    // Initial update
    this.updateLoanStatuses();
  }

  // Load data from storage
  private loadData(): void {
    try {
      const storedLoans = localStorage.getItem('garshain-active-loans');
      if (storedLoans) {
        const loans = JSON.parse(storedLoans);
        this.activeLoans = new Map(loans);
        console.log(`📂 Loaded ${this.activeLoans.size} active loans`);
      }

      const storedPayments = localStorage.getItem('garshain-payment-records');
      if (storedPayments) {
        const payments = JSON.parse(storedPayments);
        this.paymentRecords = new Map(payments);
        console.log(`📂 Loaded payment records for ${this.paymentRecords.size} loans`);
      }
    } catch (error) {
      console.error('❌ Error loading loan data:', error);
    }
  }

  // Save data to storage
  private saveData(): void {
    try {
      localStorage.setItem('garshain-active-loans', JSON.stringify(Array.from(this.activeLoans.entries())));
      localStorage.setItem('garshain-payment-records', JSON.stringify(Array.from(this.paymentRecords.entries())));
    } catch (error) {
      console.error('❌ Error saving loan data:', error);
    }
  }
}

// Create integration instance
export const loanReminderIntegration = new LoanReminderIntegration();

// Utility functions
export const formatCurrency = (amount: number): string => {
  return `${amount.toLocaleString('ar-SA')} ر.س`;
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('ar-SA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const getDaysUntilDue = (dueDate: string): number => {
  const due = new Date(dueDate);
  const now = new Date();
  const diffTime = due.getTime() - now.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export const getLoanStatusBadge = (status: string) => {
  switch (status) {
    case 'active':
      return { text: 'نشط', color: 'bg-green-500' };
    case 'overdue':
      return { text: 'متأخر', color: 'bg-orange-500' };
    case 'completed':
      return { text: 'مكتمل', color: 'bg-blue-500' };
    case 'defaulted':
      return { text: 'متخلف', color: 'bg-red-500' };
    default:
      return { text: status, color: 'bg-gray-500' };
  }
};
