import * as z from "zod";
export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
}

export const clientSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.email({ message: "Invalid email address" }),
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 characters")
    .max(15, "Phone number must be at most 15 characters"),
});

export interface ClientFormData {
  name: string;
  email: string;
  phone: string;
}
