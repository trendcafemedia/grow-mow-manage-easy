
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import GeneralSettings from "@/components/settings/GeneralSettings";
import AppSettings from "@/components/settings/AppSettings";
import AdminSettings from "@/components/settings/AdminSettings";

const Settings = () => {
  const [stripeEnabled, setStripeEnabled] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [inventoryEnabled, setInventoryEnabled] = useState(false);
  const [useMockData, setUseMockData] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isClearingData, setIsClearingData] = useState(false);
  
  const handleStripeToggle = (enabled: boolean) => {
    setStripeEnabled(enabled);
  };
  
  const handleDarkModeToggle = (enabled: boolean) => {
    setDarkMode(enabled);
  };
  
  const handleInventoryToggle = (enabled: boolean) => {
    setInventoryEnabled(enabled);
  };
  
  const handleMockDataToggle = (enabled: boolean) => {
    setUseMockData(enabled);
  };
  
  const handleClearMockData = () => {
    setIsClearingData(true);
    // Simulate clearing data
    setTimeout(() => {
      setIsClearingData(false);
    }, 1000);
  };
  
  const handleClearTestData = () => {
    setIsClearingData(true);
    // Simulate clearing data
    setTimeout(() => {
      setIsClearingData(false);
    }, 1000);
  };

  return (
    <div className="container mx-auto p-6 max-w-5xl">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>
      
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="general">Business Profile</TabsTrigger>
          <TabsTrigger value="app">App Settings</TabsTrigger>
          <TabsTrigger value="admin">Admin</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>Business Profile</CardTitle>
              <CardDescription>
                Manage your business information and settings.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <GeneralSettings 
                businessName="Green Lawns Inc." 
                email="contact@greenlawns.com" 
                phone="(555) 123-4567" 
                address="123 Main St, Anytown, USA" 
                defaultTaxRate={8.5}
                onLogoUpload={() => console.log("Logo updated")}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="app">
          <Card>
            <CardHeader>
              <CardTitle>App Settings</CardTitle>
              <CardDescription>
                Customize the application behavior and appearance.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AppSettings 
                stripeEnabled={stripeEnabled}
                darkMode={darkMode}
                inventoryEnabled={inventoryEnabled}
                onStripeToggle={handleStripeToggle}
                onDarkModeToggle={handleDarkModeToggle}
                onInventoryToggle={handleInventoryToggle}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="admin">
          <Card>
            <CardHeader>
              <CardTitle>Administrator Settings</CardTitle>
              <CardDescription>
                Advanced settings for administrators only.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AdminSettings 
                isAdmin={true}
                useMockData={useMockData}
                isLoading={isLoading}
                isClearingData={isClearingData}
                onMockDataToggle={handleMockDataToggle}
                onClearMockData={handleClearMockData}
                onClearTestData={handleClearTestData}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
