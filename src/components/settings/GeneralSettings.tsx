
import { useState, useRef } from "react";
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
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
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
          logo_url: logoUrl
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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `logos/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('business-assets')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('business-assets')
        .getPublicUrl(filePath);

      setLogoUrl(data.publicUrl);
      toast({
        title: "Logo uploaded",
        description: "Your new logo has been uploaded successfully.",
      });
      
      if (onLogoUpload) onLogoUpload();
    } catch (error) {
      console.error('Error uploading logo:', error);
      toast({
        title: "Upload failed",
        description: "Failed to upload logo. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleLogoButtonClick = () => {
    fileInputRef.current?.click();
  };

  const InfoTooltip = ({ content }: { content: string }) => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger type="button" className="ml-2">
          <InfoIcon className="h-4 w-4 text-muted-foreground" />
        </TooltipTrigger>
        <TooltipContent>
          <p className="max-w-xs">{content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center">
          <Label htmlFor="businessName">Business Name</Label>
          <InfoTooltip content="Your full business name as it appears on invoices and marketing materials." />
        </div>
        <Input 
          id="businessName" 
          placeholder="Enter your business name (e.g., You Grow I Mow)" 
          value={businessName}
          onChange={(e) => setBusinessName(e.target.value)}
          className="border-[#888888] hover:border-primary focus:border-primary"
          required
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <div className="flex items-center">
            <Label htmlFor="email">Business Email</Label>
            <InfoTooltip content="Email where customers can reach you for inquiries." />
          </div>
          <Input 
            id="email" 
            type="email" 
            placeholder="Enter your business contact email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border-[#888888] hover:border-primary focus:border-primary"
            required
            pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
            title="Please enter a valid email address"
          />
        </div>
        <div className="space-y-2">
          <div className="flex items-center">
            <Label htmlFor="phone">Business Phone</Label>
            <InfoTooltip content="Main contact number for your business." />
          </div>
          <Input 
            id="phone" 
            type="tel"
            placeholder="Enter your business phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="border-[#888888] hover:border-primary focus:border-primary"
            pattern="[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}"
            title="Please enter a valid phone number"
            required
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center">
          <Label htmlFor="address">Business Address</Label>
          <InfoTooltip content="Your primary business location for service area and weather forecasting." />
        </div>
        <AddressAutocomplete
          id="address"
          value={address}
          onChange={(value) => setAddress(value)}
          placeholder="Start typing your full business address"
          required
        />
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center">
          <Label htmlFor="logo">Logo</Label>
          <InfoTooltip content="Upload a square logo for your business profile and invoices." />
        </div>
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center text-3xl">
            {logoUrl ? (
              <img src={logoUrl} alt="Business Logo" className="h-16 w-16 rounded-full object-cover" />
            ) : (
              <span>🌱</span>
            )}
          </div>
          <input 
            type="file" 
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/*"
            className="hidden"
          />
          <Button type="button" variant="outline" onClick={handleLogoButtonClick}>
            Upload New Logo
          </Button>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center">
          <Label htmlFor="defaultTax">Default Tax Rate (%)</Label>
          <InfoTooltip content="The default tax rate applied to services in your area." />
        </div>
        <Input 
          id="defaultTax" 
          type="number" 
          placeholder="Enter your local sales tax rate" 
          value={defaultTaxRate}
          onChange={(e) => setDefaultTaxRate(Number(e.target.value))}
          className="border-[#888888] hover:border-primary focus:border-primary"
          step="0.01"
          min="0"
          max="100"
          required
        />
      </div>

      <Button type="submit" className="w-full" disabled={isSaving}>
        {isSaving ? "Saving..." : "Save Business Profile"}
      </Button>
    </form>
  );
};

export default GeneralSettings;
