
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "lucide-react";

interface WeatherDay {
  date: string;
  condition: string;
  temperature: number;
  icon: string;
}

interface WeatherCardProps {
  forecast: WeatherDay[];
}

export function WeatherCard({ forecast }: WeatherCardProps) {
  // This is a placeholder - in a real app, we would fetch from OpenWeatherMap API
  const placeholderForecast: WeatherDay[] = [
    {
      date: "Today",
      condition: "Sunny",
      temperature: 75,
      icon: "☀️",
    },
    {
      date: "Tomorrow",
      condition: "Partly Cloudy",
      temperature: 72,
      icon: "⛅",
    },
    {
      date: "Wednesday",
      condition: "Rainy",
      temperature: 65,
      icon: "🌧️",
    },
  ];

  const weatherData = forecast && forecast.length > 0 ? forecast : placeholderForecast;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center">
          <Calendar className="mr-2 h-4 w-4" />
          3-Day Weather Forecast
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center">
          {weatherData.map((day, index) => (
            <div key={index} className="text-center">
              <div className="text-sm font-medium">{day.date}</div>
              <div className="text-3xl my-1">{day.icon}</div>
              <div className="text-lg font-bold">{day.temperature}°F</div>
              <div className="text-xs text-muted-foreground">{day.condition}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
