import * as z from "zod";

export const registerSchema = z.object({
  fullname: z.string().min(3, "Full name is required"),
  email: z.string().email("Invalid email format"),
  contact: z.string().min(10, "Invalid contact"),
  address: z.string().min(3, "Enter full address"),
  dob: z.string().min(1, "Enter DOB"),
  interested: z.string().min(3, "Enter your interest"),
  latestQualification: z.string().min(2, "Required"),
  password: z.string().min(6, "Password must be 6 characters"),
  role: z.string().min(3),
});
