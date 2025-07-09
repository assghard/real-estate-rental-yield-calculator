
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calculator, Building, TrendingUp, Download, Plus } from 'lucide-react';
import PropertyForm from './PropertyForm';
import ResultsDisplay from './ResultsDisplay';
import ComparisonTable from './ComparisonTable';
import { PropertyData, CalculationResults } from '@/types/property';
import { calculateRentalMetrics } from '@/utils/rentalCalculations';
import { toast } from '@/hooks/use-toast';

const RentalYieldCalculator = () => {
  const [properties, setProperties] = useState<(PropertyData & CalculationResults)[]>([]);
  const [currentProperty, setCurrentProperty] = useState<PropertyData>({
    name: '',
    purchasePrice: 0,
    monthlyRent: 0,
    annualExpenses: 0,
    renovationCost: 0,
    downPayment: 0,
    loanAmount: 0,
    interestRate: 0,
    occupancyRate: 100,
  });

  const handleCalculate = () => {
    if (!currentProperty.name || currentProperty.purchasePrice <= 0 || currentProperty.monthlyRent <= 0) {
      toast({
        title: "Missing Information",
        description: "Please fill in property name, purchase price, and monthly rent.",
        variant: "destructive",
      });
      return;
    }

    const results = calculateRentalMetrics(currentProperty);
    const propertyWithResults = { ...currentProperty, ...results };
    
    setProperties(prev => [...prev, propertyWithResults]);
    setCurrentProperty({
      name: '',
      purchasePrice: 0,
      monthlyRent: 0,
      annualExpenses: 0,
      renovationCost: 0,
      downPayment: 0,
      loanAmount: 0,
      interestRate: 0,
      occupancyRate: 100,
    });

    toast({
      title: "Property Added",
      description: `${propertyWithResults.name} has been calculated and added to comparison.`,
    });
  };

  const handleRemoveProperty = (index: number) => {
    setProperties(prev => prev.filter((_, i) => i !== index));
  };

  const handleExportPDF = () => {
    toast({
      title: "PDF Export",
      description: "PDF export functionality would be implemented here.",
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 rounded-full gradient-bg">
            <Building className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
            Rental Yield Calculator
          </h1>
        </div>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Analyze rental property performance, calculate ROI, and compare multiple investments 
          to make informed real estate decisions.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Property Input Form */}
        <div className="xl:col-span-1">
          <Card className="sticky top-8 shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="gradient-bg text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Property Calculator
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <PropertyForm
                property={currentProperty}
                onChange={setCurrentProperty}
              />
              <Button 
                onClick={handleCalculate}
                className="w-full mt-6 gradient-bg text-white hover:opacity-90 transition-opacity"
                size="lg"
              >
                <Plus className="h-4 w-4 mr-2" />
                Calculate & Add Property
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Results and Comparison */}
        <div className="xl:col-span-2 space-y-8">
          {/* Quick Results Preview */}
          {currentProperty.purchasePrice > 0 && currentProperty.monthlyRent > 0 && (
            <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Live Preview
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <ResultsDisplay results={calculateRentalMetrics(currentProperty)} />
              </CardContent>
            </Card>
          )}

          {/* Comparison Table */}
          {properties.length > 0 && (
            <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-t-lg">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Building className="h-5 w-5" />
                    Property Comparison ({properties.length})
                  </div>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleExportPDF}
                    className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export PDF
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <ComparisonTable
                  properties={properties}
                  onRemove={handleRemoveProperty}
                />
              </CardContent>
            </Card>
          )}

          {/* Getting Started Guide */}
          {properties.length === 0 && (
            <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-50 to-green-50">
              <CardContent className="p-8 text-center">
                <div className="mb-6">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-500 to-green-500 flex items-center justify-center">
                    <Calculator className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    Start Your Property Analysis
                  </h3>
                  <p className="text-gray-600 max-w-md mx-auto">
                    Enter your property details in the calculator to get comprehensive rental yield metrics, 
                    ROI analysis, and cash flow projections.
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                  <div className="p-4 bg-white/60 rounded-lg">
                    <div className="font-medium text-blue-600 mb-1">Step 1</div>
                    <div>Enter property details and purchase price</div>
                  </div>
                  <div className="p-4 bg-white/60 rounded-lg">
                    <div className="font-medium text-green-600 mb-1">Step 2</div>
                    <div>Add rental income and expenses</div>
                  </div>
                  <div className="p-4 bg-white/60 rounded-lg">
                    <div className="font-medium text-purple-600 mb-1">Step 3</div>
                    <div>Compare multiple properties</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default RentalYieldCalculator;
