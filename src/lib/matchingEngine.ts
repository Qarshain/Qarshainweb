export interface LoanRequest {
  id: string;
  userId: string;
  amount: number;
  repaymentPeriod: number;
  purpose: string;
  risk: 'low' | 'medium' | 'high';
  status: 'pending' | 'approved' | 'rejected' | 'funded' | 'active' | 'completed';
  submittedAt: Date;
  borrowerRating: number;
  category: string;
}

export interface Lender {
  id: string;
  userId: string;
  availableAmount: number;
  riskPreference: 'low' | 'medium' | 'high';
  preferredTerms: number[];
  maxAmount: number;
  minAmount: number;
  rating: number;
}

export interface Match {
  loanRequestId: string;
  lenderId: string;
  amount: number;
  matchScore: number;
  riskCompatibility: number;
  termCompatibility: number;
  amountCompatibility: number;
}

export interface RiskAssessment {
  score: number;
  level: 'low' | 'medium' | 'high';
  factors: string[];
  recommendations: string[];
}

export class MatchingEngine {
  /**
   * Calculate risk assessment for a loan request
   */
  static calculateRiskAssessment(loanRequest: LoanRequest, borrowerHistory: any): RiskAssessment {
    let riskScore = 50; // Base score
    const factors: string[] = [];
    const recommendations: string[] = [];

    // Amount-based risk (higher amounts = higher risk)
    if (loanRequest.amount > 3000) {
      riskScore += 20;
      factors.push('High loan amount');
    } else if (loanRequest.amount > 1500) {
      riskScore += 10;
      factors.push('Medium loan amount');
    }

    // Term-based risk (longer terms = higher risk)
    if (loanRequest.repaymentPeriod > 6) {
      riskScore += 15;
      factors.push('Long repayment period');
    }

    // Purpose-based risk
    const highRiskPurposes = ['business', 'investment', 'debt_consolidation'];
    if (highRiskPurposes.includes(loanRequest.purpose.toLowerCase())) {
      riskScore += 15;
      factors.push('High-risk purpose');
    }

    // Borrower rating impact
    if (loanRequest.borrowerRating < 3.0) {
      riskScore += 20;
      factors.push('Low borrower rating');
      recommendations.push('Consider requiring additional collateral');
    } else if (loanRequest.borrowerRating > 4.5) {
      riskScore -= 15;
      factors.push('High borrower rating');
    }

    // History-based risk (if available)
    if (borrowerHistory) {
      if (borrowerHistory.defaultedLoans > 0) {
        riskScore += 25;
        factors.push('Previous loan defaults');
        recommendations.push('Require higher interest rate or collateral');
      }
      if (borrowerHistory.latePayments > 2) {
        riskScore += 15;
        factors.push('Multiple late payments');
      }
    }

    // Determine risk level
    let riskLevel: 'low' | 'medium' | 'high';
    if (riskScore < 40) {
      riskLevel = 'low';
    } else if (riskScore < 70) {
      riskLevel = 'medium';
    } else {
      riskLevel = 'high';
    }

    // Add recommendations based on risk level
    if (riskLevel === 'high') {
      recommendations.push('Consider requiring co-signer');
      recommendations.push('Implement stricter payment monitoring');
    } else if (riskLevel === 'medium') {
      recommendations.push('Regular payment reminders');
    }

    return {
      score: Math.min(100, Math.max(0, riskScore)),
      level: riskLevel,
      factors,
      recommendations
    };
  }

  /**
   * Find potential matches for a loan request
   */
  static findMatches(loanRequest: LoanRequest, availableLenders: Lender[]): Match[] {
    const matches: Match[] = [];

    for (const lender of availableLenders) {
      // Check basic compatibility
      if (!this.isBasicCompatible(loanRequest, lender)) {
        continue;
      }

      // Calculate match score
      const matchScore = this.calculateMatchScore(loanRequest, lender);
      
      // Only include matches above threshold
      if (matchScore > 0.3) {
        const match: Match = {
          loanRequestId: loanRequest.id,
          lenderId: lender.id,
          amount: Math.min(loanRequest.amount, lender.availableAmount),
          matchScore,
          riskCompatibility: this.calculateRiskCompatibility(loanRequest, lender),
          termCompatibility: this.calculateTermCompatibility(loanRequest, lender),
          amountCompatibility: this.calculateAmountCompatibility(loanRequest, lender)
        };
        
        matches.push(match);
      }
    }

    // Sort by match score (highest first)
    return matches.sort((a, b) => b.matchScore - a.matchScore);
  }

