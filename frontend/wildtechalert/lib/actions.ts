"use server";

import { randomBytes } from "crypto";
import { createClient } from "./supabase/server";
import { z } from "zod";
import wkx from "wkx";

import {
  addDeviceSchema,
  addStakeholderSchema,
  editDeviceSchema,
  editStakeholderSchema,
} from "./schema";
import { toast } from "sonner";
import { coordsToWkb } from "./utils";

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

export async function addDevice(data: z.infer<typeof addDeviceSchema>) {
  const supabase = await createClient();

  try {
    // Get the last device to determine the next number
    const { data: lastDevice, error: fetchError } = await supabase
      .from("devices")
      .select("name")
      .ilike("name", "wta-a%")
      .order("name", { ascending: false })
      .limit(1);

    if (fetchError) {
      console.error("Error fetching last device:", fetchError.message);
      throw new Error("Failed to generate device name");
    }

    // Extract the number and increment
    let nextNumber = 1; // Default if no devices exist

    if (lastDevice && lastDevice.length > 0) {
      // Extract number from name like "wta-a22"
      const lastNumberStr = lastDevice[0].name.substring(5); // Get "22" from "wta-a22"
      const lastNumber = parseInt(lastNumberStr, 10);
      nextNumber = lastNumber + 1;
    }

    // Format the new device name with padding (wta-a01, wta-a02, etc.)
    const deviceName = `wta-a${nextNumber.toString().padStart(2, "0")}`;

    // Convert the coordinates to WKB using the wkx library
    // Create a Point with SRID 4326 (WGS 84 - standard for GPS)
    const point = new wkx.Point(data.longitude, data.latitude);
    point.srid = 4326; // Set the SRID directly on the point
    const wkbBuffer = point.toWkb();
    const wkbHex = wkbBuffer.toString("hex").toUpperCase();

    // Insert the new device with coordinates and generated name
    const { error: insertError } = await supabase.from("devices").insert({
      name: deviceName,
      coordinates: wkbHex,
    });

    if (insertError) {
      console.error("Error inserting device:", insertError.message);
      throw new Error("Failed to add device");
    }

    console.log("Device added successfully:", deviceName);
    return {
      success: true,
      deviceName: deviceName,
    };
  } catch (err) {
    console.error("Error adding device:", err);
    throw err;
  }
}

export async function editDevice(
  deviceId: string,
  data: z.infer<typeof editDeviceSchema>
) {
  const supabase = await createClient();

  try {
    // Convert latitude & longitude to WKB
    const wkbHex = coordsToWkb(data.latitude, data.longitude);

    // Update device in the database
    const { error: updateError } = await supabase
      .from("devices")
      .update({
        coordinates: wkbHex,
        battery_level: data.battery_level,
        status: data.status,
      })
      .eq("id", deviceId);

    if (updateError) {
      console.error("Error updating device:", updateError.message);
      throw new Error("Failed to update device");
    }

    console.log("Device updated successfully:", deviceId);
    return {
      success: true,
      message: "Device updated successfully",
    };
  } catch (err) {
    console.error("Error editing device:", err);
    throw err;
  }
}

export async function deleteDevice(deviceId: string) {
  const supabase = await createClient();

  try {
    const { error } = await supabase
      .from("devices")
      .delete()
      .eq("id", deviceId);

    console.log(`Device ${deviceId} deleted successfully`);
    return { success: true };
  } catch (err) {
    console.error("Unexpected error deleting device:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Unknown error occurred",
    };
  }
}

export async function deleteStakeholder(id: string) {
  const supabase = await createClient();

  try {
    const { error } = await supabase.from("stakeholders").delete().eq("id", id);

    console.log(`Stakeholder ${id} deleted successfully`);
    return { success: true };
  } catch (err) {
    console.error("Unexpected error deleting stakeholder:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Unknown error occurred",
    };
  }
}

export async function addStakeholder(
  data: z.infer<typeof addStakeholderSchema>
) {
  const supabase = await createClient();

  const fullName = (data.first_name + " " + data.last_name).trim();
  const email = data.email.toLowerCase().trim(); // Normalize email to lowercase

  try {
    const { error } = await supabase.from("stakeholders").insert({
      name: fullName,
      email: email,
      phone: data.phone,
    });

    if (error) {
      console.error("Error inserting stakeholder:", error.message);
      throw new Error("Failed to insert stakeholder");
    }

    console.log("Stakeholder added successfully!");
    return { success: true };
  } catch (err) {
    console.error("Unexpected error inserting stakeholder:", err);
    throw err;
  }
}

export async function editStakeholder(
  stakeholderId: string,
  data: z.infer<typeof editStakeholderSchema>
) {
  const supabase = await createClient();

  const fullName = (data.first_name + " " + data.last_name).trim();
  const email = data.email.toLowerCase().trim();

  try {
    // Update stakeholder in the database
    const { error } = await supabase
      .from("stakeholders")
      .update({
        name: fullName,
        email: email,
        phone: data.phone,
      })
      .eq("id", stakeholderId);

    if (error) {
      console.error("Error updating stakeholder:", error.message);
      throw new Error("Failed to update stakeholder");
    }

    console.log("Stakeholder updated successfully:", stakeholderId);
    return {
      success: true,
      message: "Stakeholder updated successfully",
    };
  } catch (err) {
    console.error("Error editing stakeholder:", err);
    throw err;
  }
}
