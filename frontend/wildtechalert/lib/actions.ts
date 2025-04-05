"use server";

import { randomBytes } from "crypto";
import { createClient } from "./supabase/server";

export async function generateRegistrationCode() {
  // Generate a unique registration code
  // Format: REG-XXXX-XXXX (where X is alphanumeric)

  const supabase = await createClient();

  const firstPart = randomBytes(2).toString("hex").toUpperCase();
  const secondPart = randomBytes(2).toString("hex").toUpperCase();
  const registrationCode = `REG-${firstPart}-${secondPart}`;

  try {
    const { error } = await supabase.from("registrations").insert({
      code: registrationCode,
    });

    if (error) {
      console.error("Error inserting registration code:", error.message);
      throw new Error("Failed to insert registration code");
    }

    console.log("Registration code inserted successfully!");
  } catch (err) {
    console.error("Unexpected error inserting code:", err);
  }

  return { success: true };
}
