
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AddressAutocomplete } from "@/components/AddressAutocomplete";
import { InfoIcon } from "lucide-react";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";

interface BusinessInfoFormProps {
  businessName: string;
  email: string;
  phone: string;
  address: string;
  onBusinessNameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onPhoneChange: (value: string) => void;
  onAddressChange: (value: string) => void;
}

const BusinessInfoForm = ({
  businessName,
  email,
  phone,
  address,
  onBusinessNameChange,
  onEmailChange,
  onPhoneChange,
  onAddressChange,
}: BusinessInfoFormProps) => {
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
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center">
          <Label htmlFor="businessName">Business Name</Label>
          <InfoTooltip content="Your full business name as it appears on invoices and marketing materials." />
        </div>
        <Input 
          id="businessName" 
          placeholder="Enter your business name (e.g., You Grow I Mow)" 
          value={businessName}
          onChange={(e) => onBusinessNameChange(e.target.value)}
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
            onChange={(e) => onEmailChange(e.target.value)}
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
            onChange={(e) => onPhoneChange(e.target.value)}
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
          onChange={onAddressChange}
          placeholder="Start typing your full business address"
          required
        />
      </div>
    </div>
  );
};

export default BusinessInfoForm;
