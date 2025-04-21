
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus } from "lucide-react";

const Inventory = () => {
  // Mock data - would come from database in real app
  const inventoryItems = [
    {
      id: "1",
      name: "Lawn Mower Blade",
      qty: 3,
      reorderLevel: 2,
      supplier: "Garden Pro Supplies",
      avgCost: 24.99
    },
    {
      id: "2",
      name: "Weed Trimmer Line",
      qty: 1,
      reorderLevel: 2,
      supplier: "Garden Pro Supplies",
      avgCost: 12.50
    },
    {
      id: "3",
      name: "Garden Gloves (Pair)",
      qty: 5,
      reorderLevel: 3,
      supplier: "Safety Gear Co.",
      avgCost: 8.75
    },
    {
      id: "4",
      name: "Fertilizer (5lb Bag)",
      qty: 7,
      reorderLevel: 4,
      supplier: "Green Thumb Inc.",
      avgCost: 19.99
    }
  ];

  const fuelLogs = [
    {
      id: "1",
      date: "Jun 21, 2023",
      gallons: 2.5,
      pricePerGallon: 3.49
    },
    {
      id: "2",
      date: "Jun 14, 2023",
      gallons: 3.2,
      pricePerGallon: 3.55
    },
    {
      id: "3",
      date: "Jun 7, 2023",
      gallons: 2.8,
      pricePerGallon: 3.62
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Inventory</h1>
      </div>

      <Tabs defaultValue="inventory">
        <TabsList>
          <TabsTrigger value="inventory">Inventory Items</TabsTrigger>
          <TabsTrigger value="fuel">Fuel Log</TabsTrigger>
        </TabsList>

        <TabsContent value="inventory" className="mt-4">
          <div className="flex justify-between mb-4">
            <h2 className="text-lg font-semibold">Items</h2>
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add Item
            </Button>
          </div>

          <div className="space-y-4">
            {inventoryItems.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-sm text-muted-foreground">Supplier: {item.supplier}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center">
                        <p className="font-medium">Qty: {item.qty}</p>
                        {item.qty <= item.reorderLevel && (
                          <span className="ml-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                            Low
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">${item.avgCost.toFixed(2)} avg cost</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="fuel" className="mt-4">
          <div className="flex justify-between mb-4">
            <h2 className="text-lg font-semibold">Fuel Log</h2>
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add Fuel Log
            </Button>
          </div>

          <div className="space-y-4">
            {fuelLogs.map((log) => (
              <Card key={log.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">{log.date}</h3>
                      <p className="text-sm text-muted-foreground">
                        ${log.pricePerGallon.toFixed(2)} per gallon
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{log.gallons.toFixed(1)} gallons</p>
                      <p className="text-sm text-muted-foreground">
                        ${(log.gallons * log.pricePerGallon).toFixed(2)} total
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Inventory;
