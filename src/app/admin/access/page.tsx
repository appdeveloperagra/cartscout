import Link from "next/link";

export default function AdminAccessPage() {
  return (
    <main className="admin-access-screen">
      <section className="admin-access-card">
        <span className="admin-brand-mark">CS</span>
        <p className="admin-kicker">ACCESS RESTRICTED</p>
        <h1>This workspace is for superadmins.</h1>
        <p>Your account is signed in, but it does not have permission to manage CartScout.</p>
        <Link className="admin-button admin-button-primary" href="/admin/login">Use another account</Link>
      </section>
    </main>
  );
}
