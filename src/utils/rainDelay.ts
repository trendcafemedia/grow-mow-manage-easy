
interface WeatherInfo {
  has_rain: boolean;
  primary_weather: string;
  date: string;
  day: string;
}

interface ServiceInfo {
  id: string;
  scheduled_at: string;
  customer_name: string;
  service_type: string;
}

export function checkRainDelay(
  service: ServiceInfo,
  weatherData: { days: WeatherInfo[] } | null
): { isDelayed: boolean; newDate: Date | null; reason: string | null } {
  if (!weatherData || !weatherData.days || !weatherData.days.length) {
    return { isDelayed: false, newDate: null, reason: null };
  }

  // Extract the service date
  const serviceDate = new Date(service.scheduled_at);
  const serviceDateString = serviceDate.toISOString().split('T')[0];

  // Find the weather for the service date
  const dayWeather = weatherData.days.find(day => day.date === serviceDateString);

  if (!dayWeather) {
    return { isDelayed: false, newDate: null, reason: null };
  }

  // Check for rain or severe weather
  const hasRain = dayWeather.has_rain;
  const weatherCondition = dayWeather.primary_weather.toLowerCase();
  const severeWeatherConditions = ['thunderstorm', 'tornado', 'hurricane', 'snow', 'sleet', 'hail'];
  
  const hasSevereWeather = severeWeatherConditions.some(condition => 
    weatherCondition.includes(condition)
  );

  if (hasRain || hasSevereWeather) {
    // Calculate the delay date (next day)
    const newDate = new Date(serviceDate);
    newDate.setDate(newDate.getDate() + 1);
    
    // Maintain the same time
    newDate.setHours(serviceDate.getHours());
    newDate.setMinutes(serviceDate.getMinutes());
    
    let reason = `Service for ${service.customer_name} delayed due to `;
    
    if (hasSevereWeather) {
      reason += `severe weather (${dayWeather.primary_weather})`;
    } else {
      reason += 'rain in the forecast';
    }
    
    return {
      isDelayed: true,
      newDate,
      reason
    };
  }

  return { isDelayed: false, newDate: null, reason: null };
}

export async function applyRainDelay(
  serviceId: string, 
  newDate: Date, 
  reason: string,
  supabaseClient: any
): Promise<boolean> {
  try {
    // Update the service with the new date
    const { error } = await supabaseClient
      .from('services')
      .update({ 
        scheduled_at: newDate.toISOString(),
        notes: reason
      })
      .eq('id', serviceId);
    
    if (error) throw error;
    
    // Log the delay
    console.log(`Rain delay applied: ${reason}. New date: ${newDate.toLocaleString()}`);
    
    return true;
  } catch (error) {
    console.error('Error applying rain delay:', error);
    return false;
  }
}
