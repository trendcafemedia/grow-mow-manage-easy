
import { Button } from "@/components/ui/button";
import { Trash, Loader2 } from "lucide-react";

interface TestDataControlProps {
  isClearingData: boolean;
  onClearTestData: () => void;
}

const TestDataControl = ({
  isClearingData,
  onClearTestData,
}: TestDataControlProps) => {
  return (
    <div className="pt-2">
      <Button 
        variant="destructive" 
        onClick={onClearTestData}
        disabled={isClearingData}
      >
        <Trash className="h-4 w-4 mr-2" />
        Clear Test Data
      </Button>
      <p className="text-sm text-muted-foreground mt-2">
        Removes all test fixtures from the database. Use this before adding real data.
      </p>
    </div>
  );
};

export default TestDataControl;
