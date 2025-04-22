
import { Outlet } from "react-router-dom";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader } from "@/components/ui/sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { 
  Menu, 
  X, 
  Home, 
  Users, 
  Calendar, 
  Package2, 
  Settings, 
  Map,
  LogOut,
  UserRound,
  HelpCircle
} from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import { AddJobButton } from "@/components/AddJobButton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/lib/auth/AuthContext";
import { useToast } from "@/hooks/use-toast";

const MainLayout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { toast } = useToast();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Signed out successfully",
        description: "You have been signed out of your account",
      });
      navigate('/auth');
    } catch (error) {
      toast({
        title: "Sign out failed",
        description: "There was a problem signing you out",
        variant: "destructive",
      });
      console.error("Sign out error:", error);
    }
  };

  const navigationItems = [
    { name: "Dashboard", path: "/", icon: Home },
    { name: "Customers", path: "/customers", icon: Users },
    { name: "Calendar", path: "/calendar", icon: Calendar },
    { name: "Map", path: "/map", icon: Map },
    { name: "Inventory", path: "/inventory", icon: Package2 },
    { name: "Settings", path: "/settings", icon: Settings },
  ];

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        {/* Desktop Sidebar */}
        <Sidebar className="hidden md:flex">
          <SidebarHeader className="p-4 flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-2xl">🌱</span>
              <span className="font-bold text-lg tracking-tight">You Grow I Mow</span>
            </Link>
          </SidebarHeader>
          <SidebarContent className="px-3 py-2">
            <nav className="space-y-1">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                      isActive(item.path)
                        ? "bg-primary text-primary-foreground"
                        : "text-foreground hover:bg-muted"
                    }`}
                  >
                    <Icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </SidebarContent>
          <SidebarFooter className="p-4">
            <ThemeToggle />
          </SidebarFooter>
        </Sidebar>

        {/* Mobile menu */}
        <div className="flex flex-col flex-1">
          <div className="sticky top-0 z-10 flex items-center justify-between bg-background md:hidden px-4 py-2 border-b">
            <div className="flex items-center">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-md text-foreground hover:bg-muted"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
              <Link to="/" className="ml-2 flex items-center space-x-2">
                <span className="text-2xl">🌱</span>
                <span className="font-bold text-lg tracking-tight">You Grow I Mow</span>
              </Link>
            </div>
            <div className="flex items-center space-x-2">
              <ThemeToggle />
              <UserMenu user={user} handleSignOut={handleSignOut} />
            </div>
          </div>

          {/* Mobile navigation menu */}
          {mobileMenuOpen && (
            <div className="md:hidden bg-background border-b">
              <nav className="px-4 py-3 space-y-1">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      to={item.path}
                      className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                        isActive(item.path)
                          ? "bg-primary text-primary-foreground"
                          : "text-foreground hover:bg-muted"
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Icon className="mr-3 h-5 w-5" />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
            </div>
          )}

          {/* Main content with User Menu in desktop view */}
          <main className="flex-1">
            <div className="hidden md:flex items-center justify-end p-4 border-b">
              <UserMenu user={user} handleSignOut={handleSignOut} />
            </div>
            <div className="py-6 px-4 sm:px-6 lg:px-8">
              <Outlet />
            </div>
          </main>
        </div>

        {/* Floating action button for adding new job */}
        <AddJobButton />
      </div>
    </SidebarProvider>
  );
};

// User avatar dropdown menu component
const UserMenu = ({ user, handleSignOut }: { user: any, handleSignOut: () => Promise<void> }) => {
  const navigate = useNavigate();
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10">
            <AvatarImage src="/placeholder.svg" alt="Business Logo" />
            <AvatarFallback className="bg-primary text-primary-foreground">
              <UserRound className="h-6 w-6" />
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuLabel>
          {user?.email || 'My Account'}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => navigate('/settings')}>
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <HelpCircle className="mr-2 h-4 w-4" />
          <span>Help</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sign out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default MainLayout;
