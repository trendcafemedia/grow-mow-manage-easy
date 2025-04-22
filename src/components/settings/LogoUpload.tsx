
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { InfoIcon } from "lucide-react";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";

interface LogoUploadProps {
  logoUrl: string | null;
  onFileSelect: (file: File) => void;
}

const LogoUpload = ({ logoUrl, onFileSelect }: LogoUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogoButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center">
        <Label htmlFor="logo">Logo</Label>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger type="button" className="ml-2">
              <InfoIcon className="h-4 w-4 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-xs">Upload a square logo for your business profile and invoices.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
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
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />
        <Button type="button" variant="outline" onClick={handleLogoButtonClick}>
          Upload New Logo
        </Button>
      </div>
    </div>
  );
};

export default LogoUpload;
