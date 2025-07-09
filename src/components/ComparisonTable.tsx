
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, TrendingUp, TrendingDown } from 'lucide-react';
import { PropertyData, CalculationResults } from '@/types/property';

interface ComparisonTableProps {
  properties: (PropertyData & CalculationResults)[];
  onRemove: (index: number) => void;
}

const ComparisonTable = ({ properties, onRemove }: ComparisonTableProps) => {
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

  const getBestProperty = (metric: keyof CalculationResults) => {
    if (properties.length === 0) return null;
    return properties.reduce((best, current) => {
      if (metric === 'annualCashFlow' || metric === 'monthlyCashFlow') {
        return current[metric] > best[metric] ? current : best;
      }
      return current[metric] > best[metric] ? current : best;
    });
  };

  const bestGrossYield = getBestProperty('grossRentalYield');
  const bestNetYield = getBestProperty('netRentalYield');
  const bestROI = getBestProperty('roi');
  const bestCashFlow = getBestProperty('annualCashFlow');

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="min-w-[150px] font-semibold">Property</TableHead>
            <TableHead className="text-right font-semibold">Purchase Price</TableHead>
            <TableHead className="text-right font-semibold">Monthly Rent</TableHead>
            <TableHead className="text-right font-semibold">Gross Yield</TableHead>
            <TableHead className="text-right font-semibold">Net Yield</TableHead>
            <TableHead className="text-right font-semibold">ROI</TableHead>
            <TableHead className="text-right font-semibold">Annual Cash Flow</TableHead>
            <TableHead className="text-right font-semibold">Monthly Cash Flow</TableHead>
            <TableHead className="text-right font-semibold">Cap Rate</TableHead>
            <TableHead className="text-center font-semibold">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {properties.map((property, index) => (
            <TableRow key={index} className="hover:bg-gray-50">
              <TableCell className="font-medium">
                <div>
                  <div className="font-semibold text-gray-900">{property.name}</div>
                  <div className="text-sm text-gray-500">
                    {property.occupancyRate}% occupancy
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-right">
                {formatCurrency(property.purchasePrice)}
              </TableCell>
              <TableCell className="text-right">
                {formatCurrency(property.monthlyRent)}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  {formatPercentage(property.grossRentalYield)}
                  {bestGrossYield?.name === property.name && (
                    <Badge variant="outline" className="text-green-600 border-green-600">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      Best
                    </Badge>
                  )}
                </div>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  {formatPercentage(property.netRentalYield)}
                  {bestNetYield?.name === property.name && (
                    <Badge variant="outline" className="text-green-600 border-green-600">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      Best
                    </Badge>
                  )}
                </div>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  {formatPercentage(property.roi)}
                  {bestROI?.name === property.name && (
                    <Badge variant="outline" className="text-green-600 border-green-600">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      Best
                    </Badge>
                  )}
                </div>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <span className={property.annualCashFlow >= 0 ? 'text-green-600' : 'text-red-600'}>
                    {formatCurrency(property.annualCashFlow)}
                  </span>
                  {bestCashFlow?.name === property.name && property.annualCashFlow >= 0 && (
                    <Badge variant="outline" className="text-green-600 border-green-600">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      Best
                    </Badge>
                  )}
                </div>
              </TableCell>
              <TableCell className="text-right">
                <span className={property.monthlyCashFlow >= 0 ? 'text-green-600' : 'text-red-600'}>
                  {formatCurrency(property.monthlyCashFlow)}
                </span>
              </TableCell>
              <TableCell className="text-right">
                {formatPercentage(property.capRate)}
              </TableCell>
              <TableCell className="text-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onRemove(index)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      {properties.length > 1 && (
        <div className="p-4 bg-gray-50 border-t">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="text-center">
              <div className="font-medium text-gray-600">Best Gross Yield</div>
              <div className="font-semibold text-green-600">
                {bestGrossYield?.name} ({formatPercentage(bestGrossYield?.grossRentalYield || 0)})
              </div>
            </div>
            <div className="text-center">
              <div className="font-medium text-gray-600">Best Net Yield</div>
              <div className="font-semibold text-green-600">
                {bestNetYield?.name} ({formatPercentage(bestNetYield?.netRentalYield || 0)})
              </div>
            </div>
            <div className="text-center">
              <div className="font-medium text-gray-600">Best ROI</div>
              <div className="font-semibold text-green-600">
                {bestROI?.name} ({formatPercentage(bestROI?.roi || 0)})
              </div>
            </div>
            <div className="text-center">
              <div className="font-medium text-gray-600">Best Cash Flow</div>
              <div className="font-semibold text-green-600">
                {bestCashFlow?.name} ({formatCurrency(bestCashFlow?.annualCashFlow || 0)})
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ComparisonTable;
