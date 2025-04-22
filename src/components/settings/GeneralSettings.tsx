
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AddressAutocomplete } from "@/components/AddressAutocomplete";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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
          placeholder="Your Business Name" 
          value={businessName}
          onChange={(e) => setBusinessName(e.target.value)}
          required
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input 
            id="email" 
            type="email" 
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input 
            id="phone" 
            placeholder="(555) 123-4567"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="address">Business Address</Label>
        <AddressAutocomplete
          id="address"
          value={address}
          onChange={(value) => setAddress(value)}
          placeholder="123 Main St, Anytown, USA"
        />
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
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="defaultTax">Default Tax Rate (%)</Label>
        <Input 
          id="defaultTax" 
          type="number" 
          placeholder="8.25" 
          value={defaultTaxRate}
          onChange={(e) => setDefaultTaxRate(Number(e.target.value))}
          step="0.01"
          min="0"
          max="100"
        />
      </div>

      <Button type="submit" disabled={isSaving}>
        {isSaving ? "Saving..." : "Save Changes"}
      </Button>
    </form>
  );
};

export default GeneralSettings;
