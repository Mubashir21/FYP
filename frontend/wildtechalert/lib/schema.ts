import { z } from "zod";

export const addDeviceSchema = z.object({
  latitude: z
    .number({ invalid_type_error: "Latitude must be a number" })
    .min(-90, "Latitude must be ≥ -90")
    .max(90, "Latitude must be ≤ 90"),
  longitude: z
    .number({ invalid_type_error: "Longitude must be a number" })
    .min(-180, "Longitude must be ≥ -180")
    .max(180, "Longitude must be ≤ 180"),
});

export const editDeviceSchema = z.object({
  latitude: z
    .number({ invalid_type_error: "Latitude must be a number" })
    .min(-90, "Latitude must be ≥ -90")
    .max(90, "Latitude must be ≤ 90"),
  longitude: z
    .number({ invalid_type_error: "Longitude must be a number" })
    .min(-180, "Longitude must be ≥ -180")
    .max(180, "Longitude must be ≤ 180"),
  battery_level: z
    .number({ invalid_type_error: "Battery level must be a number" })
    .min(0, "Battery level must be ≥ 0")
    .max(100, "Battery level must be ≤ 100"),
  status: z.enum(["online", "offline"], {
    invalid_type_error: "Status must be either 'online' or 'offline'",
  }),
});

export const addStakeholderSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Second name is required"),
  email: z.string().email("Invalid email address"),
  phone: z
    .string()
    .regex(
      /^\+\d{10,15}$/,
      "Phone number must start with '+' followed by 10 to 15 digits"
    ),
});

export const editStakeholderSchema = addStakeholderSchema;
