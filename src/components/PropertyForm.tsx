
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { PropertyData } from '@/types/property';

interface PropertyFormProps {
  property: PropertyData;
  onChange: (property: PropertyData) => void;
}

const PropertyForm = ({ property, onChange }: PropertyFormProps) => {
  const handleChange = (field: keyof PropertyData, value: string | number) => {
    onChange({
      ...property,
      [field]: value,
    });
  };

  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <div className="space-y-4">
        <h3 className="font-semibold text-gray-800">Property Details</h3>
        <div>
          <Label htmlFor="name">Property Name</Label>
          <Input
            id="name"
            placeholder="e.g., Downtown Apartment"
            value={property.name}
            onChange={(e) => handleChange('name', e.target.value)}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="purchasePrice">Purchase Price ($)</Label>
          <Input
            id="purchasePrice"
            type="number"
            placeholder="300,000"
            value={property.purchasePrice || ''}
            onChange={(e) => handleChange('purchasePrice', Number(e.target.value) || 0)}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="monthlyRent">Monthly Rent ($)</Label>
          <Input
            id="monthlyRent"
            type="number"
            placeholder="2,500"
            value={property.monthlyRent || ''}
            onChange={(e) => handleChange('monthlyRent', Number(e.target.value) || 0)}
            className="mt-1"
          />
        </div>
      </div>

      <Separator />

      {/* Expenses */}
      <div className="space-y-4">
        <h3 className="font-semibold text-gray-800">Annual Expenses</h3>
        <div>
          <Label htmlFor="annualExpenses">Total Annual Expenses ($)</Label>
          <Input
            id="annualExpenses"
            type="number"
            placeholder="5,000"
            value={property.annualExpenses || ''}
            onChange={(e) => handleChange('annualExpenses', Number(e.target.value) || 0)}
            className="mt-1"
          />
          <p className="text-xs text-gray-500 mt-1">
            Include property tax, insurance, maintenance, management fees
          </p>
        </div>
        <div>
          <Label htmlFor="renovationCost">Renovation Cost ($)</Label>
          <Input
            id="renovationCost"
            type="number"
            placeholder="15,000"
            value={property.renovationCost || ''}
            onChange={(e) => handleChange('renovationCost', Number(e.target.value) || 0)}
            className="mt-1"
          />
        </div>
      </div>

      <Separator />

      {/* Financing */}
      <div className="space-y-4">
        <h3 className="font-semibold text-gray-800">Financing (Optional)</h3>
        <div>
          <Label htmlFor="downPayment">Down Payment ($)</Label>
          <Input
            id="downPayment"
            type="number"
            placeholder="60,000"
            value={property.downPayment || ''}
            onChange={(e) => handleChange('downPayment', Number(e.target.value) || 0)}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="loanAmount">Loan Amount ($)</Label>
          <Input
            id="loanAmount"
            type="number"
            placeholder="240,000"
            value={property.loanAmount || ''}
            onChange={(e) => handleChange('loanAmount', Number(e.target.value) || 0)}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="interestRate">Interest Rate (%)</Label>
          <Input
            id="interestRate"
            type="number"
            step="0.1"
            placeholder="4.5"
            value={property.interestRate || ''}
            onChange={(e) => handleChange('interestRate', Number(e.target.value) || 0)}
            className="mt-1"
          />
        </div>
      </div>

      <Separator />

      {/* Additional Settings */}
      <div className="space-y-4">
        <h3 className="font-semibold text-gray-800">Additional Settings</h3>
        <div>
          <Label htmlFor="occupancyRate">Occupancy Rate (%)</Label>
          <Input
            id="occupancyRate"
            type="number"
            placeholder="95"
            value={property.occupancyRate || ''}
            onChange={(e) => handleChange('occupancyRate', Number(e.target.value) || 100)}
            className="mt-1"
          />
          <p className="text-xs text-gray-500 mt-1">
            Expected percentage of time property is occupied
          </p>
        </div>
      </div>
    </div>
  );
};

export default PropertyForm;
