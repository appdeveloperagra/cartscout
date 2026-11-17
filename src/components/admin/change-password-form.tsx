"use client";

import { useState, type FormEvent } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

export default function ChangePasswordForm({ email }: { email: string }) {
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  async function changePassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const currentPassword = String(formData.get("current-password") ?? "");
    const password = String(formData.get("new-password") ?? "");
    const confirmation = String(formData.get("password-confirmation") ?? "");

    setError("");
    setNotice("");
    if (password !== confirmation) {
      setError("The new passwords do not match.");
      return;
    }
    if (password === currentPassword) {
      setError("Choose a new password that is different from your current one.");
      return;
    }

    setIsSaving(true);
    const supabase = createSupabaseBrowserClient();
    const { error: reauthError } = await supabase.auth.signInWithPassword({
      email,
      password: currentPassword,
    });
    if (reauthError) {
      setError("Your current password could not be verified.");
      setIsSaving(false);
      return;
    }

    const { error: updateError } = await supabase.auth.updateUser({ password });
    if (updateError) {
      setError(updateError.message);
      setIsSaving(false);
      return;
    }

    form.reset();
    setNotice("Your password has been changed.");
    setIsSaving(false);
  }

  return (
    <section className="admin-account-panel" aria-labelledby="admin-password-heading">
      <div>
        <p className="admin-kicker">SIGN-IN SECURITY</p>
        <h2 id="admin-password-heading">Change password</h2>
        <p>Verify your current password, then choose a new one. Your account stays signed in.</p>
      </div>
      <form className="admin-password-form" onSubmit={changePassword}>
        <label className="admin-form-field">
          <span>Current password <i aria-hidden="true">*</i></span>
          <input autoComplete="current-password" name="current-password" required type="password" />
        </label>
        <label className="admin-form-field">
          <span>New password <i aria-hidden="true">*</i></span>
          <input autoComplete="new-password" maxLength={128} minLength={8} name="new-password" required type="password" />
          <small>Use 8–128 characters.</small>
        </label>
        <label className="admin-form-field">
          <span>Confirm new password <i aria-hidden="true">*</i></span>
          <input autoComplete="new-password" maxLength={128} minLength={8} name="password-confirmation" required type="password" />
        </label>
        {error && <p className="admin-form-error" role="alert">{error}</p>}
        {notice && <p className="admin-success-message" role="status">{notice}</p>}
        <button className="admin-button admin-button-primary" disabled={isSaving} type="submit">
          {isSaving ? "Updating password..." : "Update password"}
        </button>
      </form>
    </section>
  );
}
