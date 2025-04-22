
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { InfoIcon } from "lucide-react";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";

interface TaxSettingsProps {
  defaultTaxRate: number;
  onTaxRateChange: (value: number) => void;
}

const TaxSettings = ({ defaultTaxRate, onTaxRateChange }: TaxSettingsProps) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center">
        <Label htmlFor="defaultTax">Default Tax Rate (%)</Label>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger type="button" className="ml-2">
              <InfoIcon className="h-4 w-4 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-xs">The default tax rate applied to services in your area.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <Input 
        id="defaultTax" 
        type="number" 
        placeholder="Enter your local sales tax rate" 
        value={defaultTaxRate}
        onChange={(e) => onTaxRateChange(Number(e.target.value))}
        className="border-[#888888] hover:border-primary focus:border-primary"
        step="0.01"
        min="0"
        max="100"
        required
      />
    </div>
  );
};

export default TaxSettings;
