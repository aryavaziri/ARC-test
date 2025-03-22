import { z } from 'zod';

export const customerSchema = z.object({
    id: z.string().uuid(),
    companyName: z.string(),
    accountNumber: z.string().nullable().optional(),
});

export const addressSchema = z.object({
    id: z.string().uuid(),
    customerId: z.string().uuid(),
    addressType: z.number().int(),
    address1: z.string().optional().nullable(),
    address2: z.string().optional().nullable(),
    city: z.string().optional().nullable(),
    zipCode: z.string().optional().nullable(),
    stateId: z.string().uuid().optional().nullable(),
    statusId: z.string().uuid(),
    defaultAddress: z.boolean().optional().nullable(),
    isDropShip: z.boolean().optional().nullable(),
    companySite: z.string().optional().nullable(),
    county: z.string().optional().nullable(),
});

export const stateSchema = z.object({
    id: z.string().uuid(),
    name: z.string(),
});

export type TCustomer = z.infer<typeof customerSchema>;
export type TAddress = z.infer<typeof addressSchema>;
export type TState = z.infer<typeof stateSchema>;
