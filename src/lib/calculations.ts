export function calculateLoanDetails(amount: number, months: number) {
  const platformFee = amount * 0.025;
  const investorReturn = amount * 0.055; // Fixed return at 5.5% (middle of 3-8% range)
  const totalRepayment = amount + platformFee + investorReturn;
  const monthlyPayment = totalRepayment / months;
  return {
    platformFee: Math.round(platformFee),
    investorReturn: Math.round(investorReturn),
    totalRepayment: Math.round(totalRepayment),
    monthlyPayment: Math.round(monthlyPayment),
  };
}