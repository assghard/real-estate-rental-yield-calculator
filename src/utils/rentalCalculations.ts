
import { PropertyData, CalculationResults } from '@/types/property';

export const calculateRentalMetrics = (property: PropertyData): CalculationResults => {
  const {
    purchasePrice,
    monthlyRent,
    annualExpenses,
    renovationCost,
    downPayment,
    loanAmount,
    interestRate,
    occupancyRate,
  } = property;

  // Total investment calculation
  const totalInvestment = purchasePrice + renovationCost;
  
  // Annual income with occupancy rate
  const annualIncome = (monthlyRent * 12 * occupancyRate) / 100;
  
  // Annual mortgage payment (if financed)
  const annualMortgagePayment = loanAmount > 0 && interestRate > 0
    ? calculateMortgagePayment(loanAmount, interestRate, 30) * 12
    : 0;
  
  // Net annual cash flow
  const annualCashFlow = annualIncome - annualExpenses - annualMortgagePayment;
  const monthlyCashFlow = annualCashFlow / 12;
  
  // Gross rental yield
  const grossRentalYield = (annualIncome / totalInvestment) * 100;
  
  // Net rental yield
  const netRentalYield = ((annualIncome - annualExpenses) / totalInvestment) * 100;
  
  // ROI calculation (based on actual cash invested)
  const actualCashInvested = downPayment > 0 ? downPayment + renovationCost : totalInvestment;
  const roi = (annualCashFlow / actualCashInvested) * 100;
  
  // Cap rate (based on purchase price only)
  const capRate = ((annualIncome - annualExpenses) / purchasePrice) * 100;
  
  // Break-even calculation
  const breakEvenYears = actualCashInvested / Math.max(annualCashFlow, 1);

  return {
    grossRentalYield: isFinite(grossRentalYield) ? grossRentalYield : 0,
    netRentalYield: isFinite(netRentalYield) ? netRentalYield : 0,
    roi: isFinite(roi) ? roi : 0,
    annualCashFlow,
    monthlyCashFlow,
    capRate: isFinite(capRate) ? capRate : 0,
    annualIncome,
    breakEvenYears: isFinite(breakEvenYears) ? breakEvenYears : 0,
  };
};

// Calculate monthly mortgage payment using PMT formula
const calculateMortgagePayment = (loanAmount: number, annualRate: number, years: number): number => {
  const monthlyRate = annualRate / 100 / 12;
  const numPayments = years * 12;
  
  if (monthlyRate === 0) return loanAmount / numPayments;
  
  const payment = loanAmount * 
    (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
    (Math.pow(1 + monthlyRate, numPayments) - 1);
  
  return payment;
};
