import { describe, expect, it } from "vitest";
import {
  escalationTaskNotes,
  escalationTaskTitle,
  escalationWaMessage,
  reminderCopy,
  renderEscalationEmail,
  renderReminderEmail,
} from "./reminder-email";
import {
  ESCALATION_STEP,
  LAST_EMAIL_STEP,
  REMINDER_LADDER,
} from "./reminder-schedule";

const BASE = {
  clientName: "Asha Kimani",
  propertyLabel: "Riverside Apartments 4B",
  reference: "GS-2026-014",
  link: "https://goldstay.co.ke/auth/callback?token_hash=abc&next=%2Fclient",
};

const EMAIL_STEPS = REMINDER_LADDER.filter((s) => s.kind === "EMAIL").map(
  (s) => s.step,
);

describe("reminder copy coverage", () => {
  it("has copy for every email rung of the ladder", () => {
    // A missing template would claim the step, fail to render and burn
    // one of the client's reminders on nothing.
    for (const step of EMAIL_STEPS) {
      expect(reminderCopy(step), `step ${step}`).not.toBeNull();
    }
  });

  it("has no client copy for the escalation step", () => {
    // Step 5 raises a task and emails ops. If it had client copy it
    // would be a fifth email, which is the thing the ladder exists to
    // avoid.
    expect(reminderCopy(ESCALATION_STEP)).toBeNull();
  });

  it("has no copy for steps outside the ladder", () => {
    expect(reminderCopy(0)).toBeNull();
    expect(reminderCopy(99)).toBeNull();
  });

  it("gives every rung its own wording", () => {
    // Identical copy under a different subject is what makes a chase
    // read as a drip campaign.
    const leads = EMAIL_STEPS.map((s) => reminderCopy(s)!.lead);
    expect(new Set(leads).size).toBe(leads.length);
    const subjects = EMAIL_STEPS.map((s) => reminderCopy(s)!.subject);
    expect(new Set(subjects).size).toBe(subjects.length);
  });

  it("gets shorter as it escalates, not longer", () => {
    // Someone ignoring reminder three will not read a longer version of
    // reminder two.
    const lengths = EMAIL_STEPS.map((s) => {
      const c = reminderCopy(s)!;
      return c.lead.length + c.body.length;
    });
    expect(lengths[lengths.length - 1]).toBeLessThan(lengths[0]);
  });

  it("promises the WhatsApp handover in the final email and nowhere earlier", () => {
    const final = reminderCopy(LAST_EMAIL_STEP)!;
    expect(final.body.toLowerCase()).toContain("whatsapp");
    expect(final.lead.toLowerCase()).toContain("last email");
    for (const step of EMAIL_STEPS.filter((s) => s !== LAST_EMAIL_STEP)) {
      expect(reminderCopy(step)!.lead.toLowerCase()).not.toContain(
        "last email",
      );
    }
  });

  it("never counts its own reminders at the client", () => {
    // "This is the third time we have written and we have not heard
    // back" is accurate and reads as a telling-off. Nobody signs a
    // contract because they have been kept score of, and the firmness
    // is meant to come from what each email offers instead.
    for (const step of EMAIL_STEPS) {
      const c = reminderCopy(step)!;
      const prose = `${c.subject} ${c.lead} ${c.body}`.toLowerCase();
      for (const phrase of [
        "second time",
        "third time",
        "fourth time",
        "second email",
        "third email",
        "not heard back",
        "again and again",
        "as we said",
      ]) {
        expect(prose, `step ${step} says "${phrase}"`).not.toContain(phrase);
      }
    }
  });

  it("never states an elapsed duration", () => {
    // The copy used to say "a few days" on step 2 and "it has been a
    // week" on step 3. Both were true on the 1/3/7/14-day ladder and
    // both became lies the day it moved to 24/48/72h, because the
    // wording lives in this file and the timings live in
    // reminder-schedule.ts. Counting sends survives a retune; counting
    // days does not.
    for (const step of EMAIL_STEPS) {
      const c = reminderCopy(step)!;
      const prose = `${c.subject} ${c.lead} ${c.body}`.toLowerCase();
      for (const phrase of [
        "a few days",
        "a week",
        "two weeks",
        "a fortnight",
        "days ago",
        "24 hours",
        "48 hours",
        "72 hours",
      ]) {
        expect(prose, `step ${step} says "${phrase}"`).not.toContain(phrase);
      }
    }
  });
});

