// Repayment Reminder Scheduler
// Handles scheduling and managing repayment reminder emails

import { emailService, getReminderType, getDaysOverdue, ReminderEmailData } from './emailService';

export interface LoanRecord {
  id: string;
  borrowerName: string;
  borrowerEmail: string;
  loanAmount: number;
  remainingAmount: number;
  dueDate: string;
  status: 'active' | 'overdue' | 'completed' | 'defaulted';
  lenderName?: string;
  lastReminderSent?: string;
  reminderCount?: number;
  paymentLink: string;
}

export interface ReminderSchedule {
  id: string;
  loanId: string;
  type: 'upcoming' | 'overdue' | 'final';
  scheduledDate: string;
  status: 'pending' | 'sent' | 'failed' | 'cancelled';
  attempts: number;
  maxAttempts: number;
  createdAt: string;
  sentAt?: string;
  errorMessage?: string;
}

export interface ReminderSettings {
  upcomingReminderDays: number[]; // Days before due date to send reminders
  overdueReminderDays: number[]; // Days after due date to send reminders
  finalNoticeDays: number; // Days after due date to send final notice
  maxRemindersPerType: number;
  reminderIntervalHours: number;
  enableReminders: boolean;
}

class ReminderScheduler {
  private settings: ReminderSettings;
  private schedules: Map<string, ReminderSchedule> = new Map();
  private isRunning: boolean = false;
  private intervalId: NodeJS.Timeout | null = null;

  constructor(settings: ReminderSettings) {
    this.settings = settings;
    this.loadSchedules();
  }

  // Default reminder settings
  static getDefaultSettings(): ReminderSettings {
    return {
      upcomingReminderDays: [7, 3, 1], // 7 days, 3 days, 1 day before due
      overdueReminderDays: [1, 3, 7, 14], // 1, 3, 7, 14 days after due
      finalNoticeDays: 30, // Final notice after 30 days overdue
      maxRemindersPerType: 3,
      reminderIntervalHours: 24, // Check every 24 hours
      enableReminders: true,
    };
  }

  // Start the reminder scheduler
  start(): void {
    if (this.isRunning) {
      console.log('⚠️ Reminder scheduler is already running');
      return;
    }

    if (!this.settings.enableReminders) {
      console.log('ℹ️ Reminder scheduler is disabled');
      return;
    }

    this.isRunning = true;
    console.log('🚀 Starting reminder scheduler...');

    // Run immediately
    this.processReminders();

    // Schedule regular checks
    this.intervalId = setInterval(() => {
      this.processReminders();
    }, this.settings.reminderIntervalHours * 60 * 60 * 1000);

    console.log(`✅ Reminder scheduler started (checking every ${this.settings.reminderIntervalHours} hours)`);
  }

  // Stop the reminder scheduler
  stop(): void {
    if (!this.isRunning) {
      console.log('⚠️ Reminder scheduler is not running');
      return;
    }

    this.isRunning = false;
    
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }

