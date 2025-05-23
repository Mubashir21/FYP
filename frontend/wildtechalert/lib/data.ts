import { EmailAlert } from "./definitions";
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

export async function getDevicesByStatus() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("devices")
    .select("*")
    .eq("status", "online"); // filter by status = 'online'

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
    .limit(5000)
    .order("received_at", { ascending: false });

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

export async function fetchCardsData() {
  const supabase = await createClient();

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const endOfToday = new Date();
  endOfToday.setHours(23, 59, 59, 999);

  try {
    const deviceCountPromise = supabase
      .from("devices")
      .select("*", { count: "exact", head: true })
      .eq("status", "online");

    const todayDetectionsCountPromise = supabase
      .from("detections")
      .select("*", { count: "exact", head: true })
      .gte("received_at", startOfToday.toISOString())
      .lte("received_at", endOfToday.toISOString());

    const totalDetectionCountPromise = supabase
      .from("detections")
      .select("*", { count: "exact", head: true });

    const stakeholderCountPromise = supabase
      .from("stakeholders")
      .select("*", { count: "exact", head: true })
      .eq("subscribed", "true");

    const alertCountPromise = supabase
      .from("alerts")
      .select("*", { count: "exact", head: true });

    const [
      deviceRes,
      todayDetectionRes,
      totalDetectionRes,
      stakeholderRes,
      alertRes,
    ] = await Promise.all([
      deviceCountPromise,
      todayDetectionsCountPromise,
      totalDetectionCountPromise,
      stakeholderCountPromise,
      alertCountPromise,
    ]);

    if (deviceRes.error) throw deviceRes.error;
    if (todayDetectionRes.error) throw todayDetectionRes.error;
    if (totalDetectionRes.error) throw totalDetectionRes.error;
    if (stakeholderRes.error) throw stakeholderRes.error;
    if (alertRes.error) throw alertRes.error;

    return {
      deviceCount: deviceRes.count ?? 0,
      todayDetectionCount: todayDetectionRes.count ?? 0,
      totalDetectionCount: totalDetectionRes.count ?? 0,
      stakeholderCount: stakeholderRes.count ?? 0,
      alertCount: alertRes.count ?? 0,
    };
  } catch (error) {
    console.error("Error fetching card data:", error);
    throw new Error("Failed to fetch cards info.");
  }
}

export async function getEmailAlerts(): Promise<EmailAlert[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("alert_recipients")
    .select(
      `
      id,
      sent_at,
      channel,
      status,
      stakeholder:stakeholder_id(name),
      alert:alert_id(
        detection:detection_id(
          device_name
        )
      )
    `
    )
    .order("sent_at", { ascending: false });

  if (error) {
    console.error("Error fetching email alerts:", error);
    return [];
  }

  const formatted: EmailAlert[] = data.map((record) => ({
    id: record.id,
    sent_at: record.sent_at,
    device_name: record.alert?.[0]?.detection?.[0]?.device_name ?? "Unknown",
    stakeholder_name: record.stakeholder?.[0]?.name ?? "Unknown",
    channel: record.channel,
    status: record.status,
  }));

  return formatted;
}
