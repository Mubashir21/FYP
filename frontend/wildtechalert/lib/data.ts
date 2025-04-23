import { createClient } from "./supabase/server";

export async function getDevices() {
  const supabase = await createClient();

  const { data, error } = await supabase.from("devices").select("*");

  if (error) {
    console.error("Error fetching devices:", error);
    return [];
  }

  return data;
}

export async function getDeviceById(id: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("devices")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching device by ID:", error);
    return [null, error];
  }

  return data;
}

export async function getStakeholders() {
  const supabase = await createClient();

  const { data, error } = await supabase.from("stakeholders").select("*");

  if (error) {
    console.error("Error fetching stakeholders:", error);
    return [];
  }

  return data;
}

export async function getStakeholderById(id: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("stakeholders")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching stakeholder by ID:", error);
    return [null, error];
  }

  return data;
}

export async function getDetections() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("detections")
    .select("*")
    .limit(5000);

  if (error) {
    console.error("Error fetching detections:", error);
    return [];
  }

  return data;
}

export async function getRegistration() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("registrations")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching registration:", error);
    return [];
  }

  return data;
}

export async function getUser() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export async function fetchPendingApprovals() {
  const supabase = await createClient();

  // First, get pending profiles
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("status", "pending");

  if (error) {
    console.error("Error fetching pending profiles:", error);
    return [];
  }

  return data;
}
