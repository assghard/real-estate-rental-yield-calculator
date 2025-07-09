
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, DollarSign, Percent, Calendar } from 'lucide-react';
import { CalculationResults } from '@/types/property';

interface ResultsDisplayProps {
  results: CalculationResults;
}

const ResultsDisplay = ({ results }: ResultsDisplayProps) => {
  const getYieldColor = (yield_: number) => {
    if (yield_ >= 8) return 'text-green-600 bg-green-50 border-green-200';
    if (yield_ >= 5) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getRoiColor = (roi: number) => {
    if (roi >= 15) return 'text-green-600 bg-green-50 border-green-200';
    if (roi >= 10) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(2)}%`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Gross Rental Yield */}
      <Card className={`border-2 ${getYieldColor(results.grossRentalYield)}`}>
        <CardContent className="p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <Percent className="h-5 w-5 mr-1" />
            <span className="text-sm font-medium">Gross Yield</span>
          </div>
          <div className="text-2xl font-bold mb-1">
            {formatPercentage(results.grossRentalYield)}
          </div>
          <Badge variant="outline" className="text-xs">
            {results.grossRentalYield >= 6 ? 'Excellent' : results.grossRentalYield >= 4 ? 'Good' : 'Fair'}
          </Badge>
        </CardContent>
      </Card>

      {/* Net Rental Yield */}
      <Card className={`border-2 ${getYieldColor(results.netRentalYield)}`}>
        <CardContent className="p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <TrendingUp className="h-5 w-5 mr-1" />
            <span className="text-sm font-medium">Net Yield</span>
          </div>
          <div className="text-2xl font-bold mb-1">
            {formatPercentage(results.netRentalYield)}
          </div>
          <Badge variant="outline" className="text-xs">
            After Expenses
          </Badge>
        </CardContent>
      </Card>

      {/* ROI */}
      <Card className={`border-2 ${getRoiColor(results.roi)}`}>
        <CardContent className="p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <TrendingUp className="h-5 w-5 mr-1" />
            <span className="text-sm font-medium">ROI</span>
          </div>
          <div className="text-2xl font-bold mb-1">
            {formatPercentage(results.roi)}
          </div>
          <Badge variant="outline" className="text-xs">
            Return on Investment
          </Badge>
        </CardContent>
      </Card>

      {/* Annual Cash Flow */}
      <Card className={`border-2 ${results.annualCashFlow >= 0 ? 'text-green-600 bg-green-50 border-green-200' : 'text-red-600 bg-red-50 border-red-200'}`}>
        <CardContent className="p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            {results.annualCashFlow >= 0 ? (
              <TrendingUp className="h-5 w-5 mr-1" />
            ) : (
              <TrendingDown className="h-5 w-5 mr-1" />
            )}
            <span className="text-sm font-medium">Cash Flow</span>
          </div>
          <div className="text-2xl font-bold mb-1">
            {formatCurrency(results.annualCashFlow)}
          </div>
          <Badge variant="outline" className="text-xs">
            Annual
          </Badge>
        </CardContent>
      </Card>

      {/* Monthly Cash Flow */}
      <Card className="border-2 border-blue-200 bg-blue-50 text-blue-600">
        <CardContent className="p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <Calendar className="h-5 w-5 mr-1" />
            <span className="text-sm font-medium">Monthly CF</span>
          </div>
          <div className="text-2xl font-bold mb-1">
            {formatCurrency(results.monthlyCashFlow)}
          </div>
          <Badge variant="outline" className="text-xs border-blue-300 text-blue-600">
            Per Month
          </Badge>
        </CardContent>
      </Card>

      {/* Annual Income */}
      <Card className="border-2 border-purple-200 bg-purple-50 text-purple-600">
        <CardContent className="p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <DollarSign className="h-5 w-5 mr-1" />
            <span className="text-sm font-medium">Annual Income</span>
          </div>
          <div className="text-2xl font-bold mb-1">
            {formatCurrency(results.annualIncome)}
          </div>
          <Badge variant="outline" className="text-xs border-purple-300 text-purple-600">
            Gross Rental
          </Badge>
        </CardContent>
      </Card>

      {/* Cap Rate */}
      <Card className="border-2 border-indigo-200 bg-indigo-50 text-indigo-600">
        <CardContent className="p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <Percent className="h-5 w-5 mr-1" />
            <span className="text-sm font-medium">Cap Rate</span>
          </div>
          <div className="text-2xl font-bold mb-1">
            {formatPercentage(results.capRate)}
          </div>
          <Badge variant="outline" className="text-xs border-indigo-300 text-indigo-600">
            Market Value
          </Badge>
        </CardContent>
      </Card>

      {/* Break-even */}
      <Card className="border-2 border-gray-200 bg-gray-50 text-gray-600">
        <CardContent className="p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <Calendar className="h-5 w-5 mr-1" />
            <span className="text-sm font-medium">Break-even</span>
          </div>
          <div className="text-2xl font-bold mb-1">
            {results.breakEvenYears.toFixed(1)}
          </div>
          <Badge variant="outline" className="text-xs">
            Years
          </Badge>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResultsDisplay;
