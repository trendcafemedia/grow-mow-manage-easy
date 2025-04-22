
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface GeneralSettingsProps {
  businessName: string;
  email: string;
  phone: string;
  address: string;
  defaultTaxRate: number;
  onLogoUpload: () => void;
}

const GeneralSettings = ({
  businessName,
  email,
  phone,
  address,
  defaultTaxRate,
  onLogoUpload,
}: GeneralSettingsProps) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="businessName">Business Name</Label>
        <Input 
          id="businessName" 
          placeholder="Your Business Name" 
          defaultValue={businessName} 
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input 
            id="email" 
            type="email" 
            placeholder="your@email.com"
            defaultValue={email} 
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input 
            id="phone" 
            placeholder="(555) 123-4567"
            defaultValue={phone} 
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="address">Business Address</Label>
        <Textarea 
          id="address" 
          placeholder="123 Main St, Anytown, USA"
          defaultValue={address}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="logo">Logo</Label>
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center text-3xl">
            🌱
          </div>
          <Button variant="outline" onClick={onLogoUpload}>
            Upload New Logo
          </Button>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="defaultTax">Default Tax Rate (%)</Label>
        <Input 
          id="defaultTax" 
          type="number" 
          placeholder="8.25" 
          defaultValue={defaultTaxRate}
        />
      </div>
    </>
  );
};

export default GeneralSettings;
