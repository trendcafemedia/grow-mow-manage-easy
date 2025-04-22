
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  description?: string;
  className?: string;
  onClick?: () => void;
}

export function StatCard({ title, value, icon, description, className, onClick }: StatCardProps) {
  return (
    <Card 
      className={cn(
        "transition-all duration-200 hover:scale-102 hover:shadow-md hover:border-green-200",
        onClick && "cursor-pointer",
        className
      )} 
      onClick={onClick}
    >
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {icon && (
          <div className="text-green-600 bg-green-50 p-2 rounded-full">
            {icon}
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-green-800">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">
            {description}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
