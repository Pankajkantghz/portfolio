'use server'

import { z } from 'zod'
import { Resend } from 'resend'
import { headers } from 'next/headers'
import { ContactFormSchema, NewsletterFormSchema } from '@/lib/contact/schemas'
import { isRateLimited } from '@/lib/contact/rate-limit'
import ContactFormEmail from '@/emails/contact-form-email'

type ContactFormInputs = z.infer<typeof ContactFormSchema>
type NewsletterFormInputs = z.infer<typeof NewsletterFormSchema>

const resend = new Resend(process.env.RESEND_API_KEY)

async function isSubmissionRateLimited() {
  const requestHeaders = await headers()
  const address = requestHeaders.get('x-real-ip')?.trim().slice(0, 128)

  return address ? isRateLimited(`email-form:${address}`, 5, 60_000) : false
}

export async function sendEmail(data: ContactFormInputs) {
  const result = ContactFormSchema.safeParse(data)

  if (!result.success) {
    return { error: result.error.format() }
  }

  if (await isSubmissionRateLimited()) {
    return { error: 'Please wait before submitting again.' }
  }

  try {
    const { name, email, message } = result.data

    const response = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: ['pankaj.py96810@gmail.com'],
      replyTo: email,
      subject: `New Contact Form Message from ${name}`,
      text: `
Name: ${name}
Email: ${email}

Message:
${message}
      `,
      react: ContactFormEmail({
        name,
        email,
        message
      })
    })

    if (response.error) {
      throw new Error(response.error.message)
    }

    return { success: true }
  } catch {
    return {
      error: 'Unable to send your message right now. Please try again later.'
    }
  }
}

export async function subscribe(data: NewsletterFormInputs) {
  const result = NewsletterFormSchema.safeParse(data)

  if (!result.success) {
    return { error: result.error.format() }
  }

  if (await isSubmissionRateLimited()) {
    return { error: 'Please wait before submitting again.' }
  }

  try {
    const { email } = result.data

    const response = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: ['pankaj.py96810@gmail.com'],
      subject: 'New Newsletter Subscriber',
      text: `New subscriber email: ${email}`
    })

    if (response.error) {
      throw new Error(response.error.message)
    }

    return { success: true }
  } catch {
    return {
      error: 'Unable to subscribe right now. Please try again later.'
    }
  }
}
