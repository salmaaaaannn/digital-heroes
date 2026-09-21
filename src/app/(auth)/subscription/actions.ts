'use server'

import { redirect } from 'next/navigation'
import Stripe from 'stripe'
import { createClient } from '@/lib/supabase/server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'dummy_key', {
  apiVersion: '2024-04-10' as any,
})

export async function createCheckoutSession(formData: FormData) {
  const priceId = formData.get('priceId') as string
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Generate Stripe Checkout session
  // In production, this URL should be your actual domain from process.env.NEXT_PUBLIC_SITE_URL
  const checkoutUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  
  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: `${checkoutUrl}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${checkoutUrl}/subscription`,
    client_reference_id: user.id,
    customer_email: user.email,
  })

  if (session.url) {
    redirect(session.url)
  } else {
    throw new Error('Failed to create checkout session')
  }
}