describe("renderReminderEmail", () => {
  it("names the property in the subject", () => {
    // A client with several properties has to know which one is being
    // chased from the inbox list alone.
    const out = renderReminderEmail({ ...BASE, step: 1 })!;
    expect(out.subject).toContain("Riverside Apartments 4B");
  });

  it("distinguishes two agreements on the same unit", () => {
    // The real case this exists for: one unit, a short-let agreement at
    // 20% and a long-let at 10%, both unsigned. The property label is
    // identical for both, so without the template title the client gets
    // two reminders he cannot tell apart and has no way to know which
    // contract he is being asked to sign.
    const shortLet = renderReminderEmail({
      ...BASE,
      step: 2,
      agreementTitle: "Short-let property management agreement",
    })!;
    const longLet = renderReminderEmail({
      ...BASE,
      step: 2,
      agreementTitle: "Long-term property management agreement",
    })!;

    expect(shortLet.subject).not.toBe(longLet.subject);
    expect(shortLet.subject).toContain("Short-let");
    expect(longLet.subject).toContain("Long-term");
    // Also in the body, so it is unmistakable once opened and not only
    // in the inbox list.
    expect(shortLet.text).toContain("Short-let property management agreement");
    expect(shortLet.html).toContain("Short-let property management agreement");
  });

  it("still sends without an agreement title", () => {
    const out = renderReminderEmail({ ...BASE, step: 2 })!;
    expect(out.subject).toContain("Riverside Apartments 4B");
    expect(out.subject).not.toContain("undefined");
    expect(out.text).not.toContain("Agreement:");
  });

  it("escapes an agreement title in the html", () => {
    const out = renderReminderEmail({
      ...BASE,
      step: 2,
      agreementTitle: "<script>alert(1)</script>",
    })!;
    expect(out.html).not.toContain("<script>");
    expect(out.html).toContain("&lt;script&gt;");
  });

  it("includes the sign-in link in both text and html", () => {
    const out = renderReminderEmail({ ...BASE, step: 2 })!;
    expect(out.text).toContain(BASE.link);
    expect(out.html).toContain("token_hash=abc");
  });

  it("greets by first name only", () => {
    const out = renderReminderEmail({ ...BASE, step: 1 })!;
    expect(out.text).toContain("Hi Asha,");
    expect(out.html).toContain("Hi Asha,");
  });

  it("falls back to a greeting when the name is unusable", () => {
    const out = renderReminderEmail({ ...BASE, step: 1, clientName: "" })!;
    expect(out.text).toContain("Hi there,");
  });

  it("omits the reference line when there is none", () => {
    const withRef = renderReminderEmail({ ...BASE, step: 1 })!;
    expect(withRef.text).toContain("Reference GS-2026-014.");
    const without = renderReminderEmail({ ...BASE, step: 1, reference: null })!;
    expect(without.text).not.toContain("Reference");
    expect(without.html).not.toContain("Reference");
  });

  it("returns null rather than an empty email for an unknown step", () => {
    expect(renderReminderEmail({ ...BASE, step: 42 })).toBeNull();
  });

  it("escapes a property name that would otherwise break the markup", () => {
    // Property names are operator free text and go out on the client's
    // behalf, so one containing angle brackets must not inject markup.
    const out = renderReminderEmail({
      ...BASE,
      step: 1,
      propertyLabel: 'Ochieng & Sons <script>alert("x")</script>',
    })!;
    expect(out.html).not.toContain("<script>");
    expect(out.html).toContain("&lt;script&gt;");
    expect(out.html).toContain("Ochieng &amp; Sons");
  });

  it("escapes a magic link so its query string cannot break the href", () => {
    const out = renderReminderEmail({
      ...BASE,
      step: 1,
      link: 'https://goldstay.co.ke/a?b=1"onmouseover="alert(1)',
    })!;
    expect(out.html).not.toContain('"onmouseover="');
    expect(out.html).toContain("&quot;onmouseover=&quot;");
  });

  it("renders every rung without throwing", () => {
    for (const step of EMAIL_STEPS) {
      const out = renderReminderEmail({ ...BASE, step });
      expect(out, `step ${step}`).not.toBeNull();
      expect(out!.text.length, `step ${step}`).toBeGreaterThan(80);
      expect(out!.html, `step ${step}`).toContain("<!doctype html>");
    }
  });
});

