import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";
import Stripe from "npm:stripe@^16.0.0";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
  httpClient: Stripe.createFetchHttpClient(),
});

const supabaseAdmin = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

serve(async (req) => {
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return new Response("Missing signature", { status: 400 });
  }

  try {
    const body = await req.text();
    const event = await stripe.webhooks.constructEventAsync(
      body,
      signature,
      Deno.env.get("STRIPE_WEBHOOK_SECRET")!,
    );

    console.log(`🔔 Event received: ${event.type}`);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const appointmentId = session.metadata?.appointment_id;

      if (appointmentId) {
        console.log(`✅ Payment successful for appointment: ${appointmentId}`);

        // Explicitly target public schema and log result
        const { data, error } = await supabaseAdmin
          .from("appointments")
          .update({ paid: true })
          .eq("id", appointmentId)
          .select();

        if (error) {
          console.error(`❌ Error updating appointment: ${error.message}`);
          throw error;
        }

        console.log(`🚀 Database updated successfully:`, data);
      } else {
        console.error("❌ No appointment_id found in session metadata");
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error(`❌ Webhook error: ${error.message}`);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { "Content-Type": "application/json" },
        status: 400,
      },
    );
  }
});
