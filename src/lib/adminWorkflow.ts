import { MatchingEngine, LoanRequest, RiskAssessment } from './matchingEngine';
import { useNotifications } from '@/contexts/NotificationContext';

export interface AdminReview {
  id: string;
  loanRequestId: string;
  adminId: string;
  status: 'pending' | 'approved' | 'rejected' | 'requires_additional_data';
  riskAssessment: RiskAssessment;
  adminNotes: string;
  reviewedAt: Date;
  additionalDataRequested?: string[];
  approvedAmount?: number;
  approvedTerms?: number;
  interestRate?: number;
}

export interface AdminAction {
  type: 'approve' | 'reject' | 'request_data' | 'adjust_terms';
  loanRequestId: string;
  adminId: string;
  data: any;
  notes: string;
}

export class AdminWorkflow {
  /**
   * Review a loan request and provide risk assessment
   */
  static async reviewLoanRequest(
    loanRequest: LoanRequest, 
    borrowerHistory: any,
    adminId: string
  ): Promise<AdminReview> {
    // Calculate risk assessment
    const riskAssessment = MatchingEngine.calculateRiskAssessment(loanRequest, borrowerHistory);
    
    // Determine initial status based on risk
    let status: AdminReview['status'] = 'pending';
    if (riskAssessment.level === 'high' && riskAssessment.score > 80) {
      status = 'requires_additional_data';
    } else if (riskAssessment.level === 'low' && riskAssessment.score < 30) {
      status = 'approved';
    }

    const review: AdminReview = {
      id: `review_${Date.now()}`,
      loanRequestId: loanRequest.id,
      adminId,
      status,
      riskAssessment,
      adminNotes: this.generateInitialNotes(riskAssessment),
      reviewedAt: new Date(),
      additionalDataRequested: riskAssessment.level === 'high' ? [
        'Proof of income',
        'Bank statements (last 3 months)',
        'Employment verification',
        'Additional identification documents'
      ] : undefined
    };

    return review;
  }

  /**
   * Approve a loan request
   */
  static async approveLoanRequest(
    review: AdminReview,
    approvedAmount: number,
    approvedTerms: number,
    interestRate: number,
    adminNotes: string
  ): Promise<AdminAction> {
    const action: AdminAction = {
      type: 'approve',
      loanRequestId: review.loanRequestId,
      adminId: review.adminId,
      data: {
        approvedAmount,
        approvedTerms,
        interestRate,
        riskLevel: review.riskAssessment.level,
        approvedAt: new Date()
      },
      notes: adminNotes
    };

    // Update review status
    review.status = 'approved';
    review.adminNotes = adminNotes;
    review.approvedAmount = approvedAmount;
    review.approvedTerms = approvedTerms;
    review.interestRate = interestRate;

    return action;
  }

  /**
   * Reject a loan request
   */
  static async rejectLoanRequest(
    review: AdminReview,
    reason: string,
    adminNotes: string
  ): Promise<AdminAction> {
    const action: AdminAction = {
      type: 'reject',
      loanRequestId: review.loanRequestId,
      adminId: review.adminId,
      data: {
        reason,
        rejectedAt: new Date(),
        riskLevel: review.riskAssessment.level
      },
      notes: adminNotes
    };

    // Update review status
    review.status = 'rejected';
    review.adminNotes = adminNotes;

    return action;
  }

  /**
   * Request additional data from borrower
   */
  static async requestAdditionalData(
    review: AdminReview,
    dataTypes: string[],
    adminNotes: string
  ): Promise<AdminAction> {
    const action: AdminAction = {
      type: 'request_data',
      loanRequestId: review.loanRequestId,
      adminId: review.adminId,
      data: {
        requestedData: dataTypes,
        requestedAt: new Date(),
        deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
      },
      notes: adminNotes
    };

    // Update review status
    review.status = 'requires_additional_data';
    review.adminNotes = adminNotes;
    review.additionalDataRequested = dataTypes;

    return action;
  }