  /**
   * Check basic compatibility between loan request and lender
   */
  private static isBasicCompatible(loanRequest: LoanRequest, lender: Lender): boolean {
    // Check amount compatibility
    if (loanRequest.amount < lender.minAmount || loanRequest.amount > lender.maxAmount) {
      return false;
    }

    // Check if lender has sufficient funds
    if (lender.availableAmount < lender.minAmount) {
      return false;
    }

    return true;
  }

  /**
   * Calculate overall match score (0-1)
   */
  private static calculateMatchScore(loanRequest: LoanRequest, lender: Lender): number {
    const riskCompatibility = this.calculateRiskCompatibility(loanRequest, lender);
    const termCompatibility = this.calculateTermCompatibility(loanRequest, lender);
    const amountCompatibility = this.calculateAmountCompatibility(loanRequest, lender);
    const ratingCompatibility = this.calculateRatingCompatibility(loanRequest, lender);

    // Weighted average of compatibility scores
    return (
      riskCompatibility * 0.4 +
      termCompatibility * 0.25 +
      amountCompatibility * 0.2 +
      ratingCompatibility * 0.15
    );
  }

  /**
   * Calculate risk compatibility (0-1)
   */
  private static calculateRiskCompatibility(loanRequest: LoanRequest, lender: Lender): number {
    const riskLevels = { low: 1, medium: 2, high: 3 };
    const requestRisk = riskLevels[loanRequest.risk];
    const lenderPreference = riskLevels[lender.riskPreference];

    // Perfect match
    if (requestRisk === lenderPreference) return 1.0;
    
    // Adjacent levels
    if (Math.abs(requestRisk - lenderPreference) === 1) return 0.7;
    
    // Opposite levels
    return 0.3;
  }

  /**
   * Calculate term compatibility (0-1)
   */
  private static calculateTermCompatibility(loanRequest: LoanRequest, lender: Lender): number {
    if (lender.preferredTerms.includes(loanRequest.repaymentPeriod)) {
      return 1.0;
    }
    
    // Check if term is within acceptable range
    const minPreferred = Math.min(...lender.preferredTerms);
    const maxPreferred = Math.max(...lender.preferredTerms);
    
    if (loanRequest.repaymentPeriod >= minPreferred && loanRequest.repaymentPeriod <= maxPreferred) {
      return 0.8;
    }
    
    // Check if term is close to preferred range
    const closestPreferred = lender.preferredTerms.reduce((prev, curr) => 
      Math.abs(curr - loanRequest.repaymentPeriod) < Math.abs(prev - loanRequest.repaymentPeriod) ? curr : prev
    );
    
    const difference = Math.abs(loanRequest.repaymentPeriod - closestPreferred);
    if (difference <= 2) return 0.6;
    if (difference <= 4) return 0.4;
    
    return 0.2;
  }

  /**
   * Calculate amount compatibility (0-1)
   */
  private static calculateAmountCompatibility(loanRequest: LoanRequest, lender: Lender): number {
    const amount = loanRequest.amount;
    
    // Perfect amount for lender
    if (amount >= lender.minAmount && amount <= lender.maxAmount) {
      return 1.0;
    }
    
    // Amount too small
    if (amount < lender.minAmount) {
      return 0.3;
    }
    
    // Amount too large
    if (amount > lender.maxAmount) {
      return 0.1;
    }
    
    return 0.5;
  }

  /**
   * Calculate rating compatibility (0-1)
   */
  private static calculateRatingCompatibility(loanRequest: LoanRequest, lender: Lender): number {
    const ratingDiff = Math.abs(loanRequest.borrowerRating - lender.rating);
    
    if (ratingDiff <= 0.5) return 1.0;
    if (ratingDiff <= 1.0) return 0.8;
    if (ratingDiff <= 1.5) return 0.6;
    if (ratingDiff <= 2.0) return 0.4;
    
    return 0.2;
  }

  /**
   * Execute a match (create investment)
   */
  static async executeMatch(match: Match, loanRequest: LoanRequest, lender: Lender): Promise<boolean> {
    try {
      // This would typically involve:
      // 1. Creating an investment record
      // 2. Updating loan request status
      // 3. Updating lender available amount
      // 4. Creating transaction records
      // 5. Sending notifications
      
      return true;
    } catch (error) {
      console.error('Error executing match:', error);
      return false;
    }
  }
}
