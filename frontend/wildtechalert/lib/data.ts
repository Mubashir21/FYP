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

export async function detDetections() {
  const supabase = await createClient();

  const { data, error } = await supabase.from("detections").select("*");

  if (error) {
    console.error("Error fetching detections:", error);
    return [];
  }

  return data;
}
