
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useToast, toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import GeneralSettings from "@/components/settings/GeneralSettings";
import MockDataToggle from "@/components/settings/MockDataToggle";
import TestDataControl from "@/components/settings/TestDataControl";
import StripeSettings from "@/components/settings/StripeSettings";
import ThemeSettings from "@/components/settings/ThemeSettings";
import { generateMockCustomers, seedTestCustomers, seedTestServices, clearMockData, clearTestData } from "@/tests/utils/testUtils";

const Settings = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [useMockData, setUseMockData] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isClearingData, setIsClearingData] = useState(false);
  const [businessProfile, setBusinessProfile] = useState({
    business_name: "You Grow I Mow",
    email: "",
    phone: "",
    address: "",
    default_tax: 7.5
  });

  useEffect(() => {
    const fetchBusinessProfile = async () => {
      try {
        const { data } = await supabase
          .from('business_profiles')
          .select('*')
          .single();
        
        if (data) {
          setBusinessProfile(data);
        }
      } catch (error) {
        console.error('Error fetching business profile:', error);
      }
    };

    fetchBusinessProfile();
  }, []);

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

  useEffect(() => {
    checkAdminStatus();
  }, []);

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
          <GeneralSettings
            businessName={businessProfile.business_name}
            email={businessProfile.email}
            phone={businessProfile.phone}
            address={businessProfile.address}
            defaultTaxRate={businessProfile.default_tax}
            onLogoUpload={() => {}}
          />
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
          <StripeSettings
            stripeEnabled={true}
            onStripeToggle={() => {}}
          />
          
          <ThemeSettings
            darkMode={false}
            inventoryEnabled={true}
            onDarkModeToggle={() => {}}
            onInventoryToggle={() => {}}
          />
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
            
            <MockDataToggle
              useMockData={useMockData}
              isLoading={isLoading}
              isClearingData={isClearingData}
              onMockDataToggle={handleMockDataToggle}
              onClearMockData={handleClearMockData}
            />
            
            <Separator />
            
            <TestDataControl
              isClearingData={isClearingData}
              onClearTestData={handleClearTestData}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Settings;
