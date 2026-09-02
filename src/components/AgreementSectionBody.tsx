// Renders one AgreementSection as HTML. The React-PDF template in
// src/lib/agreements/AgreementDocument.tsx renders the same three
// shapes for print; both must stay in step, because the executed PDF
// and the page the client accepted from have to say the same thing.

import type { AgreementSection } from "@/lib/agreements/text";

export function AgreementSectionBody({
  section,
}: {
  section: AgreementSection;
}) {
  return (
    <section className="mb-7">
      <h3 className="text-base font-semibold text-stone-900">
        {section.heading}
      </h3>

      {section.body.map((p, i) => (
        <p key={i} className="mt-2 text-sm leading-6">
          {p}
        </p>
      ))}

      {section.rows?.length ? (
        <dl className="mt-3 divide-y divide-stone-200 border-y border-stone-200 text-sm">
          {section.rows.map((row) => (
            <div
              key={row.label}
              className="grid gap-1 py-3 sm:grid-cols-[10rem_1fr] sm:gap-4"
            >
              <dt className="font-medium text-stone-900">{row.label}</dt>
              <dd className="space-y-0.5 text-stone-700">
                {row.value.map((line, i) => (
                  <div key={i} className="leading-6">
                    {line}
                  </div>
                ))}
              </dd>
            </div>
          ))}
        </dl>
      ) : null}

      {section.bullets?.length ? (
        <ul className="mt-3 space-y-2 text-sm leading-6">
          {section.bullets.map((b, i) => (
            <li key={i} className="flex gap-2.5">
              <span aria-hidden="true" className="mt-2 text-stone-400">
                •
              </span>
              <span>{b}</span>
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