    console.log('🛑 Reminder scheduler stopped');
  }

  // Process all pending reminders
  async processReminders(): Promise<void> {
    console.log('🔄 Processing reminders...');
    
    const now = new Date();
    const pendingSchedules = Array.from(this.schedules.values())
      .filter(schedule => 
        schedule.status === 'pending' && 
        new Date(schedule.scheduledDate) <= now
      );

    console.log(`📋 Found ${pendingSchedules.length} pending reminders`);

    for (const schedule of pendingSchedules) {
      try {
        await this.processReminder(schedule);
      } catch (error) {
        console.error(`❌ Error processing reminder ${schedule.id}:`, error);
        this.updateScheduleStatus(schedule.id, 'failed', error.message);
      }
    }

    console.log('✅ Reminder processing completed');
  }

  // Process a single reminder
  private async processReminder(schedule: ReminderSchedule): Promise<void> {
    console.log(`📧 Processing reminder ${schedule.id} for loan ${schedule.loanId}`);

    // Get loan data (in a real app, this would come from your database)
    const loan = await this.getLoanById(schedule.loanId);
    if (!loan) {
      console.error(`❌ Loan ${schedule.loanId} not found`);
      this.updateScheduleStatus(schedule.id, 'failed', 'Loan not found');
      return;
    }

    // Check if loan is still active
    if (loan.status === 'completed') {
      console.log(`ℹ️ Loan ${schedule.loanId} is completed, cancelling reminder`);
      this.updateScheduleStatus(schedule.id, 'cancelled', 'Loan completed');
      return;
    }

    // Prepare email data
    const emailData: ReminderEmailData = {
      borrowerName: loan.borrowerName,
      borrowerEmail: loan.borrowerEmail,
      loanAmount: loan.loanAmount,
      remainingAmount: loan.remainingAmount,
      dueDate: loan.dueDate,
      daysOverdue: getDaysOverdue(loan.dueDate),
      loanId: loan.id,
      paymentLink: loan.paymentLink,
      lenderName: loan.lenderName,
    };

    // Send email
    const success = await emailService.sendReminderEmail(emailData, schedule.type);
    
    if (success) {
      this.updateScheduleStatus(schedule.id, 'sent');
      this.updateLoanReminderInfo(loan.id, schedule.type);
      console.log(`✅ Reminder sent successfully for loan ${schedule.loanId}`);
    } else {
      this.updateScheduleStatus(schedule.id, 'failed', 'Email sending failed');
      console.error(`❌ Failed to send reminder for loan ${schedule.loanId}`);
    }
  }

  // Schedule reminders for a loan
  scheduleLoanReminders(loan: LoanRecord): void {
    console.log(`📅 Scheduling reminders for loan ${loan.id}`);

    // Clear existing schedules for this loan
    this.clearLoanSchedules(loan.id);

    // Schedule upcoming reminders
    this.scheduleUpcomingReminders(loan);

    // Schedule overdue reminders
    this.scheduleOverdueReminders(loan);

    // Schedule final notice
    this.scheduleFinalNotice(loan);

    this.saveSchedules();
  }

  // Schedule upcoming payment reminders
  private scheduleUpcomingReminders(loan: LoanRecord): void {
    const dueDate = new Date(loan.dueDate);
    
    this.settings.upcomingReminderDays.forEach((daysBefore, index) => {
      const reminderDate = new Date(dueDate);
      reminderDate.setDate(reminderDate.getDate() - daysBefore);
      
      // Only schedule if the reminder date is in the future
      if (reminderDate > new Date()) {
        const schedule: ReminderSchedule = {
          id: `${loan.id}-upcoming-${index}`,
          loanId: loan.id,
          type: 'upcoming',
          scheduledDate: reminderDate.toISOString(),
          status: 'pending',
          attempts: 0,
          maxAttempts: 3,
          createdAt: new Date().toISOString(),
        };
        
        this.schedules.set(schedule.id, schedule);
        console.log(`📅 Scheduled upcoming reminder for ${daysBefore} days before due date`);
      }
    });
  }

  // Schedule overdue payment reminders
  private scheduleOverdueReminders(loan: LoanRecord): void {
    const dueDate = new Date(loan.dueDate);
    
    this.settings.overdueReminderDays.forEach((daysAfter, index) => {
      const reminderDate = new Date(dueDate);
      reminderDate.setDate(reminderDate.getDate() + daysAfter);
      
      const schedule: ReminderSchedule = {
        id: `${loan.id}-overdue-${index}`,
        loanId: loan.id,
        type: 'overdue',
        scheduledDate: reminderDate.toISOString(),
        status: 'pending',
        attempts: 0,
        maxAttempts: 3,
        createdAt: new Date().toISOString(),
      };
      
      this.schedules.set(schedule.id, schedule);
      console.log(`📅 Scheduled overdue reminder for ${daysAfter} days after due date`);
    });
  }

  // Schedule final notice
  private scheduleFinalNotice(loan: LoanRecord): void {
    const dueDate = new Date(loan.dueDate);
    const finalNoticeDate = new Date(dueDate);
    finalNoticeDate.setDate(finalNoticeDate.getDate() + this.settings.finalNoticeDays);
    
    const schedule: ReminderSchedule = {
      id: `${loan.id}-final`,
      loanId: loan.id,
      type: 'final',
      scheduledDate: finalNoticeDate.toISOString(),
      status: 'pending',
      attempts: 0,
      maxAttempts: 1, // Final notice should only be sent once
      createdAt: new Date().toISOString(),
    };
    
    this.schedules.set(schedule.id, schedule);
    console.log(`📅 Scheduled final notice for ${this.settings.finalNoticeDays} days after due date`);
  }

  // Clear all schedules for a loan
  clearLoanSchedules(loanId: string): void {
    const loanSchedules = Array.from(this.schedules.entries())
      .filter(([_, schedule]) => schedule.loanId === loanId);
    
    loanSchedules.forEach(([id, _]) => {
      this.schedules.delete(id);
    });
    
    console.log(`🗑️ Cleared ${loanSchedules.length} schedules for loan ${loanId}`);
  }

  // Update schedule status
  private updateScheduleStatus(scheduleId: string, status: ReminderSchedule['status'], errorMessage?: string): void {
    const schedule = this.schedules.get(scheduleId);
    if (schedule) {
      schedule.status = status;
      schedule.attempts += 1;
      
      if (status === 'sent') {
        schedule.sentAt = new Date().toISOString();
      }
      
      if (errorMessage) {
        schedule.errorMessage = errorMessage;
      }
      
      this.schedules.set(scheduleId, schedule);
      this.saveSchedules();
    }
  }

  // Update loan reminder information
  private updateLoanReminderInfo(loanId: string, reminderType: string): void {
    // In a real app, this would update the database
    console.log(`📝 Updated reminder info for loan ${loanId}, type: ${reminderType}`);
  }

  // Get loan by ID (mock implementation)
  private async getLoanById(loanId: string): Promise<LoanRecord | null> {
    // In a real app, this would query your database
    // For now, return a mock loan
    return {
      id: loanId,
      borrowerName: 'أحمد محمد',
      borrowerEmail: 'ahmed@example.com',
      loanAmount: 50000,
      remainingAmount: 25000,
      dueDate: '2024-02-15',
      status: 'active',
      paymentLink: `https://garshain.com/pay/${loanId}`,
    };
  }

  // Load schedules from storage
  private loadSchedules(): void {
    try {
      const stored = localStorage.getItem('garshain-reminder-schedules');
      if (stored) {
        const schedules = JSON.parse(stored);
        this.schedules = new Map(schedules);
        console.log(`📂 Loaded ${this.schedules.size} reminder schedules`);
      }
    } catch (error) {
      console.error('❌ Error loading reminder schedules:', error);
    }
  }

  // Save schedules to storage
  private saveSchedules(): void {
    try {
      const schedules = Array.from(this.schedules.entries());
      localStorage.setItem('garshain-reminder-schedules', JSON.stringify(schedules));
    } catch (error) {
      console.error('❌ Error saving reminder schedules:', error);
    }
  }

  // Get all schedules
  getSchedules(): ReminderSchedule[] {
    return Array.from(this.schedules.values());
  }

  // Get schedules for a specific loan
  getLoanSchedules(loanId: string): ReminderSchedule[] {
    return Array.from(this.schedules.values())
      .filter(schedule => schedule.loanId === loanId);
  }

  // Update reminder settings
  updateSettings(newSettings: Partial<ReminderSettings>): void {
    this.settings = { ...this.settings, ...newSettings };
    console.log('⚙️ Reminder settings updated:', this.settings);
  }

  // Get current settings
  getSettings(): ReminderSettings {
    return { ...this.settings };
  }

  // Get scheduler status
  getStatus(): { isRunning: boolean; scheduleCount: number; settings: ReminderSettings } {
    return {
      isRunning: this.isRunning,
      scheduleCount: this.schedules.size,
      settings: this.settings,
    };
  }
}

// Create scheduler instance with default settings
export const reminderScheduler = new ReminderScheduler(ReminderScheduler.getDefaultSettings());

// Utility functions
export const createMockLoan = (overrides: Partial<LoanRecord> = {}): LoanRecord => {
  return {
    id: `loan-${Date.now()}`,
    borrowerName: 'أحمد محمد',
    borrowerEmail: 'ahmed@example.com',
    loanAmount: 50000,
    remainingAmount: 25000,
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7 days from now
    status: 'active',
    paymentLink: `https://garshain.com/pay/loan-${Date.now()}`,
    ...overrides,
  };
};

export const formatReminderDate = (date: string): string => {
  return new Date(date).toLocaleDateString('ar-SA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};
