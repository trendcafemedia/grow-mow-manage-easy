
import { Switch } from "@/components/ui/switch";

interface ThemeSettingsProps {
  darkMode: boolean;
  inventoryEnabled: boolean;
  onDarkModeToggle: (enabled: boolean) => void;
  onInventoryToggle: (enabled: boolean) => void;
}

const ThemeSettings = ({
  darkMode,
  inventoryEnabled,
  onDarkModeToggle,
  onInventoryToggle,
}: ThemeSettingsProps) => {
  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-medium">Enable Inventory Management</h3>
          <p className="text-sm text-muted-foreground">Track inventory items and fuel logs</p>
        </div>
        <Switch checked={inventoryEnabled} onCheckedChange={onInventoryToggle} />
      </div>
      
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-medium">Dark Mode</h3>
          <p className="text-sm text-muted-foreground">Use dark theme throughout the app</p>
        </div>
        <Switch checked={darkMode} onCheckedChange={onDarkModeToggle} />
      </div>
    </>
  );
};

export default ThemeSettings;
