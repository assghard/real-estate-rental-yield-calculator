
export interface PropertyData {
  name: string;
  purchasePrice: number;
  monthlyRent: number;
  annualExpenses: number;
  renovationCost: number;
  downPayment: number;
  loanAmount: number;
  interestRate: number;
  occupancyRate: number;
}

export interface CalculationResults {
  grossRentalYield: number;
  netRentalYield: number;
  roi: number;
  annualCashFlow: number;
  monthlyCashFlow: number;
  capRate: number;
  annualIncome: number;
  breakEvenYears: number;
}
