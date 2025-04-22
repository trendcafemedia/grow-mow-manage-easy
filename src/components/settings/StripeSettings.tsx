
import { Switch } from "@/components/ui/switch";

interface StripeSettingsProps {
  stripeEnabled: boolean;
  onStripeToggle: (enabled: boolean) => void;
}

const StripeSettings = ({
  stripeEnabled,
  onStripeToggle,
}: StripeSettingsProps) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h3 className="font-medium">Enable Stripe Payments</h3>
        <p className="text-sm text-muted-foreground">Allow customers to pay with credit card</p>
      </div>
      <Switch checked={stripeEnabled} onCheckedChange={onStripeToggle} />
    </div>
  );
};

export default StripeSettings;
