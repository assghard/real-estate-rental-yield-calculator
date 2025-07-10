
import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calculator, Building, TrendingUp, Download, Plus } from 'lucide-react';
import { jsPDF } from 'jspdf';
import PropertyForm from './PropertyForm';
import ResultsDisplay from './ResultsDisplay';
import ComparisonTable from './ComparisonTable';
import { PropertyData, CalculationResults } from '@/types/property';
import { calculateRentalMetrics } from '@/utils/rentalCalculations';
import { toast } from '@/hooks/use-toast';

const RentalYieldCalculator = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [properties, setProperties] = useState<(PropertyData & CalculationResults)[]>([]);
  const comparisonTableRef = useRef<HTMLDivElement>(null);
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

  // Load values from URL parameters on component mount
  useEffect(() => {
    const urlProperty: PropertyData = {
      name: searchParams.get('name') || '',
      purchasePrice: Number(searchParams.get('purchasePrice')) || 0,
      monthlyRent: Number(searchParams.get('monthlyRent')) || 0,
      annualExpenses: Number(searchParams.get('annualExpenses')) || 0,
      renovationCost: Number(searchParams.get('renovationCost')) || 0,
      downPayment: Number(searchParams.get('downPayment')) || 0,
      loanAmount: Number(searchParams.get('loanAmount')) || 0,
      interestRate: Number(searchParams.get('interestRate')) || 0,
      occupancyRate: Number(searchParams.get('occupancyRate')) || 100,
    };

    // Only update if there are actual values in the URL
    if (Object.values(urlProperty).some(value => value !== '' && value !== 0 && value !== 100)) {
      setCurrentProperty(urlProperty);
    }
  }, []);

  // Update URL when property values change
  useEffect(() => {
    const newParams = new URLSearchParams();
    
    if (currentProperty.name) newParams.set('name', currentProperty.name);
    if (currentProperty.purchasePrice > 0) newParams.set('purchasePrice', currentProperty.purchasePrice.toString());
    if (currentProperty.monthlyRent > 0) newParams.set('monthlyRent', currentProperty.monthlyRent.toString());
    if (currentProperty.annualExpenses > 0) newParams.set('annualExpenses', currentProperty.annualExpenses.toString());
    if (currentProperty.renovationCost > 0) newParams.set('renovationCost', currentProperty.renovationCost.toString());
    if (currentProperty.downPayment > 0) newParams.set('downPayment', currentProperty.downPayment.toString());
    if (currentProperty.loanAmount > 0) newParams.set('loanAmount', currentProperty.loanAmount.toString());
    if (currentProperty.interestRate > 0) newParams.set('interestRate', currentProperty.interestRate.toString());
    if (currentProperty.occupancyRate !== 100) newParams.set('occupancyRate', currentProperty.occupancyRate.toString());

    setSearchParams(newParams, { replace: true });
  }, [currentProperty, setSearchParams]);

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

    // Scroll to comparison table after adding property
    setTimeout(() => {
      comparisonTableRef.current?.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }, 100);
  };

  const handleRemoveProperty = (index: number) => {
    setProperties(prev => prev.filter((_, i) => i !== index));
  };

  const handleExportPDF = () => {
    const doc = new jsPDF('l', 'mm', 'a4'); // Landscape orientation for table
    const primaryColor = '#02073e';
    
    // Header with styling
    doc.setFillColor(primaryColor);
    doc.rect(0, 0, 297, 25, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.text('Property Comparison Report', 20, 16);
    
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 220, 16);
    
    // Reset text color
    doc.setTextColor(0, 0, 0);
    
    let yPos = 40;
    const colWidths = [40, 30, 25, 25, 25, 25, 30, 30, 25, 25, 25];
    const headers = [
      'Property Name',
      'Purchase Price',
      'Monthly Rent',
      'Annual Expenses',
      'Down Payment',
      'Loan Amount',
      'Gross Yield %',
      'Net Yield %',
      'ROI %',
      'Cap Rate %',
      'Monthly Cash Flow'
    ];
    
    // Table header with styling
    doc.setFillColor(primaryColor);
    doc.rect(15, yPos - 5, 267, 10, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8);
    doc.setFont(undefined, 'bold');
    
    let xPos = 20;
    headers.forEach((header, i) => {
      doc.text(header, xPos, yPos);
      xPos += colWidths[i];
    });
    
    yPos += 15;
    doc.setTextColor(0, 0, 0);
    doc.setFont(undefined, 'normal');
    
    // Table rows
    properties.forEach((property, index) => {
      // Alternating row colors
      if (index % 2 === 1) {
        doc.setFillColor(248, 249, 250);
        doc.rect(15, yPos - 5, 267, 10, 'F');
      }
      
      const rowData = [
        property.name,
        `$${(property.purchasePrice / 1000).toFixed(0)}k`,
        `$${property.monthlyRent.toLocaleString()}`,
        `$${(property.annualExpenses / 1000).toFixed(0)}k`,
        `$${(property.downPayment / 1000).toFixed(0)}k`,
        `$${(property.loanAmount / 1000).toFixed(0)}k`,
        `${property.grossRentalYield.toFixed(2)}%`,
        `${property.netRentalYield.toFixed(2)}%`,
        `${property.roi.toFixed(2)}%`,
        `${property.capRate.toFixed(2)}%`,
        `$${property.monthlyCashFlow.toLocaleString()}`
      ];
      
      xPos = 20;
      rowData.forEach((data, i) => {
        doc.text(data.toString(), xPos, yPos);
        xPos += colWidths[i];
      });
      
      yPos += 12;
      
      // Add new page if needed
      if (yPos > 180 && index < properties.length - 1) {
        doc.addPage();
        yPos = 20;
        
        // Repeat header on new page
        doc.setFillColor(primaryColor);
        doc.rect(15, yPos - 5, 267, 10, 'F');
        
        doc.setTextColor(255, 255, 255);
        doc.setFont(undefined, 'bold');
        
        xPos = 20;
        headers.forEach((header, i) => {
          doc.text(header, xPos, yPos);
          xPos += colWidths[i];
        });
        
        yPos += 15;
        doc.setTextColor(0, 0, 0);
        doc.setFont(undefined, 'normal');
      }
    });
    
    // Footer
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFillColor(primaryColor);
      doc.rect(0, 200, 297, 10, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(8);
      doc.text(`Page ${i} of ${pageCount}`, 20, 206);
      doc.text('Generated by Rental Yield Calculator', 220, 206);
    }
    
    // Save the PDF
    doc.save(`property-comparison-${new Date().toISOString().split('T')[0]}.pdf`);
    
    toast({
      title: "PDF Generated",
      description: "Property comparison report has been downloaded.",
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 rounded-full primary-bg">
            <Building className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-primary">
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
            <CardHeader className="primary-bg text-white rounded-t-lg">
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
                className="w-full mt-6 primary-bg text-white hover:opacity-90 transition-opacity"
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
              <CardHeader className="primary-bg text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Live Results
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <ResultsDisplay results={calculateRentalMetrics(currentProperty)} />
              </CardContent>
            </Card>
          )}

          {/* Comparison Table */}
          {properties.length > 0 && (
            <Card ref={comparisonTableRef} className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader className="primary-bg text-white rounded-t-lg">
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
          {properties.length === 0 && !(currentProperty.purchasePrice > 0 && currentProperty.monthlyRent > 0) && (
            <Card className="shadow-lg border-0 bg-gray-50">
              <CardContent className="p-8 text-center">
                <div className="mb-6">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full primary-bg flex items-center justify-center">
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
                    <div className="font-medium text-primary mb-1">Step 1</div>
                    <div>Enter property details and purchase price</div>
                  </div>
                  <div className="p-4 bg-white/60 rounded-lg">
                    <div className="font-medium text-primary mb-1">Step 2</div>
                    <div>Add rental income and expenses</div>
                  </div>
                  <div className="p-4 bg-white/60 rounded-lg">
                    <div className="font-medium text-primary mb-1">Step 3</div>
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
