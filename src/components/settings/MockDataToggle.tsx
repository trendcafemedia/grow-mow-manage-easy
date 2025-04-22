
import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Trash, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface MockDataToggleProps {
  useMockData: boolean;
  isLoading: boolean;
  isClearingData: boolean;
  onMockDataToggle: (enabled: boolean) => void;
  onClearMockData: () => void;
}

const MockDataToggle = ({
  useMockData,
  isLoading,
  isClearingData,
  onMockDataToggle,
  onClearMockData,
}: MockDataToggleProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="flex items-center justify-between">
      <div>
        <h3 className="font-medium">Use Mock Data</h3>
        <p className="text-sm text-muted-foreground">
          Seed the database with mock customers around Stafford, VA
        </p>
      </div>
      <div className="flex items-center gap-4">
        <Switch 
          checked={useMockData} 
          onCheckedChange={onMockDataToggle}
          disabled={isLoading}
        />
        {useMockData && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                variant="outline" 
                size="sm"
                disabled={isClearingData}
              >
                <Trash className="h-4 w-4 mr-2" />
                Clear Mock Data
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Clear Mock Data</DialogTitle>
                <DialogDescription>
                  Are you sure you want to clear mock data? This cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    onClearMockData();
                    setIsDialogOpen(false);
                  }}
                  disabled={isClearingData}
                >
                  {isClearingData ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Clearing...
                    </>
                  ) : (
                    "Clear Mock Data"
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
};

export default MockDataToggle;
