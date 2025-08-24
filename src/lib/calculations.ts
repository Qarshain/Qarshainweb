export function calculateLoanDetails(amount: number, months: number) {
  const platformFee = amount * 0.025;
  const investorReturn = amount * (0.03 + Math.random() * 0.05); // Random return between 3-8%
  const totalRepayment = amount + platformFee + investorReturn;
  const monthlyPayment = totalRepayment / months;
  return {
    platformFee: Math.round(platformFee),
    investorReturn: Math.round(investorReturn),
    totalRepayment: Math.round(totalRepayment),
    monthlyPayment: Math.round(monthlyPayment),
  };
}