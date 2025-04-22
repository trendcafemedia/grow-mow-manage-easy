
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth/AuthContext";
import GeneralSettings from "@/components/settings/GeneralSettings";
import AppSettings from "@/components/settings/AppSettings";
import AdminSettings from "@/components/settings/AdminSettings";
import { generateMockCustomers, seedTestCustomers, seedTestServices, clearMockData, clearTestData } from "@/tests/utils/testUtils";

const Settings = () => {
  const { user } = useAuth();
  const [businessName, setBusinessName] = useState("My Lawn Care Business");
  const [email, setEmail] = useState("contact@example.com");
  const [phone, setPhone] = useState("(555) 123-4567");
  const [address, setAddress] = useState("123 Main St, Stafford, VA");
  const [defaultTaxRate, setDefaultTaxRate] = useState(8.25);
  const [stripeEnabled, setStripeEnabled] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [inventoryEnabled, setInventoryEnabled] = useState(true);
  const [useMockData, setUseMockData] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isClearingData, setIsClearingData] = useState(false);
  const [activeTab, setActiveTab] = useState("general");
  const isAdmin = user?.email?.includes("admin") || true; // For demo, everyone is admin

  // Fetch settings from Supabase
  useEffect(() => {
    // Simulating data fetch
    // In a real app, this would fetch from Supabase
  }, []);

  const handleLogoUpload = () => {
    // This would update the business profile with the new logo URL
    console.log("Logo updated");
  };

  const handleStripeToggle = (enabled: boolean) => {
    setStripeEnabled(enabled);
    toast({
      title: enabled ? "Stripe payments enabled" : "Stripe payments disabled",
      description: enabled
        ? "Customers can now pay with credit card"
        : "Credit card payments are now disabled",
    });
  };

  const handleDarkModeToggle = (enabled: boolean) => {
    setDarkMode(enabled);
    // This would update the user's theme preference
    toast({
      title: enabled ? "Dark mode enabled" : "Light mode enabled",
    });
  };

  const handleInventoryToggle = (enabled: boolean) => {
    setInventoryEnabled(enabled);
    toast({
      title: enabled ? "Inventory tracking enabled" : "Inventory tracking disabled",
    });
  };

  const handleMockDataToggle = async (enabled: boolean) => {
    setIsLoading(true);
    setUseMockData(enabled);
    
    try {
      if (enabled) {
        await generateMockCustomers();
        toast({
          title: "Mock data enabled",
          description: "Generated 20 customers around Stafford, VA",
        });
      }
    } catch (error) {
      console.error("Error toggling mock data:", error);
      toast({
        title: "Error",
        description: "Failed to generate mock data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearMockData = async () => {
    setIsClearingData(true);
    
    try {
      await clearMockData();
      toast({
        title: "Mock data cleared",
        description: "All mock data has been removed",
      });
    } catch (error) {
      console.error("Error clearing mock data:", error);
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
        description: "All test data has been removed",
      });
    } catch (error) {
      console.error("Error clearing test data:", error);
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
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">Business Profile</TabsTrigger>
          <TabsTrigger value="app">App Settings</TabsTrigger>
          {isAdmin && <TabsTrigger value="admin">Developer</TabsTrigger>}
        </TabsList>
        
        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Business Profile</CardTitle>
              <CardDescription>
                Your business information shown on invoices and customer communications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <GeneralSettings
                businessName={businessName}
                email={email}
                phone={phone}
                address={address}
                defaultTaxRate={defaultTaxRate}
                onLogoUpload={handleLogoUpload}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="app" className="space-y-4">
          <AppSettings
            stripeEnabled={stripeEnabled}
            darkMode={darkMode}
            inventoryEnabled={inventoryEnabled}
            onStripeToggle={handleStripeToggle}
            onDarkModeToggle={handleDarkModeToggle}
            onInventoryToggle={handleInventoryToggle}
          />
        </TabsContent>
        
        <TabsContent value="admin" className="space-y-4">
          <AdminSettings
            isAdmin={isAdmin}
            useMockData={useMockData}
            isLoading={isLoading}
            isClearingData={isClearingData}
            onMockDataToggle={handleMockDataToggle}
            onClearMockData={handleClearMockData}
            onClearTestData={handleClearTestData}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