describe("renderEscalationEmail", () => {
  const ESC = {
    clientName: "Asha Kimani",
    clientEmail: "asha@example.com",
    clientPhone: "+254700000000",
    propertyLabel: "Riverside Apartments 4B",
    propertyCity: "Nairobi",
    reference: "GS-2026-014",
    sentAt: new Date("2026-03-01T10:00:00Z"),
    emailsSent: 4,
    adminLink: "https://goldstay.co.ke/admin/properties/p1",
    waLink: "https://wa.me/254700000000?text=Hi%20Asha",
    now: new Date("2026-03-09T10:00:00Z"),
  };

  it("leads with how long it has been unsigned", () => {
    const out = renderEscalationEmail(ESC);
    expect(out.subject).toContain("8 days");
    expect(out.subject).toContain("Riverside Apartments 4B");
  });

  it("says that automated emailing has stopped", () => {
    // Ops must not assume the system is still working on it, or the
    // client falls into the gap between the two.
    const out = renderEscalationEmail(ESC);
    expect(out.text).toContain("automated emailing has stopped");
  });

  it("leads the ask with the WhatsApp deeplink", () => {
    // These clients are mostly abroad. A call means working out a
    // timezone and an international dial; the deeplink is one tap and
    // leaves a thread the next person can read.
    const out = renderEscalationEmail(ESC);
    expect(out.text).toContain(ESC.waLink);
    expect(out.text).toContain("WhatsApp them");
  });

  it("explains itself when the number could not be resolved", () => {
    // Silence here would read as "we forgot the link" rather than "we
    // could not tell which country this number is".
    const out = renderEscalationEmail({ ...ESC, waLink: null });
    expect(out.text).not.toContain("wa.me");
    expect(out.text).toContain("could not tell which country");
    // The raw number still has to be there to act on.
    expect(out.text).toContain("+254700000000");
  });

  it("says there is no number at all when there is not", () => {
    const out = renderEscalationEmail({
      ...ESC,
      clientPhone: null,
      waLink: null,
    });
    expect(out.text).toContain("Phone: not on file");
    expect(out.text).toContain("no phone number on this client");
  });

  it("links to the property in admin", () => {
    expect(renderEscalationEmail(ESC).text).toContain(ESC.adminLink);
  });

  it("pluralises the reminder count", () => {
    expect(renderEscalationEmail({ ...ESC, emailsSent: 1 }).text).toContain(
      "1 reminder ",
    );
    expect(renderEscalationEmail(ESC).text).toContain("4 reminders");
  });

  it("reframes the weekly follow-ups as nobody having closed it", () => {
    // Week three of the same email reading like week one is how an ops
    // inbox learns to ignore it.
    const wk3 = renderEscalationEmail({ ...ESC, followUpNumber: 3 });
    expect(wk3.subject).toContain("week 3");
    expect(wk3.text).toContain("Nobody has closed the task");
    expect(wk3.text).toContain("3 weeks after it was handed over");
    // And it offers the way out, which the handover email must not:
    // closing the task is the only thing that stops the weekly arrival.
    expect(wk3.text).toContain("close the task");
    expect(renderEscalationEmail(ESC).text).not.toContain("close the task");
  });

  it("says week 1 in the singular", () => {
    const wk1 = renderEscalationEmail({ ...ESC, followUpNumber: 1 });
    expect(wk1.text).toContain("1 week after");
    expect(wk1.text).not.toContain("1 weeks");
  });
});

describe("escalation task", () => {
  it("states the action in the title, not just the problem", () => {
    // It lands in a task list, so it has to read as an instruction.
    const title = escalationTaskTitle({
      clientName: "Asha Kimani",
      propertyLabel: "Riverside Apartments 4B",
    });
    expect(title).toContain("WhatsApp Asha Kimani");
    expect(title).toContain("Riverside Apartments 4B");
  });

  it("titles the weekly ones differently so they do not look duplicated", () => {
    const first = escalationTaskTitle({
      clientName: "Asha Kimani",
      propertyLabel: "Riverside Apartments 4B",
    });
    const week2 = escalationTaskTitle({
      clientName: "Asha Kimani",
      propertyLabel: "Riverside Apartments 4B",
      followUpNumber: 2,
    });
    expect(week2).not.toBe(first);
    expect(week2).toContain("Week 2");
  });

  it("puts the contact details in the notes so nobody has to hunt", () => {
    const notes = escalationTaskNotes({
      emailsSent: 4,
      clientPhone: "+254700000000",
      clientEmail: "asha@example.com",
      waLink: "https://wa.me/254700000000?text=Hi%20Asha",
    });
    expect(notes).toContain("wa.me/254700000000");
    expect(notes).toContain("+254700000000");
    expect(notes).toContain("asha@example.com");
    expect(notes).toContain("4 email reminders sent");
    expect(notes).toContain("cannot go live");
  });

  it("tells the operator to dial by hand when there is no deeplink", () => {
    const notes = escalationTaskNotes({
      emailsSent: 4,
      clientPhone: "07700900123",
      clientEmail: "asha@example.com",
      waLink: null,
    });
    expect(notes).toContain("dial it by hand");
    expect(notes).toContain("07700900123");
  });

  it("tells the operator how to stop the weekly ones", () => {
    const notes = escalationTaskNotes({
      emailsSent: 4,
      clientPhone: "+254700000000",
      clientEmail: "asha@example.com",
      waLink: null,
      followUpNumber: 2,
    });
    expect(notes).toContain("repeats weekly until someone does");
    expect(notes).toContain("2 weeks ago");
  });
});

describe("escalationWaMessage", () => {
  it("is first-person, names the property and ends in a question", () => {
    // A statement invites no reply. The whole point of the handover is
    // to start a conversation with someone email has failed to reach.
    const msg = escalationWaMessage({
      clientName: "Asha Kimani",
      propertyLabel: "Riverside Apartments 4B",
    });
    expect(msg).toContain("Asha");
    expect(msg).not.toContain("Kimani");
    expect(msg).toContain("Riverside Apartments 4B");
    expect(msg.trim().endsWith("?")).toBe(true);
  });
});
