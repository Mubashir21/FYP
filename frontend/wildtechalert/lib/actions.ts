"use server";

import { randomBytes } from "crypto";
import { createClient } from "./supabase/server";
import { z } from "zod";
import wkx from "wkx";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient as createAdminClient } from "@supabase/supabase-js";

import {
  addDeviceSchema,
  addStakeholderSchema,
  editDeviceSchema,
  editStakeholderSchema,
  loginSchema,
  signupSchema,
} from "./schema";
import { coordsToWkb } from "./utils";
import { Resend } from "resend";
import SignupEmail from "@/components/admin/email/signup";
import { ApprovedEmail } from "@/components/admin/email/approved";
import { AdminApprovalEmail } from "@/components/admin/email/admin-approval";

const resend = new Resend(process.env.RESEND_API_KEY);

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
    await supabase.from("devices").delete().eq("id", deviceId);

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
    await supabase.from("stakeholders").delete().eq("id", id);

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

export async function loginWithEmail(data: z.infer<typeof loginSchema>) {
  const supabase = await createClient();

  // 1. Attempt authentication
  const { data: authResponse, error: authError } =
    await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

  if (authError) {
    throw new Error(authError.message);
  }

  // 2. Check user's approval status
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("status")
    .eq("user_id", authResponse.user.id)
    .single();

  if (profileError) {
    // Log out the user if we can't verify their status
    await supabase.auth.signOut();
    throw new Error("Could not verify account status");
  }

  // 3. Handle different status cases
  if (profile.status === "pending") {
    // Sign out and redirect to pending page
    await supabase.auth.signOut();
    redirect("/auth/pending");
  } else if (profile.status === "rejected") {
    await supabase.auth.signOut();
    redirect("/auth/rejected");
  }

  redirect("/admin/dashboard");
}

export async function signup(data: z.infer<typeof signupSchema>) {
  const supabase = await createClient();

  // 1. Create auth user
  const { data: authResponse, error: authError } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      //   emailRedirectTo: `${location.origin}/auth/callback`,
      data: {
        role: "user",
        status: "pending",
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
      },
    },
  });

  if (authError) {
    throw new Error(authError.message);
  }

  // 2. Create profile record if signup successful
  if (authResponse.user) {
    const { error: profileError } = await supabase.from("profiles").insert({
      user_id: authResponse.user.id,
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email,
    });

    if (profileError) {
      // Rollback auth user if profile creation fails
      await supabase.auth.admin.deleteUser(authResponse.user.id);
      throw new Error("Profile creation failed: " + profileError.message);
    }
  }

  const { error: emailError } = await resend.emails.send({
    from: "WildTechAlert <onboarding@wildtechalert.com>",
    to: [data.email],
    subject: "Thank you for signing up!",
    react: SignupEmail({ firstName: data.first_name }),
  });

  if (emailError) {
    console.error("Email failed to send", emailError);
  }

  const { data: adminProfiles, error: adminFetchError } = await supabase
    .from("profiles")
    .select("email")
    .eq("role", "admin");

  if (!adminFetchError && adminProfiles && adminProfiles.length > 0) {
    // 5. Send notification to all admins
    const adminEmails = adminProfiles.map((profile) => profile.email);

    const { error: adminEmailError } = await resend.emails.send({
      from: "WildTechAlert <notifications@wildtechalert.com>",
      to: adminEmails,
      subject: "New user signup requires approval",
      react: AdminApprovalEmail({
        userFirstName: data.first_name,
        userLastName: data.last_name,
        userEmail: data.email,
      }),
    });

    if (adminEmailError) {
      console.error("Admin notification email failed to send", adminEmailError);
    }
  } else if (adminFetchError) {
    console.error("Error fetching admin emails:", adminFetchError);
  }
  await supabase.auth.signOut();

  return authResponse;
}

export async function signOut() {
  const supabase = await createClient();

  // Clear the auth session
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error("Logout error:", error.message);
    throw error;
  }

  // Redirect to login page
  redirect("/login");
}

export async function approveProfile(userId: string) {
  try {
    const supabase = await createClient();
    const supabaseAdmin = createAdminClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    // 1. Update status in profiles table
    const { error: profileError } = await supabase
      .from("profiles")
      .update({ status: "approved" })
      .eq("user_id", userId);

    if (profileError) {
      console.error("Error approving profile in profiles table:", profileError);
      return { success: false, error: profileError.message };
    }

    const { data: userData, error: fetchError } =
      await supabaseAdmin.auth.admin.getUserById(userId);

    if (fetchError) {
      console.error("Error fetching user data:", fetchError);
      return { success: false, error: fetchError.message };
    }
    // 2. Update user metadata in auth.users
    const currentMetadata = userData.user.user_metadata || {};
    const { error: authError } = await supabaseAdmin.auth.admin.updateUserById(
      userId,
      {
        user_metadata: {
          ...currentMetadata,
          status: "approved",
        },
      }
    );

    if (authError) {
      console.error("Error updating auth user metadata:", authError);
      return { success: false, error: authError.message };
    }

    revalidatePath("/admin/settings/approvals");

    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", userId)
      .single();

    const { error: emailError } = await resend.emails.send({
      from: "WildTechAlert <onboarding@wildtechalert.com>",
      to: [data.email],
      subject: "Your account has been approved!",
      react: ApprovedEmail({ firstName: data.first_name }),
    });

    if (emailError) {
      console.error("Email failed to send", emailError);
    }
    return { success: true };
  } catch (error) {
    console.error("Unexpected error during profile approval:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

export async function rejectProfile(userId: string) {
  try {
    const supabase = await createClient();

    const { error: profileError } = await supabase
      .from("profiles")
      .update({ status: "rejected" })
      .eq("user_id", userId);

    if (profileError) {
      console.error("Error rejecting profile in profiles table:", profileError);
      return { success: false, error: profileError.message };
    }

    const { data: userData, error: fetchError } =
      await supabase.auth.admin.getUserById(userId);

    if (fetchError) {
      console.error("Error fetching user data:", fetchError);
      return { success: false, error: fetchError.message };
    }

    const currentMetadata = userData.user.user_metadata || {};
    const { error: authError } = await supabase.auth.admin.updateUserById(
      userId,
      {
        user_metadata: {
          ...currentMetadata,
          status: "rejected",
        },
      }
    );

    if (authError) {
      console.error("Error updating auth user metadata:", authError);
      return { success: false, error: authError.message };
    }

    revalidatePath("/admin/settings/approvals");

    return { success: true };
  } catch (error) {
    console.error("Unexpected error during profile rejection:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}
