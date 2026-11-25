import { Suspense } from "react";
import { getPublicContactSettings } from "@/lib/cms";
import { createPageMetadata } from "@/lib/site-seo";

export const metadata = createPageMetadata({
  title: "Privacy Policy",
  description: "How CartScout handles information when you browse its golf cart collection or contact the business.",
  path: "/privacy",
});

async function PrivacyContent() {
  const contact = await getPublicContactSettings();

  return (
    <main className="content-page legal-page">
      <div className="eyebrow"><span /> LEGAL</div>
      <h1>Privacy policy</h1>
      <p className="page-intro">This policy describes what happens to information when you use CartScout.</p>

      <section>
        <h2>Information you choose to share</h2>
        <p>
          Purchase and rental enquiry forms prepare a message in your device&apos;s email app. CartScout does not receive the form contents unless you choose to send that email. If you contact us by email, phone, or WhatsApp, we may use the details you provide to respond to your enquiry and coordinate next steps.
        </p>
      </section>
      <section>
        <h2>How information is used</h2>
        <p>
          Contact details and enquiry information are used to answer questions about golf carts or rental availability. The website does not process payments or make bookings automatically.
        </p>
      </section>
      <section>
        <h2>Website and third-party services</h2>
        <p>
          CartScout uses Google Tag Manager to manage measurement and advertising tags. Depending on the tags enabled in its container, Google and other providers may receive technical and usage information, such as pages viewed, browser or device details, and online identifiers, and may use cookies or similar technologies. The hosting provider may also process standard technical information needed to deliver and protect the website. Phone, email, and WhatsApp links open services operated by third parties; their own privacy terms apply when you use those services.
        </p>
      </section>
      <section>
        <h2>Your choices and questions</h2>
        <p>
          You can choose not to submit an enquiry. To ask about personal information you have sent directly to CartScout, contact <a className="inline-link" href={`mailto:${contact.email}`}>{contact.email}</a>.
        </p>
      </section>
      <p className="small-print">
        This summary reflects the website&apos;s current features. The business should review it against its actual email handling, hosting arrangements, and applicable privacy laws before launch.
      </p>
    </main>
  );
}

export default function PrivacyPage() {
  return (
    <Suspense fallback={<main className="content-page" role="status">Loading privacy information...</main>}>
      <PrivacyContent />
    </Suspense>
  );
}
