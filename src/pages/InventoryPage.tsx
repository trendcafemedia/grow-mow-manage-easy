import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowUpDown,
  Search,
  ShoppingCart,
  Truck,
  Package,
  AlertTriangle,
  Plus,
  ExternalLink,
  BarChart,
  DollarSign,
  Tag
} from 'lucide-react';

// Mock inventory item type
interface InventoryItem {
  id: string;
  name: string;
  category: string;
  currentStock: number;
  minimumStock: number;
  price: number;
  unit: string;
  supplier: string;
  lastRestocked: string;
  purchaseLinks: {
    store: string;
    url: string;
    price: number;
  }[];
}

// Mock data
const mockInventory: InventoryItem[] = [
  {
    id: '1',
    name: 'Premium Lawn Fertilizer',
    category: 'Fertilizer',
    currentStock: 12,
    minimumStock: 5,
    price: 45.99,
    unit: 'Bag',
    supplier: 'Green Pro Supplies',
    lastRestocked: '2025-04-15',
    purchaseLinks: [
      { store: 'Amazon', url: 'https://amazon.com/lawn-fertilizer', price: 45.99 },
      { store: 'Home Depot', url: 'https://homedepot.com/lawn-fertilizer', price: 48.99 },
      { store: 'Lowes', url: 'https://lowes.com/lawn-fertilizer', price: 47.99 }
    ]
  },
  {
    id: '2',
    name: 'Weed Killer Concentrate',
    category: 'Herbicide',
    currentStock: 3,
    minimumStock: 5,
    price: 32.50,
    unit: 'Gallon',
    supplier: 'Chem Solutions Inc.',
    lastRestocked: '2025-03-22',
    purchaseLinks: [
      { store: 'Amazon', url: 'https://amazon.com/weed-killer', price: 32.50 },
      { store: 'Home Depot', url: 'https://homedepot.com/weed-killer', price: 34.99 },
      { store: 'Walmart', url: 'https://walmart.com/weed-killer', price: 31.99 }
    ]
  },
  {
    id: '3',
    name: 'Commercial Grade Grass Seed Mix',
    category: 'Seed',
    currentStock: 8,
    minimumStock: 3,
    price: 89.99,
    unit: 'Bag',
    supplier: 'Premier Lawn Products',
    lastRestocked: '2025-04-02',
    purchaseLinks: [
      { store: 'Amazon', url: 'https://amazon.com/grass-seed', price: 89.99 },
      { store: 'Home Depot', url: 'https://homedepot.com/grass-seed', price: 92.50 },
      { store: 'True Value', url: 'https://truevalue.com/grass-seed', price: 94.99 }
    ]
  },
  {
    id: '4',
    name: 'Mulch - Premium Dark',
    category: 'Mulch',
    currentStock: 25,
    minimumStock: 15,
    price: 6.99,
    unit: 'Bag',
    supplier: 'Garden Supply Co.',
    lastRestocked: '2025-04-10',
    purchaseLinks: [
      { store: 'Amazon', url: 'https://amazon.com/mulch', price: 6.99 },
      { store: 'Home Depot', url: 'https://homedepot.com/mulch', price: 5.99 },
      { store: 'Lowes', url: 'https://lowes.com/mulch', price: 6.49 }
    ]
  },
  {
    id: '5',
    name: 'Snow Melt Granules',
    category: 'Winter',
    currentStock: 2,
    minimumStock: 10,
    price: 18.99,
    unit: 'Bucket',
    supplier: 'Winter Solutions Ltd.',
    lastRestocked: '2025-02-15',
    purchaseLinks: [
      { store: 'Amazon', url: 'https://amazon.com/snow-melt', price: 18.99 },
      { store: 'Home Depot', url: 'https://homedepot.com/snow-melt', price: 20.99 },
      { store: 'Walmart', url: 'https://walmart.com/snow-melt', price: 17.99 }
    ]
  }
];

// Filter categories
const categories = Array.from(new Set(mockInventory.map(item => item.category)));

type SortField = 'name' | 'category' | 'currentStock' | 'price';
type SortOrder = 'asc' | 'desc';

