const { createClient } = require("@supabase/supabase-js");

async function seedAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://cirnkrmgddnoxirkhqia.supabase.co";
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_UZpmCGuvOfx0eXQMMXfZRA_a-pLc0m8";
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  const adminEmail = "admin@digitalheroes.local";
  const adminPassword = process.env.ADMIN_INITIAL_PASSWORD || "DHAdmin@2026!";

  console.log("Checking Admin account idempotently:", adminEmail);

  // Use service role if available, otherwise sign-in/sign-up pattern
  if (serviceRoleKey && !serviceRoleKey.includes("YOUR_SERVICE_ROLE_KEY")) {
    const adminClient = createClient(url, serviceRoleKey, { auth: { autoRefreshToken: false, persistSession: false } });
    const { data: usersData } = await adminClient.auth.admin.listUsers();
    let existing = usersData?.users?.find(u => u.email === adminEmail);

    if (!existing) {
      console.log("Creating admin via service role...");
      const { data, error } = await adminClient.auth.admin.createUser({
        email: adminEmail,
        password: adminPassword,
        email_confirm: true,
        user_metadata: { full_name: "Admin" },
      });
      if (error) throw error;
      existing = data.user;
    }

    if (existing) {
      await adminClient.from("profiles").upsert({
        id: existing.id,
        email: adminEmail,
        full_name: "Admin",
        role: "admin",
      });
      console.log("Admin profile verified with role = admin.");
    }
  } else {
    // Client-side authentication pattern
    const client = createClient(url, key);
    let authRes = await client.auth.signInWithPassword({ email: adminEmail, password: adminPassword });

    if (authRes.error) {
      console.log("Admin not found. Creating admin user via auth.signUp...");
      const signUpRes = await client.auth.signUp({
        email: adminEmail,
        password: adminPassword,
        options: { data: { full_name: "Admin" } },
      });
      if (signUpRes.error) {
        console.error("Could not create admin:", signUpRes.error.message);
        return;
      }
      authRes = await client.auth.signInWithPassword({ email: adminEmail, password: adminPassword });
    }

    if (authRes.data?.session?.access_token) {
      const userClient = createClient(url, key, {
        global: { headers: { Authorization: `Bearer ${authRes.data.session.access_token}` } },
      });
      await userClient.from("profiles").update({ role: "admin", full_name: "Admin" }).eq("id", authRes.data.user.id);
      console.log("Admin user and role 'admin' successfully verified.");
    }
  }
}

seedAdmin().catch(console.error);
