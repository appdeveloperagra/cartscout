"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

export default function AdminLoginForm({ configured }: { configured: boolean }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const { error: signInError } = await createSupabaseBrowserClient().auth.signInWithPassword({
      email: String(formData.get("email") ?? "").trim(),
      password: String(formData.get("password") ?? ""),
    });

    if (signInError) {
      setError(signInError.message);
      setIsSubmitting(false);
      return;
    }

    router.replace("/admin");
    router.refresh();
  }

  return (
    <main className="admin-login-screen">
      <section className="admin-login-story">
        <Link href="/" className="admin-login-brand">
          <Image src="/cartscout-logo.png" alt="CartScout" width={240} height={36} priority />
        </Link>
        <div className="admin-login-story-copy">
          <span className="admin-login-eyebrow"><span /> CARTSCOUT WORKSPACE</span>
          <h1>Your business,<br /><em>beautifully in sync.</em></h1>
          <p>One clear space to manage the catalogue, publishing, rates, and the details customers rely on.</p>
          <div className="admin-login-story-foot">
            <span>01</span><span>Catalogue</span><i /><span>02</span><span>Content</span><i /><span>03</span><span>Operations</span>
          </div>
        </div>
        <div className="admin-login-visual" aria-hidden="true">
          <span className="admin-visual-orbit orbit-one" />
          <span className="admin-visual-orbit orbit-two" />
          <span className="admin-visual-sun" />
          <span className="admin-visual-road road-one" />
          <span className="admin-visual-road road-two" />
          <span className="admin-visual-label">MADE FOR THE WAY AHEAD</span>
        </div>
        <span className="admin-login-copyright">CARTSCOUT · SOUTH AFRICA</span>
      </section>
      <section className="admin-login-form-side">
        <div className="admin-login-card">
          <span className="admin-login-mobile-mark">CS</span>
          <p className="admin-login-form-kicker">WELCOME BACK</p>
          <h2>Sign in to your workspace</h2>
          <p className="admin-login-form-intro">Use the superadmin account created for your CartScout project.</p>
          {configured ? (
            <form className="admin-login-form" onSubmit={handleSubmit}>
              <label htmlFor="admin-email">Email address</label>
              <input id="admin-email" name="email" type="email" autoComplete="username" required />
              <div className="admin-password-label">
                <label htmlFor="admin-password">Password</label>
              </div>
              <input id="admin-password" name="password" type="password" autoComplete="current-password" required />
              {error && <p className="admin-form-error" role="alert">{error}</p>}
              <button className="admin-button admin-button-primary admin-login-submit" disabled={isSubmitting} type="submit">
                {isSubmitting ? "Signing in..." : "Sign in"}
                <span aria-hidden="true">→</span>
              </button>
            </form>
          ) : (
            <div className="admin-login-configuration" role="status">
              <strong>Supabase is not connected yet.</strong>
              <p>Add <code>NEXT_PUBLIC_SUPABASE_URL</code> and <code>NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY</code> to <code>.env.local</code>, apply the migrations, then restart the app.</p>
            </div>
          )}
          <p className="admin-login-back"><Link href="/">← Back to CartScout</Link></p>
        </div>
        <div className="admin-login-support">SECURE ACCESS · SUPERADMIN ONLY</div>
      </section>
    </main>
  );
}
