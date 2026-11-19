import { z } from 'zod'

export const ContactFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { message: 'Name is required.' })
    .min(2, { message: 'Must be at least 2 characters.' })
    .max(120, { message: 'Name must be 120 characters or fewer.' })
    .refine(name => !/[\r\n]/.test(name), {
      message: 'Name must be a single line.'
    }),
  email: z
    .string()
    .trim()
    .max(254, { message: 'Email is too long.' })
    .min(1, { message: 'Email is required.' })
    .email('Invalid email.'),
  message: z
    .string()
    .trim()
    .min(1, { message: 'Message is required.' })
    .max(5000, { message: 'Message must be 5000 characters or fewer.' })
})

export const NewsletterFormSchema = z.object({
  email: z.string().trim().max(254).email('Invalid email.')
})
