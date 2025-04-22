import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon, Trash } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { generateMockCustomers, seedTestCustomers, seedTestServices, clearMockData, clearTestData } from "@/tests/utils/testUtils";

const Settings = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [useMockData, setUseMockData] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isClearingData, setIsClearingData] = useState(false);
  const [isMockDataDialogOpen, setIsMockDataDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data } = await supabase
            .from('users')
            .select('role')
            .eq('id', user.id)
            .single();
          
          setIsAdmin(data?.role === 'admin' || import.meta.env.DEV);
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
        if (import.meta.env.DEV) {
          setIsAdmin(true);
        }
      }
    };

    checkAdminStatus();
  }, []);

  const handleMockDataToggle = async (enabled: boolean) => {
    setUseMockData(enabled);
    
    if (enabled) {
      setIsLoading(true);
      try {
        const mockCustomers = generateMockCustomers(15);
        
        await seedTestCustomers(mockCustomers);
        
        for (const customer of mockCustomers) {
          await seedTestServices(customer.id, 2);
        }
        
        toast({
          title: "Mock data created",
          description: "15 mock customers have been added to your database",
        });
      } catch (error) {
        console.error('Error seeding mock data:', error);
        toast({
          title: "Error",
          description: "Failed to create mock data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleClearMockData = async () => {
    setIsClearingData(true);
    try {
      await clearMockData();
      toast({
        title: "Mock data cleared",
        description: "All mock customer data has been removed",
      });
      setUseMockData(false);
    } catch (error) {
      console.error('Error clearing mock data:', error);
      toast({
        title: "Error",
        description: "Failed to clear mock data",
        variant: "destructive",
      });
    } finally {
      setIsClearingData(false);
      setIsMockDataDialogOpen(false);
    }
  };

  const handleClearTestData = async () => {
    setIsClearingData(true);
    try {
      await clearTestData();
      toast({
        title: "Test data cleared",
        description: "All test data has been removed from the database",
      });
    } catch (error) {
      console.error('Error clearing test data:', error);
      toast({
        title: "Error",
        description: "Failed to clear test data",
        variant: "destructive",
      });
    } finally {
      setIsClearingData(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <Button>Save Changes</Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Business Profile</CardTitle>
          <CardDescription>
            Update your business information and settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="businessName">Business Name</Label>
            <Input id="businessName" placeholder="Your Business Name" defaultValue="You Grow I Mow" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="your@email.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" placeholder="(555) 123-4567" />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="address">Business Address</Label>
            <Textarea id="address" placeholder="123 Main St, Anytown, USA" />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="logo">Logo</Label>
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center text-3xl">
                🌱
              </div>
              <Button variant="outline">Upload New Logo</Button>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="defaultTax">Default Tax Rate (%)</Label>
            <Input id="defaultTax" type="number" placeholder="8.25" defaultValue="7.5" />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>App Settings</CardTitle>
          <CardDescription>
            Customize your app experience
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Enable Stripe Payments</h3>
              <p className="text-sm text-muted-foreground">Allow customers to pay with credit card</p>
            </div>
            <Switch defaultChecked />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Enable Inventory Management</h3>
              <p className="text-sm text-muted-foreground">Track inventory items and fuel logs</p>
            </div>
            <Switch defaultChecked />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Dark Mode</h3>
              <p className="text-sm text-muted-foreground">Use dark theme throughout the app</p>
            </div>
            <Switch />
          </div>
        </CardContent>
      </Card>
      
      {isAdmin && (
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
                  onCheckedChange={handleMockDataToggle}
                  disabled={isLoading}
                />
                {useMockData && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setIsMockDataDialogOpen(true)}
                    disabled={isClearingData}
                  >
                    <Trash className="h-4 w-4 mr-2" />
                    Clear Mock Data
                  </Button>
                )}
              </div>
            </div>
            
            <Dialog open={isMockDataDialogOpen} onOpenChange={setIsMockDataDialogOpen}>
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
                    onClick={() => setIsMockDataDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleClearMockData}
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

            <Separator />
            
            <div className="pt-2">
              <Button 
                variant="destructive" 
                onClick={handleClearTestData}
                disabled={isClearingData}
              >
                <Trash className="h-4 w-4 mr-2" />
                Clear Test Data
              </Button>
              <p className="text-sm text-muted-foreground mt-2">
                Removes all test fixtures from the database. Use this before adding real data.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Settings;
