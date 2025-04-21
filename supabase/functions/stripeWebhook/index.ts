
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY") || "";
const stripeWebhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET") || "";

serve(async (req) => {
  try {
    if (!stripeSecretKey || !stripeWebhookSecret) {
      throw new Error("Stripe configuration missing");
    }

    const stripe = new Stripe(stripeSecretKey);
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false }
    });

    // Verify the webhook signature
    const signature = req.headers.get("stripe-signature");
    if (!signature) {
      return new Response("Missing Stripe signature", { status: 400 });
    }

    const body = await req.text();
    let event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, stripeWebhookSecret);
    } catch (err) {
      console.error(`Webhook signature verification failed: ${err.message}`);
      return new Response(`Webhook Error: ${err.message}`, { status: 400 });
    }

    // Handle the event
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      
      // Retrieve the session to get invoice details
      const checkoutSession = await stripe.checkout.sessions.retrieve(session.id, {
        expand: ['payment_intent'],
      });
      
      // Update invoice status in database
      await handleSuccessfulPayment(supabase, checkoutSession);
    } else if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object;
      
      // Find the associated invoice by metadata
      if (paymentIntent.metadata && paymentIntent.metadata.invoice_id) {
        await handleSuccessfulPaymentIntent(supabase, paymentIntent);
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Error in stripeWebhook function:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
});

async function handleSuccessfulPayment(supabase: any, session: any) {
  if (!session.client_reference_id) {
    throw new Error("No invoice ID found in session");
  }

  const invoiceId = session.client_reference_id;
  
  try {
    // Update invoice status to paid
    const { error: updateError } = await supabase
      .from("invoices")
      .update({
        status: "paid",
        payment_method: "stripe",
        stripe_session_id: session.id,
        updated_at: new Date().toISOString()
      })
      .eq("id", invoiceId);

    if (updateError) throw updateError;
    
    // Generate receipt PDF - in a real app, this would call a function to generate the PDF
    const receiptUrl = `https://example.com/receipts/${invoiceId}.pdf`;
    
    // Update the invoice with the receipt URL
    const { error: receiptError } = await supabase
      .from("invoices")
      .update({
        pdf_receipt_url: receiptUrl
      })
      .eq("id", invoiceId);

    if (receiptError) throw receiptError;
    
    // Get customer info for notification
    const { data: invoice, error: invoiceError } = await supabase
      .from("invoices")
      .select(`
        id,
        amount,
        service_id,
        services(
          customer_id,
          user_id,
          customers(
            name,
            email,
            phone
          ),
          users(
            email,
            push_token
          )
        )
      `)
      .eq("id", invoiceId)
      .single();

    if (invoiceError) throw invoiceError;
    
    // Send notifications (email & SMS placeholders)
    console.log("Would send payment confirmation email to:", invoice.services.users.email);
    
    if (invoice.services.customers.phone) {
      console.log("Would send SMS to:", invoice.services.customers.phone);
    }
    
    return true;
  } catch (error) {
    console.error(`Error processing successful payment for invoice ${invoiceId}:`, error);
    throw error;
  }
}

async function handleSuccessfulPaymentIntent(supabase: any, paymentIntent: any) {
  const invoiceId = paymentIntent.metadata.invoice_id;
  
  try {
    // Update invoice status to paid
    const { error: updateError } = await supabase
      .from("invoices")
      .update({
        status: "paid",
        payment_method: "stripe",
        updated_at: new Date().toISOString()
      })
      .eq("id", invoiceId);

    if (updateError) throw updateError;
    
    // Generate receipt PDF - placeholder
    const receiptUrl = `https://example.com/receipts/${invoiceId}.pdf`;
    
    // Update the invoice with the receipt URL
    const { error: receiptError } = await supabase
      .from("invoices")
      .update({
        pdf_receipt_url: receiptUrl
      })
      .eq("id", invoiceId);

    if (receiptError) throw receiptError;
    
    return true;
  } catch (error) {
    console.error(`Error processing successful payment for invoice ${invoiceId}:`, error);
    throw error;
  }
}
