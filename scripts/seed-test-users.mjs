// Seeds two test accounts into Supabase: a renter (rent only) and an owner with a completed owner profile.
//
// Usage:  npm run seed:test-users
// Reads SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY from .env.local.
// Safe to re-run: rows are upserted by email, so the accounts are reset
// to the values below instead of being duplicated.

import bcrypt from "bcryptjs";
import { createClient } from "@supabase/supabase-js";

const TEST_PASSWORD = "RendozTest123";
const BCRYPT_ROUNDS = 12; // matches lib/auth-helpers.ts

// A fully completed owner profile, so the owner account can list straight away.
// Shape matches ProfileData in component/dashboard/profile/types.ts.
function completedProfile({ phone, photoUrl, city, street, bank, accountNumber, accountName }) {
  return {
    accountType: "individual",
    phone,
    whatsappNotifications: true,
    photoUrl,
    locationLabel: `${city}, Lagos State`,
    locationState: "Lagos",
    locationCity: city,
    locationStreet: street,
    locationInstructions: "Test account: no real pickup address",
    ninVerified: true,
    payoutBankName: bank,
    payoutAccountNumber: accountNumber,
    payoutAccountName: accountName,
    businessName: "",
    businessRegNumber: "",
    businessAddress: "",
  };
}

const avatar = (name) => `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(name)}`;

/** A verified renter: can browse and rent, but has no owner role, so no listing or owner dashboard. */
function renterUser({ full_name, email, phone, city }) {
  return {
    full_name,
    email,
    phone,
    role: ["renter"],
    is_email_verified: true,
    verification_status: "verified",
    // Cleared explicitly so re-running the seed removes any owner data left from earlier seeds
    nin: null,
    nin_submitted_at: null,
    profile_photo: avatar(full_name),
    location: `${city}, Lagos`,
    profile: {},
    profile_completed: false,
  };
}

/** An owner with a completed owner profile: can create listings (auto-approved, see lib/listings.ts). */
function ownerUser({ full_name, email, phone, nin, city, street, bank, accountNumber }) {
  const photoUrl = avatar(full_name);
  return {
    full_name,
    email,
    phone,
    // Owner on top of renter: can browse and rent, and create/manage listings
    role: ["renter", "owner"],
    is_email_verified: true,
    verification_status: "verified",
    nin,
    nin_submitted_at: new Date().toISOString(),
    profile_photo: photoUrl,
    location: `${city}, Lagos`,
    profile: completedProfile({ phone, photoUrl, city, street, bank, accountNumber, accountName: full_name }),
    profile_completed: true,
  };
}

const TEST_USERS = [
  renterUser({
    full_name: "Test Renter",
    email: "renter.test@rendoz.dev",
    phone: "08000000001",
    city: "Yaba",
  }),
  ownerUser({
    full_name: "Test Owner",
    email: "owner.test@rendoz.dev",
    phone: "08000000002",
    nin: "12345678901",
    city: "Ikeja",
    street: "2 Test Street",
    bank: "Test Bank",
    accountNumber: "0000000002",
  }),
];

function requireEnv(name) {
  const value = process.env[name];
  if (!value) {
    console.error(`Missing env: ${name}. Add it to .env.local and try again.`);
    process.exit(1);
  }
  return value;
}

async function main() {
  const supabase = createClient(
    requireEnv("SUPABASE_URL"),
    requireEnv("SUPABASE_SERVICE_ROLE_KEY"),
    { auth: { autoRefreshToken: false, persistSession: false } }
  );

  const password_hash = await bcrypt.hash(TEST_PASSWORD, BCRYPT_ROUNDS);
  const rows = TEST_USERS.map((user) => ({ ...user, password_hash, is_active: true }));

  const { error } = await supabase.from("users").upsert(rows, { onConflict: "email" });
  if (error) {
    console.error("Seeding failed:", error.message);
    process.exit(1);
  }

  // Read the rows back so we know they actually landed in Supabase
  const { data, error: readError } = await supabase
    .from("users")
    .select("email, role, verification_status, profile_completed, profile_photo")
    .in("email", TEST_USERS.map((u) => u.email));

  if (readError || !data || data.length !== TEST_USERS.length) {
    console.error("Seeded rows could not be read back:", readError?.message ?? data);
    process.exit(1);
  }

  console.table(data);
  console.log(`Password for both accounts: ${TEST_PASSWORD}`);
}

main();
