import { z } from 'zod'

export const basicLeadSchema = z.object({
  id: z.string().uuid(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  company: z.string().optional(),
  source: z.string().optional(), // e.g. "LinkedIn", "Referral"
  status: z.enum(['New', 'Contacted', 'Qualified', 'Lost', 'Converted']),
  assignedTo: z.string().uuid().optional(),
  createdAt: z.string(),
  updatedAt: z.string()
})

export type TLead = z.infer<typeof basicLeadSchema>