  /**
   * Adjust loan terms based on risk assessment
   */
  static async adjustLoanTerms(
    review: AdminReview,
    newAmount: number,
    newTerms: number,
    newInterestRate: number,
    adminNotes: string
  ): Promise<AdminAction> {
    const action: AdminAction = {
      type: 'adjust_terms',
      loanRequestId: review.loanRequestId,
      adminId: review.adminId,
      data: {
        originalAmount: review.approvedAmount,
        originalTerms: review.approvedTerms,
        originalInterestRate: review.interestRate,
        newAmount,
        newTerms,
        newInterestRate,
        adjustedAt: new Date()
      },
      notes: adminNotes
    };

    // Update review with new terms
    review.approvedAmount = newAmount;
    review.approvedTerms = newTerms;
    review.interestRate = newInterestRate;
    review.adminNotes = adminNotes;

    return action;
  }

  /**
   * Generate initial admin notes based on risk assessment
   */
  private static generateInitialNotes(riskAssessment: RiskAssessment): string {
    let notes = `Risk Assessment: ${riskAssessment.level.toUpperCase()} (Score: ${riskAssessment.score}/100)\n\n`;
    
    if (riskAssessment.factors.length > 0) {
      notes += `Risk Factors:\n${riskAssessment.factors.map(factor => `• ${factor}`).join('\n')}\n\n`;
    }
    
    if (riskAssessment.recommendations.length > 0) {
      notes += `Recommendations:\n${riskAssessment.recommendations.map(rec => `• ${rec}`).join('\n')}\n\n`;
    }

    if (riskAssessment.level === 'high') {
      notes += '⚠️ HIGH RISK: Requires thorough review and may need additional documentation or collateral.';
    } else if (riskAssessment.level === 'medium') {
      notes += '⚠️ MEDIUM RISK: Standard review process with potential for approval with conditions.';
    } else {
      notes += '✅ LOW RISK: Likely suitable for approval with standard terms.';
    }

    return notes;
  }

  /**
   * Get admin dashboard statistics
   */
  static getDashboardStats(reviews: AdminReview[]): {
    totalReviews: number;
    pendingReviews: number;
    approvedCount: number;
    rejectedCount: number;
    dataRequestedCount: number;
    averageRiskScore: number;
    riskDistribution: { low: number; medium: number; high: number };
  } {
    const totalReviews = reviews.length;
    const pendingReviews = reviews.filter(r => r.status === 'pending').length;
    const approvedCount = reviews.filter(r => r.status === 'approved').length;
    const rejectedCount = reviews.filter(r => r.status === 'rejected').length;
    const dataRequestedCount = reviews.filter(r => r.status === 'requires_additional_data').length;
    
    const averageRiskScore = reviews.length > 0 
      ? reviews.reduce((sum, r) => sum + r.riskAssessment.score, 0) / reviews.length 
      : 0;

    const riskDistribution = {
      low: reviews.filter(r => r.riskAssessment.level === 'low').length,
      medium: reviews.filter(r => r.riskAssessment.level === 'medium').length,
      high: reviews.filter(r => r.riskAssessment.level === 'high').length
    };

    return {
      totalReviews,
      pendingReviews,
      approvedCount,
      rejectedCount,
      dataRequestedCount,
      averageRiskScore: Math.round(averageRiskScore * 100) / 100,
      riskDistribution
    };
  }

  /**
   * Get priority queue for loan reviews
   */
  static getPriorityQueue(reviews: AdminReview[]): AdminReview[] {
    return reviews
      .filter(r => r.status === 'pending')
      .sort((a, b) => {
        // Sort by risk score (highest first) and then by submission date (oldest first)
        if (a.riskAssessment.score !== b.riskAssessment.score) {
          return b.riskAssessment.score - a.riskAssessment.score;
        }
        return a.reviewedAt.getTime() - b.reviewedAt.getTime();
      });
  }
}
