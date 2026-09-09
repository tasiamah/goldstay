// An observer's own way off a client's statement list.
//
// Reached from the link in the notice email we send when somebody is
// added. The person here has no Goldstay account and never asked to
// receive anything, so their consent is theirs to withdraw and this
// page must work without a sign-in, without the client's permission,
// and without any step that could plausibly be abandoned halfway.
//
// WHY THE GET DOES NOT UNSUBSCRIBE
//
// It would be one fewer click, and it would be wrong. Corporate mail
// gateways, link-safety scanners and Gmail's own prefetcher fetch
// URLs out of email bodies without a human involved. A GET that
// mutates would mean a proportion of observers silently stopped
// receiving statements because their employer's spam filter opened
// their post, and the client would have no idea. So the GET renders a
// confirmation and the button POSTs. This is also just what the HTTP
// method is for.

import { notFound } from "next/navigation";
import Link from "next/link";
import { findObserverByToken } from "@/lib/clients/observers";
import { StopForm } from "./StopForm";
import { launchedCityPhrase } from "@/lib/site";

export const dynamic = "force-dynamic";

export default async function StopStatementsPage({
  params,
}: {
  params: { token: string };
}) {
  const observer = await findObserverByToken(params.token);

  // A bad token is a 404 rather than an explanation. There is nothing
  // useful to say to somebody holding one, and confirming that a
  // token is merely "expired" rather than "never existed" tells an
  // enumerating stranger which guesses were close.
  if (!observer) notFound();

  const clientName = observer.client.fullName;

  if (observer.unsubscribedAt) {
    return (
      <Shell heading="You're already unsubscribed">
        <p className="text-charcoal/75">
          We stopped copying {escapeName(clientName)}&rsquo;s Goldstay
          statements to <strong>{observer.email}</strong> on{" "}
          {observer.unsubscribedAt.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "long",
            year: "numeric",
          })}
          . There is nothing more to do here.
        </p>
        <p className="mt-4 text-sm text-charcoal/60">
          If statements are still arriving, they are coming from somewhere
          else &mdash; reply to one and we&rsquo;ll look into it.
        </p>
      </Shell>
    );
  }

  if (observer.removedAt) {
    return (
      <Shell heading="You're no longer on this list">
        <p className="text-charcoal/75">
          {escapeName(clientName)} has already taken{" "}
          <strong>{observer.email}</strong> off their Goldstay statements, so
          you should not be receiving any more.
        </p>
        <p className="mt-4 text-sm text-charcoal/60">
          You can still block us for good below if you would rather they
          could not add you again.
        </p>
        <div className="mt-6">
          <StopForm token={params.token} clientName={clientName} />
        </div>
      </Shell>
    );
  }

  return (
    <Shell heading="Stop receiving these statements?">
      <p className="text-charcoal/75">
        <strong>{observer.email}</strong> is currently copied on the monthly
        Goldstay statement for {escapeName(clientName)}&rsquo;s property.
      </p>
      <p className="mt-4 text-charcoal/75">
        If you confirm below we will stop sending them, straight away and
        for good. You do not need to tell {escapeName(clientName)}, and they
        will not be able to add this address again &mdash; if you ever want
        them back, let us know and we will undo it.
      </p>
      <div className="mt-8">
        <StopForm token={params.token} clientName={clientName} />
      </div>
      <p className="mt-8 border-t border-charcoal/10 pt-6 text-sm text-charcoal/55">
        This only affects the statements you were copied on. You have no
        Goldstay account, and this page cannot sign you in to one.
      </p>
    </Shell>
  );
}

// A client's name is free text they typed about themselves. React
// escapes it on render, so this is only about not letting a stray
// entry break the sentence it sits in.
function escapeName(name: string): string {
  return name.trim() || "our client";
}

function Shell({
  heading,
  children,
}: {
  heading: string;
  children: React.ReactNode;
}) {
  return (
    <main className="mx-auto flex min-h-screen max-w-xl flex-col justify-center px-5 py-16">
      <Link
        href="/"
        className="font-serif text-xl text-charcoal no-underline"
      >
        Goldstay<span className="text-gold-600">.</span>
      </Link>
      <div className="mt-8 rounded-xl border border-charcoal/10 bg-white p-7 shadow-sm">
        <h1 className="font-serif text-2xl font-normal text-charcoal">
          {heading}
        </h1>
        <div className="mt-5">{children}</div>
      </div>
      <p className="mt-6 text-xs text-charcoal/45">
        Goldstay &middot; Property management in {launchedCityPhrase()}
      </p>
    </main>
  );
}
