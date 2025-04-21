
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { Expo } from "npm:expo-server-sdk@3.7.0";

const expo = new Expo();
const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false }
    });

    // Get current time and time windows for notifications
    const now = new Date();
    const oneHourLater = new Date(now);
    oneHourLater.setHours(now.getHours() + 1);
    const oneDayLater = new Date(now);
    oneDayLater.setDate(now.getDate() + 1);

    // Format date ranges for query
    // For 1-hour window
    const oneHourStart = now.toISOString();
    const oneHourEnd = oneHourLater.toISOString();
    
    // For 24-hour window (excluding the 1-hour window)
    const oneDayStart = oneHourLater.toISOString();
    const oneDayEnd = oneDayLater.toISOString();

    // Fetch services in the next hour
    const { data: oneHourServices, error: oneHourError } = await supabase
      .from("services")
      .select(`
        id,
        service_type,
        scheduled_at,
        customers(id, name, email, phone),
        users(id, email, name, push_token)
      `)
      .gte("scheduled_at", oneHourStart)
      .lt("scheduled_at", oneHourEnd)
      .is("completed_at", null);

    if (oneHourError) throw oneHourError;

    // Fetch services in the next 24 hours (but not in the next hour)
    const { data: oneDayServices, error: oneDayError } = await supabase
      .from("services")
      .select(`
        id,
        service_type,
        scheduled_at,
        customers(id, name, email, phone),
        users(id, email, name, push_token)
      `)
      .gte("scheduled_at", oneDayStart)
      .lt("scheduled_at", oneDayEnd)
      .is("completed_at", null);

    if (oneDayError) throw oneDayError;

    // Process services for the next hour (urgent)
    const oneHourMessages = await processReminders(oneHourServices, "1 hour");
    
    // Process services for the next day
    const oneDayMessages = await processReminders(oneDayServices, "24 hours");

    return new Response(
      JSON.stringify({ 
        success: true, 
        oneHourReminders: oneHourServices?.length || 0,
        oneDayReminders: oneDayServices?.length || 0
      }),
      { 
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders }
      }
    );
  } catch (error) {
    console.error("Error in sendJobReminder function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders }
      }
    );
  }
});

async function processReminders(services: any[], timeframe: string) {
  if (!services || services.length === 0) return [];
  
  const messages = [];
  const pushTokens = new Map();
  
  for (const service of services) {
    try {
      const customer = service.customers;
      const user = service.users;
      
      if (!customer || !user) continue;
      
      // Format scheduled time
      const scheduledTime = new Date(service.scheduled_at);
      const formattedTime = scheduledTime.toLocaleTimeString('en-US', { 
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
      
      const formattedDate = scheduledTime.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric'
      });
      
      // Email notification - placeholder for actual email sending
      console.log(`Would send email to ${user.email} about upcoming service in ${timeframe}`);
      
      // SMS notification - placeholder for Twilio integration
      if (customer.phone) {
        console.log(`Would send SMS to ${customer.phone} about upcoming service in ${timeframe}`);
      }
      
      // Push notification
      if (user.push_token && Expo.isExpoPushToken(user.push_token)) {
        const message = {
          to: user.push_token,
          sound: 'default',
          title: timeframe === "1 hour" ? 'Upcoming Service in 1 Hour!' : 'Service Reminder',
          body: `You have a ${service.service_type} service for ${customer.name} at ${formattedTime} on ${formattedDate}`,
          data: { serviceId: service.id, customerId: customer.id },
          priority: timeframe === "1 hour" ? 'high' : 'default',
        };
        
        pushTokens.set(user.id, user.push_token);
        messages.push(message);
      }
    } catch (error) {
      console.error(`Error processing reminder for service ${service.id}:`, error);
    }
  }
  
  // Send push notifications if we have any
  if (messages.length > 0) {
    try {
      const chunks = expo.chunkPushNotifications(messages);
      
      for (const chunk of chunks) {
        try {
          const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
          console.log("Push notification result:", ticketChunk);
        } catch (error) {
          console.error("Error sending push notifications:", error);
        }
      }
    } catch (error) {
      console.error("Error chunking push notifications:", error);
    }
  }
  
  return messages;
}
