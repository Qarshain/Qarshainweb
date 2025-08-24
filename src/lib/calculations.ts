export function calculateLoanDetails(amount: number, months: number) {
  const platformFee = amount * 0.025;
  const totalRepayment = amount + platformFee;
  const monthlyPayment = totalRepayment / months;
  return {
    platformFee: Math.round(platformFee),
    investorReturn: 0, // No investor return
    totalRepayment: Math.round(totalRepayment),
    monthlyPayment: Math.round(monthlyPayment),
  };
}