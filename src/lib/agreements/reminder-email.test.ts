import { describe, expect, it } from "vitest";
import {
  escalationTaskNotes,
  escalationTaskTitle,
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

  it("promises a call in the final email and nowhere earlier", () => {
    const final = reminderCopy(LAST_EMAIL_STEP)!;
    expect(final.body.toLowerCase()).toContain("call");
    expect(final.lead.toLowerCase()).toContain("last email");
    for (const step of EMAIL_STEPS.filter((s) => s !== LAST_EMAIL_STEP)) {
      expect(reminderCopy(step)!.lead.toLowerCase()).not.toContain(
        "last email",
      );
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
    now: new Date("2026-03-22T10:00:00Z"),
  };

  it("leads with how long it has been unsigned", () => {
    const out = renderEscalationEmail(ESC);
    expect(out.subject).toContain("21 days");
    expect(out.subject).toContain("Riverside Apartments 4B");
  });

  it("says that automated chasing has stopped", () => {
    // Ops must not assume the system is still working on it, or the
    // client falls into the gap between the two.
    const out = renderEscalationEmail(ESC);
    expect(out.text).toContain("automated chasing has stopped");
    expect(out.text).toContain("Someone needs to call them");
  });

  it("carries the phone number, since the ask is a phone call", () => {
    expect(renderEscalationEmail(ESC).text).toContain("+254700000000");
  });

  it("says so plainly when there is no phone number on file", () => {
    const out = renderEscalationEmail({ ...ESC, clientPhone: null });
    expect(out.text).toContain("Phone: not on file");
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
});

describe("escalation task", () => {
  it("states the action in the title, not just the problem", () => {
    // It lands in a task list, so it has to read as an instruction.
    const title = escalationTaskTitle({
      clientName: "Asha Kimani",
      propertyLabel: "Riverside Apartments 4B",
    });
    expect(title).toContain("Call Asha Kimani");
    expect(title).toContain("Riverside Apartments 4B");
  });

  it("puts the contact details in the notes so nobody has to hunt", () => {
    const notes = escalationTaskNotes({
      emailsSent: 4,
      clientPhone: "+254700000000",
      clientEmail: "asha@example.com",
    });
    expect(notes).toContain("+254700000000");
    expect(notes).toContain("asha@example.com");
    expect(notes).toContain("4 email reminders sent");
    expect(notes).toContain("cannot go live");
  });
});
