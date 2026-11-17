"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

export default function AcceptInviteForm() {
  const router = useRouter();
  const client = useRef<ReturnType<typeof createSupabaseBrowserClient> | null>(null);
  const [isChecking, setIsChecking] = useState(true);
  const [hasInviteSession, setHasInviteSession] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();
    client.current = supabase;
    let active = true;

    void supabase.auth.getUser().then(({ data, error: authError }) => {
      if (!active) return;
      if (authError && authError.name !== "AuthSessionMissingError") {
        setError(`Unable to verify this invitation: ${authError.message}`);
      }
      setHasInviteSession(Boolean(data.user));
      setIsChecking(false);
    });

    return () => {
      active = false;
    };
  }, []);

  async function setPassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const formData = new FormData(event.currentTarget);
    const password = String(formData.get("password") ?? "");
    const confirmation = String(formData.get("password-confirmation") ?? "");
    if (password !== confirmation) {
      setError("The passwords do not match.");
      return;
    }

    if (!client.current) {
      setError("Your invitation session could not be verified. Open the link from your invitation email again.");
      return;
    }

    setIsSaving(true);
    const { error: updateError } = await client.current.auth.updateUser({ password });
    if (updateError) {
      setError(updateError.message);
      setIsSaving(false);
      return;
    }

    router.replace("/admin");
    router.refresh();
  }

  return (
    <main className="admin-setup-screen">
      <section className="admin-setup-card">
        <span className="admin-brand-mark">CS</span>
        <p className="admin-kicker">CARTSCOUT WORKSPACE</p>
        <h1>Set your password</h1>
        {isChecking ? (
          <p className="admin-setup-copy" role="status">Verifying your invitation...</p>
        ) : hasInviteSession ? (
          <>
            <p className="admin-setup-copy">Choose a password to finish setting up your account.</p>
            <form className="admin-invite-password-form" onSubmit={setPassword}>
              <label className="admin-form-field">
                <span>Password <i aria-hidden="true">*</i></span>
                <input autoComplete="new-password" minLength={8} name="password" required type="password" />
                <small>Use at least 8 characters.</small>
              </label>
              <label className="admin-form-field">
                <span>Confirm password <i aria-hidden="true">*</i></span>
                <input autoComplete="new-password" minLength={8} name="password-confirmation" required type="password" />
              </label>
              {error && <p className="admin-form-error" role="alert">{error}</p>}
              <button className="admin-button admin-button-primary" disabled={isSaving} type="submit">
                {isSaving ? "Saving password..." : "Set password and continue"}
              </button>
            </form>
          </>
        ) : (
          <>
            <p className="admin-setup-copy">This invitation link is invalid, expired, or has already been used.</p>
            {error && <p className="admin-form-error" role="alert">{error}</p>}
            <Link className="admin-button admin-button-primary" href="/admin/login">Go to sign in</Link>
          </>
        )}
      </section>
    </main>
  );
}