const InventoryPage: React.FC = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>(mockInventory);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showLowStock, setShowLowStock] = useState(false);

  // Sort and filter inventory
  const filteredAndSortedInventory = React.useMemo(() => {
    let result = [...inventory];
    
    // Apply category filter
    if (selectedCategory) {
      result = result.filter(item => item.category === selectedCategory);
    }
    
    // Apply low stock filter
    if (showLowStock) {
      result = result.filter(item => item.currentStock <= item.minimumStock);
    }
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(item => 
        item.name.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query) ||
        item.supplier.toLowerCase().includes(query)
      );
    }
    
    // Apply sorting
    result.sort((a, b) => {
      // Special handling for numeric fields
      if (sortField === 'currentStock' || sortField === 'price') {
        return sortOrder === 'asc' 
          ? a[sortField] - b[sortField]
          : b[sortField] - a[sortField];
      } 
      
      // String comparison for text fields
      const aValue = a[sortField].toString().toLowerCase();
      const bValue = b[sortField].toString().toLowerCase();
      
      return sortOrder === 'asc'
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    });
    
    return result;
  }, [inventory, searchQuery, sortField, sortOrder, selectedCategory, showLowStock]);

  // Toggle sort order
  const toggleSort = (field: SortField) => {
    if (field === sortField) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  // Handle category selection
  const handleCategorySelect = (category: string | null) => {
    setSelectedCategory(category);
  };

  // Get best price link
  const getBestPriceLink = (links: InventoryItem['purchaseLinks']) => {
    if (!links || links.length === 0) return null;
    
    // Find the link with the lowest price
    return links.reduce((best, current) => 
      current.price < best.price ? current : best, links[0]);
  };

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Inventory Management</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Item
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="md:col-span-3">
          <CardHeader className="space-y-1">
            <CardTitle>Inventory Items</CardTitle>
            <CardDescription>
              Manage your lawn care supplies and equipment
            </CardDescription>
            
            <div className="flex flex-col md:flex-row gap-4 mt-2">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search inventory..."
                  className="pl-8 w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Button 
                  variant={showLowStock ? "default" : "outline"}
                  size="sm"
                  onClick={() => setShowLowStock(!showLowStock)}
                  className="whitespace-nowrap"
                >
                  <AlertTriangle className={`mr-2 h-4 w-4 ${showLowStock ? 'text-white' : 'text-yellow-500'}`} />
                  Low Stock
                </Button>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="whitespace-nowrap">
                      {selectedCategory || "All Categories"}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleCategorySelect(null)}>
                      All Categories
                    </DropdownMenuItem>
                    {categories.map(category => (
                      <DropdownMenuItem 
                        key={category}
                        onClick={() => handleCategorySelect(category)}
                      >
                        {category}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>
                      <Button 
                        variant="ghost" 
                        onClick={() => toggleSort('name')}
                        className="font-medium flex items-center"
                      >
                        Product
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button 
                        variant="ghost" 
                        onClick={() => toggleSort('category')}
                        className="font-medium flex items-center"
                      >
                        Category
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button 
                        variant="ghost" 
                        onClick={() => toggleSort('currentStock')}
                        className="font-medium flex items-center"
                      >
                        Stock
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button 
                        variant="ghost" 
                        onClick={() => toggleSort('price')}
                        className="font-medium flex items-center"
                      >
                        Price
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead>Best Deal</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAndSortedInventory.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                        No inventory items found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredAndSortedInventory.map((item) => {
                      const bestDeal = getBestPriceLink(item.purchaseLinks);
                      const isLowStock = item.currentStock <= item.minimumStock;
                      
                      return (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-start">
                              <div>
                                <div>{item.name}</div>
                                <div className="text-sm text-muted-foreground">{item.supplier}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="bg-slate-50">
                              {item.category}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <span className={`font-medium ${isLowStock ? 'text-red-500' : ''}`}>
                                {item.currentStock}
                              </span>
                              <span className="text-muted-foreground ml-1">/ {item.minimumStock} min</span>
                              {isLowStock && (
                                <AlertTriangle className="ml-2 h-4 w-4 text-yellow-500" />
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <DollarSign className="h-3 w-3 text-muted-foreground" />
                              <span>{item.price.toFixed(2)}</span>
                              <span className="text-muted-foreground ml-1">/ {item.unit}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            {bestDeal ? (
                              <a 
                                href={bestDeal.url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="flex items-center text-blue-600 hover:text-blue-800"
                              >
                                <ShoppingCart className="mr-1 h-4 w-4" />
                                <span className="font-medium">{bestDeal.store}</span>
                                <ExternalLink className="ml-1 h-3 w-3" />
                                <span className="ml-1 text-green-600 font-medium">${bestDeal.price.toFixed(2)}</span>
                              </a>
                            ) : (
                              <span className="text-muted-foreground">No links available</span>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  Details
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-xl">
                                <DialogHeader>
                                  <DialogTitle>{item.name}</DialogTitle>
                                  <DialogDescription>
                                    {item.category} • Supplied by {item.supplier}
                                  </DialogDescription>
                                </DialogHeader>
                                
                                <Tabs defaultValue="details">
                                  <TabsList className="grid w-full grid-cols-3">
                                    <TabsTrigger value="details">Details</TabsTrigger>
                                    <TabsTrigger value="purchase">Purchase Options</TabsTrigger>
                                    <TabsTrigger value="history">History</TabsTrigger>
                                  </TabsList>
                                  
                                  <TabsContent value="details" className="space-y-4 mt-4">
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <p className="text-sm font-medium">Current Stock</p>
                                        <p className={`text-2xl font-bold ${isLowStock ? 'text-red-500' : ''}`}>
                                          {item.currentStock} {item.unit}s
                                        </p>
                                        {isLowStock && (
                                          <Badge variant="destructive" className="mt-1">
                                            Low Stock
                                          </Badge>
                                        )}
                                      </div>
                                      <div>
                                        <p className="text-sm font-medium">Price Per Unit</p>
                                        <p className="text-2xl font-bold">
                                          ${item.price.toFixed(2)} / {item.unit}
                                        </p>
                                      </div>
                                      <div>
                                        <p className="text-sm font-medium">Minimum Stock</p>
                                        <p className="text-lg">{item.minimumStock} {item.unit}s</p>
                                      </div>
                                      <div>
                                        <p className="text-sm font-medium">Last Restocked</p>
                                        <p className="text-lg">{item.lastRestocked}</p>
                                      </div>
                                    </div>
                                    
                                    <div className="flex space-x-2 mt-4">
                                      <Button variant="outline" size="sm">
                                        <Truck className="mr-2 h-4 w-4" />
                                        Restock
                                      </Button>
                                      <Button variant="outline" size="sm">
                                        <Package className="mr-2 h-4 w-4" />
                                        Use Item
                                      </Button>
                                    </div>
                                  </TabsContent>
                                  
                                  <TabsContent value="purchase" className="space-y-4 mt-4">
                                    <div className="space-y-4">
                                      <h3 className="text-sm font-medium">Purchase Options</h3>
                                      
                                      {item.purchaseLinks.map((link, index) => (
                                        <Card key={index} className={index === 0 ? "border-green-200 bg-green-50" : ""}>
                                          <CardContent className="p-4 flex justify-between items-center">
                                            <div>
                                              <p className="font-medium flex items-center">
                                                <ShoppingCart className="mr-2 h-4 w-4" />
                                                {link.store}
                                                {index === 0 && (
                                                  <Badge className="ml-2 bg-green-600">Best Price</Badge>
                                                )}
                                              </p>
                                              <p className="text-muted-foreground text-sm">Ships in 2-3 business days</p>
                                            </div>
                                            <div className="text-right">
                                              <p className="text-lg font-bold">${link.price.toFixed(2)}</p>
                                              <a 
                                                href={link.url} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center justify-end"
                                              >
                                                Buy Now
                                                <ExternalLink className="ml-1 h-3 w-3" />
                                              </a>
                                            </div>
                                          </CardContent>
                                        </Card>
                                      ))}
                                    </div>
                                  </TabsContent>
                                  
                                  <TabsContent value="history" className="mt-4">
                                    <div className="text-sm text-muted-foreground">
                                      <p>No usage history available</p>
                                    </div>
                                  </TabsContent>
                                </Tabs>
                                
                                <DialogFooter>
                                  <Button type="button" variant="outline">
                                    Edit Item
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Inventory Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-sm font-medium mb-2">Low Stock Items</h3>
              <div className="text-3xl font-bold">
                {inventory.filter(item => item.currentStock <= item.minimumStock).length}
              </div>
              <p className="text-sm text-muted-foreground">
                Items requiring restock
              </p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-2">Total Items</h3>
              <div className="text-3xl font-bold">
                {inventory.length}
              </div>
              <p className="text-sm text-muted-foreground">
                Across {categories.length} categories
              </p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-2">Inventory Value</h3>
              <div className="text-3xl font-bold">
                ${inventory.reduce((total, item) => total + (item.price * item.currentStock), 0).toFixed(2)}
              </div>
              <p className="text-sm text-muted-foreground">
                Total current valuation
              </p>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              <BarChart className="mr-2 h-4 w-4" />
              Run Inventory Report
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default InventoryPage;
