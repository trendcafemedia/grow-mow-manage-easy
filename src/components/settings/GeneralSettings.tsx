
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import BusinessInfoForm from "./BusinessInfoForm";
import LogoUpload from "./LogoUpload";
import TaxSettings from "./TaxSettings";

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

  const handleFileUpload = async (file: File) => {
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <BusinessInfoForm
        businessName={businessName}
        email={email}
        phone={phone}
        address={address}
        onBusinessNameChange={setBusinessName}
        onEmailChange={setEmail}
        onPhoneChange={setPhone}
        onAddressChange={setAddress}
      />
      
      <LogoUpload
        logoUrl={logoUrl}
        onFileSelect={handleFileUpload}
      />
      
      <TaxSettings
        defaultTaxRate={defaultTaxRate}
        onTaxRateChange={setDefaultTaxRate}
      />

      <Button type="submit" className="w-full" disabled={isSaving}>
        {isSaving ? "Saving..." : "Save Business Profile"}
      </Button>
    </form>
  );
};

export default GeneralSettings;
