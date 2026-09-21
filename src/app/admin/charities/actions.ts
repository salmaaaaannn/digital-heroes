"use server";

import { createAdminClient, createClient } from "@/lib/supabase/server";
import { getAuthUser } from "@/lib/supabase/auth";
import { revalidatePath } from "next/cache";

export async function createCharity(formData: FormData) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return { error: "Unauthorized. Please sign in." };
    }

    const supabase = createClient();
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role !== "admin") {
      return { error: "Forbidden: Admin access required." };
    }

    const adminClient = createAdminClient();
    if (!adminClient) {
      return { error: "Server configuration is missing SUPABASE_SERVICE_ROLE_KEY." };
    }

    const name = (formData.get("name") as string)?.trim();
    const category = (formData.get("category") as string)?.trim();
    const description = (formData.get("description") as string)?.trim() || null;
    const website_url = (formData.get("website_url") as string)?.trim() || null;
    const active = formData.get("active") === "true";

    if (!name) {
      return { error: "Charity name is required." };
    }

    if (!category) {
      return { error: "Category is required." };
    }

    const insertPayload: Record<string, any> = {
      name,
      category,
      description,
      website_url,
      is_active: active,
    };

    const { error: insertError } = await adminClient.from("charities").insert(insertPayload);

    if (insertError) {
      console.error("Supabase insert error in createCharity:", insertError);
      return { error: insertError.message || "Failed to add charity." };
    }

    revalidatePath("/admin/charities");
    revalidatePath("/charities");
    revalidatePath("/");
    revalidatePath("/charity-selection");

    return { success: true };
  } catch (err: any) {
    console.error("Exception in createCharity:", err);
    return { error: err.message || "Internal server error." };
  }
}

export async function updateCharity(charityId: string, formData: FormData) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return { error: "Unauthorized. Please sign in." };
    }

    const supabase = createClient();
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role !== "admin") {
      return { error: "Forbidden: Admin access required." };
    }

    const adminClient = createAdminClient();
    if (!adminClient) {
      return { error: "Server configuration is missing SUPABASE_SERVICE_ROLE_KEY." };
    }

    const name = (formData.get("name") as string)?.trim();
    const category = (formData.get("category") as string)?.trim();
    const description = (formData.get("description") as string)?.trim() || null;
    const website_url = (formData.get("website_url") as string)?.trim() || null;
    const active = formData.get("active") === "true";

    if (!name) {
      return { error: "Charity name is required." };
    }

    if (!category) {
      return { error: "Category is required." };
    }

    const updatePayload: Record<string, any> = {
      name,
      category,
      description,
      website_url,
      is_active: active,
      updated_at: new Date().toISOString(),
    };

    const { error: updateError } = await adminClient
      .from("charities")
      .update(updatePayload)
      .eq("id", charityId);

    if (updateError) {
      console.error("Supabase update error in updateCharity:", updateError);
      return { error: updateError.message || "Failed to update charity." };
    }

    revalidatePath("/admin/charities");
    revalidatePath("/charities");
    revalidatePath("/");
    revalidatePath("/charity-selection");

    return { success: true };
  } catch (err: any) {
    console.error("Exception in updateCharity:", err);
    return { error: err.message || "Internal server error." };
  }
}

export async function archiveCharity(charityId: string) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return { error: "Unauthorized." };
    }

    const supabase = createClient();
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role !== "admin") {
      return { error: "Forbidden." };
    }

    const adminClient = createAdminClient();
    if (!adminClient) {
      return { error: "Server configuration is missing SUPABASE_SERVICE_ROLE_KEY." };
    }

    const { error } = await adminClient
      .from("charities")
      .update({ is_active: false, updated_at: new Date().toISOString() })
      .eq("id", charityId);

    if (error) {
      return { error: error.message };
    }

    revalidatePath("/admin/charities");
    revalidatePath("/charities");
    revalidatePath("/");
    revalidatePath("/charity-selection");
    return { success: true };
  } catch (err: any) {
    return { error: err.message };
  }
}

export async function activateCharity(charityId: string) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return { error: "Unauthorized." };
    }

    const supabase = createClient();
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role !== "admin") {
      return { error: "Forbidden." };
    }

    const adminClient = createAdminClient();
    if (!adminClient) {
      return { error: "Server configuration is missing SUPABASE_SERVICE_ROLE_KEY." };
    }

    const { error } = await adminClient
      .from("charities")
      .update({ is_active: true, updated_at: new Date().toISOString() })
      .eq("id", charityId);

    if (error) {
      return { error: error.message };
    }

    revalidatePath("/admin/charities");
    revalidatePath("/charities");
    revalidatePath("/");
    revalidatePath("/charity-selection");
    return { success: true };
  } catch (err: any) {
    return { error: err.message };
  }
}

export async function toggleCharityStatus(charityId: string, currentStatus: boolean) {
  if (currentStatus) {
    return archiveCharity(charityId);
  } else {
    return activateCharity(charityId);
  }
}
