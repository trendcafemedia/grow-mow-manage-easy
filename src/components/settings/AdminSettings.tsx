
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import MockDataToggle from "./MockDataToggle";
import TestDataControl from "./TestDataControl";

interface AdminSettingsProps {
  isAdmin: boolean;
  useMockData: boolean;
  isLoading: boolean;
  isClearingData: boolean;
  onMockDataToggle: (enabled: boolean) => void;
  onClearMockData: () => void;
  onClearTestData: () => void;
}

const AdminSettings = ({
  isAdmin,
  useMockData,
  isLoading,
  isClearingData,
  onMockDataToggle,
  onClearMockData,
  onClearTestData,
}: AdminSettingsProps) => {
  if (!isAdmin) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Developer Settings</CardTitle>
        <CardDescription>
          Advanced settings for development and testing
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert>
          <InfoIcon className="h-4 w-4" />
          <AlertTitle>Administrator Access</AlertTitle>
          <AlertDescription>
            These settings are only visible to administrators and should be used with caution.
          </AlertDescription>
        </Alert>
        
        <MockDataToggle
          useMockData={useMockData}
          isLoading={isLoading}
          isClearingData={isClearingData}
          onMockDataToggle={onMockDataToggle}
          onClearMockData={onClearMockData}
        />
        
        <Separator />
        
        <TestDataControl
          isClearingData={isClearingData}
          onClearTestData={onClearTestData}
        />
      </CardContent>
    </Card>
  );
};

export default AdminSettings;
