import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Users,
  MapPin,
  Calendar,
  LayoutDashboard,
  FileText,
  Package,
  BarChart3,
  Settings,
  LogOut,
  Leaf,
  HelpCircle,
  Bell,
  Moon,
  Sun
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { useAuth } from '@/lib/auth/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

const Navigation: React.FC = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const { theme, setTheme } = useTheme();
  const { user, signOut } = useAuth();
  
  const userInitials = user?.email ? 
    user.email.substring(0, 2).toUpperCase() : 
    'GG'; // Default fallback to "GG" for Grow-Mow

  // Define navigation items with icons
  const navItems = [
    { path: '/', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { path: '/customers', label: 'Customers', icon: <Users className="w-5 h-5" /> },
    { path: '/map', label: 'Map View', icon: <MapPin className="w-5 h-5" /> },
    { path: '/calendar', label: 'Scheduling', icon: <Calendar className="w-5 h-5" /> },
    { path: '/invoices', label: 'Invoicing', icon: <FileText className="w-5 h-5" /> },
    { path: '/inventory', label: 'Inventory', icon: <Package className="w-5 h-5" /> },
    { path: '/reports', label: 'Reports', icon: <BarChart3 className="w-5 h-5" /> },
  ];

  const bottomNavItems = [
    { path: '/settings', label: 'Settings', icon: <Settings className="w-5 h-5" /> },
    { path: '/help', label: 'Help', icon: <HelpCircle className="w-5 h-5" /> },
  ];

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <nav className="flex flex-col h-full bg-green-800 dark:bg-green-950 text-white">
      {/* App Logo */}
      <div className="p-4 flex items-center justify-center gap-2 border-b border-green-700/50">
        <div className="bg-white dark:bg-green-900 p-2 rounded-md">
          <Leaf className="h-6 w-6 text-green-600 dark:text-green-400" />
        </div>
        <div className="font-bold text-lg">Grow & Mow</div>
      </div>

      {/* Main Nav Items */}
      <div className="py-4 flex-1 overflow-y-auto scrollbar-thin">
        <ul className="space-y-1 px-2">
          {navItems.map((item) => {
            const isActive = currentPath === item.path || 
                         (item.path !== '/' && currentPath.startsWith(item.path));
            
            return (
              <li key={item.path}>
                <TooltipProvider delayDuration={300}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link 
                        to={item.path}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2.5 rounded-md transition",
                          isActive 
                            ? "bg-green-700 dark:bg-green-700/70 text-white" 
                            : "text-green-100 hover:bg-green-700/40"
                        )}
                      >
                        {item.icon}
                        <span>{item.label}</span>
                        {item.path === '/customers' && (
                          <span className="ml-auto bg-green-600 dark:bg-green-500 text-xs rounded-full px-2 py-0.5">
                            24
                          </span>
                        )}
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="z-50">
                      {item.label}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Bottom Nav Items */}
      <div className="py-2 border-t border-green-700/50">
        <ul className="space-y-1 px-2">
          {bottomNavItems.map((item) => {
            const isActive = currentPath === item.path;
            
            return (
              <li key={item.path}>
                <TooltipProvider delayDuration={300}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link 
                        to={item.path}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2.5 rounded-md transition",
                          isActive 
                            ? "bg-green-700 dark:bg-green-700/70 text-white" 
                            : "text-green-100 hover:bg-green-700/40"
                        )}
                      >
                        {item.icon}
                        <span>{item.label}</span>
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      {item.label}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Actions Row */}
      <div className="p-2 border-t border-green-700/50 flex justify-around">
        <TooltipProvider delayDuration={300}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-green-100 hover:bg-green-700/40 hover:text-white"
                onClick={toggleTheme}
              >
                {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              Toggle {theme === 'dark' ? 'Light' : 'Dark'} Mode
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider delayDuration={300}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-green-100 hover:bg-green-700/40 hover:text-white"
                onClick={() => {}}
              >
                <Bell className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              Notifications
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* User Section */}
      <div className="p-4 border-t border-green-700/50">
        <div className="flex items-center gap-3 px-2 py-2">
          <Avatar className="h-9 w-9 border-2 border-green-600">
            <AvatarImage src={user?.user_metadata?.avatar_url} />
            <AvatarFallback className="bg-green-600">{userInitials}</AvatarFallback>
          </Avatar>
          <div className="overflow-hidden">
            <p className="text-sm font-medium truncate">
              {user?.user_metadata?.full_name || user?.email || 'User'}
            </p>
            <p className="text-xs text-green-300 truncate">Administrator</p>
          </div>
          <TooltipProvider delayDuration={300}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="ml-auto text-green-300 hover:text-white hover:bg-green-700/40"
                  onClick={handleLogout}
                >
                  <LogOut className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                Sign Out
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {/* Version Info */}
      <div className="px-4 py-2 text-xs text-green-400 border-t border-green-700/50 text-center">
        <p>Version 1.0.0</p>
      </div>
    </nav>
  );
};

export default Navigation;
