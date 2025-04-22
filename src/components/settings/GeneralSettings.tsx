
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AddressAutocomplete } from "@/components/AddressAutocomplete";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { InfoIcon } from "lucide-react";

interface GeneralSettingsProps {
  businessName: string;
  email: string;
  phone: string;
  address: string;
  defaultTaxRate: number;
  onLogoUpload: () => void;
}

const GeneralSettings = ({
  businessName: initialBusinessName,
  email: initialEmail,
  phone: initialPhone,
  address: initialAddress,
  defaultTaxRate: initialDefaultTaxRate,
  onLogoUpload,
}: GeneralSettingsProps) => {
  const [businessName, setBusinessName] = useState(initialBusinessName);
  const [email, setEmail] = useState(initialEmail);
  const [phone, setPhone] = useState(initialPhone);
  const [address, setAddress] = useState(initialAddress);
  const [defaultTaxRate, setDefaultTaxRate] = useState(initialDefaultTaxRate);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const { error } = await supabase
        .from('business_profiles')
        .update({
          business_name: businessName,
          email,
          phone,
          address,
          default_tax: defaultTaxRate,
        })
        .eq('id', (await supabase.from('business_profiles').select('id').single()).data?.id);

      if (error) throw error;

      toast({
        title: "Settings saved",
        description: "Your business profile has been updated.",
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="businessName">Business Name</Label>
        <Input 
          id="businessName" 
          placeholder="Enter your business name (e.g., You Grow I Mow)" 
          value={businessName}
          onChange={(e) => setBusinessName(e.target.value)}
          required
        />
        <p className="text-sm text-muted-foreground">
          Your full business name as it appears on invoices and marketing materials.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="email">Business Email</Label>
          <Input 
            id="email" 
            type="email" 
            placeholder="Enter your business contact email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
            title="Please enter a valid email address"
          />
          <p className="text-sm text-muted-foreground">
            Email where customers can reach you for inquiries.
          </p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Business Phone</Label>
          <Input 
            id="phone" 
            type="tel"
            placeholder="Enter your business phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            pattern="[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}"
            title="Please enter a valid phone number"
            required
          />
          <p className="text-sm text-muted-foreground">
            Main contact number for your business.
          </p>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="address">Business Address</Label>
        <AddressAutocomplete
          id="address"
          value={address}
          onChange={(value) => setAddress(value)}
          placeholder="Start typing your full business address"
          required
        />
        <p className="text-sm text-muted-foreground">
          Your primary business location for service area and weather forecasting.
        </p>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="logo">Logo</Label>
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center text-3xl">
            🌱
          </div>
          <Button type="button" variant="outline" onClick={onLogoUpload}>
            Upload New Logo
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">
          Upload a square logo for your business profile and invoices.
        </p>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="defaultTax" className="flex items-center gap-2">
          Default Tax Rate (%)
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <InfoIcon className="h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p>The default tax rate applied to services in your area.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </Label>
        <Input 
          id="defaultTax" 
          type="number" 
          placeholder="Enter your local sales tax rate" 
          value={defaultTaxRate}
          onChange={(e) => setDefaultTaxRate(Number(e.target.value))}
          step="0.01"
          min="0"
          max="100"
          required
        />
        <p className="text-sm text-muted-foreground">
          Local sales tax percentage (e.g., 8.25 for 8.25%). Used in service pricing.
        </p>
      </div>

      <Button type="submit" disabled={isSaving}>
        {isSaving ? "Saving..." : "Save Changes"}
      </Button>
    </form>
  );
};

export default GeneralSettings;

