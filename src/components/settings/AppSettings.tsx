
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import StripeSettings from "./StripeSettings";
import ThemeSettings from "./ThemeSettings";

interface AppSettingsProps {
  stripeEnabled: boolean;
  darkMode: boolean;
  inventoryEnabled: boolean;
  onStripeToggle: (enabled: boolean) => void;
  onDarkModeToggle: (enabled: boolean) => void;
  onInventoryToggle: (enabled: boolean) => void;
}

const AppSettings = ({
  stripeEnabled,
  darkMode,
  inventoryEnabled,
  onStripeToggle,
  onDarkModeToggle,
  onInventoryToggle,
}: AppSettingsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>App Settings</CardTitle>
        <CardDescription>
          Customize your app experience
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <StripeSettings
          stripeEnabled={stripeEnabled}
          onStripeToggle={onStripeToggle}
        />
        
        <ThemeSettings
          darkMode={darkMode}
          inventoryEnabled={inventoryEnabled}
          onDarkModeToggle={onDarkModeToggle}
          onInventoryToggle={onInventoryToggle}
        />
      </CardContent>
    </Card>
  );
};

export default AppSettings;
