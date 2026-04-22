"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Loader2, ArrowRight, ArrowLeft, ShieldCheck } from "lucide-react";
import { toast } from "@/lib/toast";

// Fields intentionally mirror what Goldstay asks for in a verbal reference
// call today, so the human check after submission is a confirmation exercise
// rather than a repeat interview. Nothing on this form is shown to the
// applicant as a score or grade. That stays internal to ops.
type FormValues = {
  applyingFor?: string;
  referredBy?: string;

  fullName: string;
  dob: string;
  nationality: string;
  idType: "National ID" | "Passport" | "Driver's Licence" | "Other";
  idNumber: string;
  maritalStatus:
    | "Single"
    | "Married"
    | "Partnered"
    | "Divorced"
    | "Widowed"
    | "Prefer not to say";
  dependants: number;

  phone: string;
  whatsapp: string;
  email: string;
  currentCity: string;
  currentAddress: string;

  employmentType:
    | "salaried"
    | "self-employed"
    | "contract"
    | "business-owner"
    | "unemployed"
    | "student"
    | "other";
  employer: string;
  jobTitle: string;
  employmentMonths: number;
  employerPhone: string;
  employerEmail: string;
  monthlyIncomeUsd: number;
  secondaryIncomeUsd?: number;
  bankName: string;
  canProvideStatement: boolean;

  currentRentUsd?: number;
  targetRentUsd: number;
  moveInDate: string;
  reasonForMoving: string;

  hasPreviousLandlord: boolean;
  previousLandlordName?: string;
  previousLandlordPhone?: string;
  previousLandlordProperty?: string;
  previousLandlordMonthsTenure?: number;
  previousLandlordRentUsd?: number;
  previousLandlordDisputeDisclosed: boolean;
  previousLandlordNotes?: string;

  hasGuarantor: boolean;
  guarantorName?: string;
  guarantorRelation?: string;
  guarantorPhone?: string;
  guarantorEmail?: string;

  nextOfKinName: string;
  nextOfKinRelation: string;
  nextOfKinPhone: string;

  evictedBefore: boolean;
  evictionExplanation?: string;
  convictedOfFraud: boolean;
  convictionExplanation?: string;

  consentBackgroundCheck: boolean;
  consentLandlordReference: boolean;
  consentDataProcessing: boolean;
};

const stepTitles = [
  "About you",
  "Employment & income",
  "The property",
  "Previous landlord",
  "Guarantor & next of kin",
  "Disclosures & consent",
] as const;

export function TenantApplicationForm({
  token,
  prefillProperty,
  prefillCity,
}: {
  token?: string;
  prefillProperty?: string;
  prefillCity?: string;
}) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    watch,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: {
      applyingFor: prefillProperty,
      currentCity: prefillCity,
      idType: "National ID",
      maritalStatus: "Single",
      dependants: 0,
      employmentType: "salaried",
      canProvideStatement: true,
      hasPreviousLandlord: true,
      previousLandlordDisputeDisclosed: false,
      hasGuarantor: false,
      evictedBefore: false,
      convictedOfFraud: false,
    },
    mode: "onTouched",
  });

  const [step, setStep] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const hasPreviousLandlord = watch("hasPreviousLandlord");
  const hasGuarantor = watch("hasGuarantor");
  const evictedBefore = watch("evictedBefore");
  const convictedOfFraud = watch("convictedOfFraud");

  const stepFields: Record<number, (keyof FormValues)[]> = useMemo(
    () => ({
      0: [
        "fullName",
        "dob",
        "nationality",
        "idType",
        "idNumber",
        "phone",
        "whatsapp",
        "email",
        "currentCity",
        "currentAddress",
      ],
      1: [
        "employmentType",
        "employer",
        "jobTitle",
        "employmentMonths",
        "employerPhone",
        "monthlyIncomeUsd",
        "bankName",
      ],
      2: ["targetRentUsd", "moveInDate", "reasonForMoving"],
      3: ["hasPreviousLandlord"],
      4: ["nextOfKinName", "nextOfKinRelation", "nextOfKinPhone"],
      5: [
        "consentBackgroundCheck",
        "consentLandlordReference",
        "consentDataProcessing",
      ],
    }),
    [],
  );

  const handleNext = async () => {
    const ok = await trigger(stepFields[step] as (keyof FormValues)[]);
    if (!ok) return;
    setStep((s) => Math.min(s + 1, stepTitles.length - 1));
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBack = () => {
    setStep((s) => Math.max(s - 1, 0));
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onSubmit = async (data: FormValues) => {
    setError(null);
    try {
      const res = await fetch("/api/tenant-application", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, token }),
      });
      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || "Submission failed");
      }
      toast.success("Application received. Goldstay will be in touch.");
      router.push("/apply/thank-you");
    } catch (e: unknown) {
      const message =
        e instanceof Error
          ? e.message
          : "Something went wrong. Please try again, or WhatsApp your Goldstay contact.";
      setError(message);
      toast.error(message);
    }
  };

  // Mirrors the ListPropertyForm pattern: surface a toast whenever
  // validation blocks a submit. Most common case here is the three
  // consent checkboxes on the last step.
  const onInvalid = () => {
    toast.error("Please complete the required fields before submitting.");
  };

  const field =
    "mt-2 block w-full rounded-xl border border-charcoal/15 bg-white px-4 py-3 text-sm text-charcoal placeholder:text-charcoal/40 focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500/30";
  const label = "eyebrow";
  const req = (
    <span className="ml-1 font-mono text-[0.6rem] text-gold-700">required</span>
  );

  return (
    <form
      onSubmit={handleSubmit(onSubmit, onInvalid)}
      className="grid gap-8 rounded-3xl border border-charcoal/10 bg-cream p-6 shadow-soft md:p-10"
      noValidate
    >
      <div>
        <div className="flex items-center justify-between">
          <div className="font-mono text-[0.65rem] uppercase tracking-widest-xl text-charcoal/55">
            Step {step + 1} of {stepTitles.length}
          </div>
          <div className="font-mono text-[0.65rem] uppercase tracking-widest-xl text-charcoal/55">
            {Math.round(((step + 1) / stepTitles.length) * 100)}%
          </div>
        </div>
        <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-charcoal/10">
          <div
            className="h-full bg-gold-500 transition-all duration-500 ease-premium"
            style={{ width: `${((step + 1) / stepTitles.length) * 100}%` }}
          />
        </div>
        <h2 className="mt-6 font-serif text-3xl text-charcoal md:text-4xl">
          {stepTitles[step]}
        </h2>
      </div>

      {step === 0 ? (
        <div className="grid gap-6 md:grid-cols-2">
          {prefillProperty ? (
            <div className="md:col-span-2">
              <label className={label}>Applying for</label>
              <input
                className={`${field} bg-charcoal/5`}
                readOnly
                {...register("applyingFor")}
              />
            </div>
          ) : (
            <div className="md:col-span-2">
              <label className={label}>Which property are you applying for?</label>
              <input
                className={field}
                placeholder="Property name or address, if known"
                {...register("applyingFor")}
              />
            </div>
          )}

          <div className="md:col-span-2">
            <label className={label}>Referred by</label>
            <input
              className={field}
              placeholder="Agent or contact who sent you this link"
              {...register("referredBy")}
            />
          </div>

          <div>
            <label className={label}>Full legal name{req}</label>
            <input
              className={field}
              placeholder="As on your ID"
              {...register("fullName", { required: true })}
            />
            {errors.fullName ? (
              <p className="mt-1 text-xs text-red-700">Required</p>
            ) : null}
          </div>
          <div>
            <label className={label}>Date of birth{req}</label>
            <input
              type="date"
              className={field}
              {...register("dob", { required: true })}
            />
          </div>
          <div>
            <label className={label}>Nationality{req}</label>
            <input
              className={field}
              placeholder="e.g. Kenyan, Ghanaian"
              {...register("nationality", { required: true })}
            />
          </div>
          <div>
            <label className={label}>ID type{req}</label>
            <select className={field} {...register("idType", { required: true })}>
              <option>National ID</option>
              <option>Passport</option>
              <option>Driver&apos;s Licence</option>
              <option>Other</option>
            </select>
          </div>
          <div>
            <label className={label}>ID number{req}</label>
            <input
              className={field}
              placeholder="Document number"
              {...register("idNumber", { required: true })}
            />
          </div>
          <div>
            <label className={label}>Marital status</label>
            <select className={field} {...register("maritalStatus")}>
              <option>Single</option>
              <option>Married</option>
              <option>Partnered</option>
              <option>Divorced</option>
              <option>Widowed</option>
              <option>Prefer not to say</option>
            </select>
          </div>
          <div>
            <label className={label}>Dependants in the household</label>
            <input
              type="number"
              min={0}
              className={field}
              {...register("dependants", { valueAsNumber: true })}
            />
          </div>
          <div>
            <label className={label}>Phone{req}</label>
            <input
              className={field}
              placeholder="+254..."
              {...register("phone", { required: true })}
            />
          </div>
          <div>
            <label className={label}>WhatsApp{req}</label>
            <input
              className={field}
              placeholder="If different from phone"
              {...register("whatsapp", { required: true })}
            />
          </div>
          <div>
            <label className={label}>Email{req}</label>
            <input
              type="email"
              className={field}
              placeholder="you@example.com"
              {...register("email", { required: true })}
            />
          </div>
          <div>
            <label className={label}>Current city{req}</label>
            <input
              className={field}
              placeholder="e.g. Nairobi, Accra"
              {...register("currentCity", { required: true })}
            />
          </div>
          <div className="md:col-span-2">
            <label className={label}>Current residential address{req}</label>
            <input
              className={field}
              placeholder="Estate, building, house number"
              {...register("currentAddress", { required: true })}
            />
          </div>
        </div>
      ) : null}

      {step === 1 ? (
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label className={label}>Employment type{req}</label>
            <select
              className={field}
              {...register("employmentType", { required: true })}
            >
              <option value="salaried">Salaried employee</option>
              <option value="contract">Contract / consulting</option>
              <option value="self-employed">Self-employed</option>
              <option value="business-owner">Business owner</option>
              <option value="student">Student</option>
              <option value="unemployed">Between jobs</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className={label}>Employer or business name{req}</label>
            <input
              className={field}
              placeholder="Company name"
              {...register("employer", { required: true })}
            />
          </div>
          <div>
            <label className={label}>Job title{req}</label>
            <input
              className={field}
              placeholder="Your role"
              {...register("jobTitle", { required: true })}
            />
          </div>
          <div>
            <label className={label}>Months in role{req}</label>
            <input
              type="number"
              min={0}
              className={field}
              {...register("employmentMonths", {
                required: true,
                valueAsNumber: true,
              })}
            />
          </div>
          <div>
            <label className={label}>Employer phone{req}</label>
            <input
              className={field}
              placeholder="HR or direct line for verification"
              {...register("employerPhone", { required: true })}
            />
          </div>
          <div>
            <label className={label}>Employer email</label>
            <input
              type="email"
              className={field}
              placeholder="HR or manager email"
              {...register("employerEmail")}
            />
          </div>
          <div>
            <label className={label}>Monthly income, USD{req}</label>
            <input
              type="number"
              min={0}
              step={50}
              className={field}
              placeholder="Net monthly take-home"
              {...register("monthlyIncomeUsd", {
                required: true,
                valueAsNumber: true,
              })}
            />
          </div>
          <div>
            <label className={label}>Other monthly income, USD</label>
            <input
              type="number"
              min={0}
              step={50}
              className={field}
              placeholder="Side income, rental, dividends"
              {...register("secondaryIncomeUsd", { valueAsNumber: true })}
            />
          </div>
          <div>
            <label className={label}>Primary bank or mobile money{req}</label>
            <input
              className={field}
              placeholder="e.g. Equity, KCB, MTN MoMo"
              {...register("bankName", { required: true })}
            />
          </div>
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              className="mt-1 h-4 w-4 rounded border-charcoal/30 text-gold-600 focus:ring-gold-500"
              {...register("canProvideStatement")}
            />
            <label className="text-sm text-charcoal/75">
              I can provide three months of bank or MPESA / MoMo statement if
              Goldstay asks.
            </label>
          </div>
        </div>
      ) : null}

      {step === 2 ? (
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label className={label}>Current monthly rent, USD</label>
            <input
              type="number"
              min={0}
              step={50}
              className={field}
              placeholder="Leave blank if you currently own or live with family"
              {...register("currentRentUsd", { valueAsNumber: true })}
            />
          </div>
          <div>
            <label className={label}>Target monthly rent, USD{req}</label>
            <input
              type="number"
              min={0}
              step={50}
              className={field}
              placeholder="What the property you&apos;re applying for costs"
              {...register("targetRentUsd", {
                required: true,
                valueAsNumber: true,
              })}
            />
          </div>
          <div>
            <label className={label}>Desired move-in date{req}</label>
            <input
              type="date"
              className={field}
              {...register("moveInDate", { required: true })}
            />
          </div>
          <div className="md:col-span-2">
            <label className={label}>Why are you moving?{req}</label>
            <textarea
              rows={3}
              className={field}
              placeholder="Closer to work, growing family, landlord selling up, end of lease..."
              {...register("reasonForMoving", { required: true })}
            />
          </div>
        </div>
      ) : null}

      {step === 3 ? (
        <div className="grid gap-6">
          <label className="flex items-start gap-3 text-sm text-charcoal/80">
            <input
              type="checkbox"
              className="mt-1 h-4 w-4 rounded border-charcoal/30 text-gold-600 focus:ring-gold-500"
              {...register("hasPreviousLandlord")}
            />
            <span>
              I have a previous or current landlord who can give Goldstay a
              reference.
            </span>
          </label>

          {hasPreviousLandlord ? (
            <div className="grid gap-6 rounded-2xl border border-charcoal/10 bg-white p-5 md:grid-cols-2">
              <div>
                <label className={label}>Previous landlord name</label>
                <input
                  className={field}
                  placeholder="Individual or agency"
                  {...register("previousLandlordName")}
                />
              </div>
              <div>
                <label className={label}>Previous landlord phone</label>
                <input
                  className={field}
                  placeholder="WhatsApp if possible"
                  {...register("previousLandlordPhone")}
                />
              </div>
              <div className="md:col-span-2">
                <label className={label}>Property you rented from them</label>
                <input
                  className={field}
                  placeholder="Estate, building, house number"
                  {...register("previousLandlordProperty")}
                />
              </div>
              <div>
                <label className={label}>How many months did you rent?</label>
                <input
                  type="number"
                  min={0}
                  className={field}
                  {...register("previousLandlordMonthsTenure", {
                    valueAsNumber: true,
                  })}
                />
              </div>
              <div>
                <label className={label}>Monthly rent you paid, USD</label>
                <input
                  type="number"
                  min={0}
                  step={50}
                  className={field}
                  {...register("previousLandlordRentUsd", {
                    valueAsNumber: true,
                  })}
                />
              </div>
              <label className="md:col-span-2 flex items-start gap-3 text-sm text-charcoal/80">
                <input
                  type="checkbox"
                  className="mt-1 h-4 w-4 rounded border-charcoal/30 text-gold-600 focus:ring-gold-500"
                  {...register("previousLandlordDisputeDisclosed")}
                />
                <span>
                  There was a dispute or unpaid balance with this landlord that
                  I want to explain up front.
                </span>
              </label>
              <div className="md:col-span-2">
                <label className={label}>Anything we should know?</label>
                <textarea
                  rows={3}
                  className={field}
                  placeholder="Your side of the story, context that will help our reference call go well"
                  {...register("previousLandlordNotes")}
                />
              </div>
            </div>
          ) : null}
        </div>
      ) : null}

      {step === 4 ? (
        <div className="grid gap-6">
          <div className="grid gap-6 md:grid-cols-3">
            <div>
              <label className={label}>Next of kin name{req}</label>
              <input
                className={field}
                {...register("nextOfKinName", { required: true })}
              />
            </div>
            <div>
              <label className={label}>Relationship{req}</label>
              <input
                className={field}
                placeholder="Parent, sibling, spouse..."
                {...register("nextOfKinRelation", { required: true })}
              />
            </div>
            <div>
              <label className={label}>Next of kin phone{req}</label>
              <input
                className={field}
                {...register("nextOfKinPhone", { required: true })}
              />
            </div>
          </div>

          <label className="flex items-start gap-3 text-sm text-charcoal/80">
            <input
              type="checkbox"
              className="mt-1 h-4 w-4 rounded border-charcoal/30 text-gold-600 focus:ring-gold-500"
              {...register("hasGuarantor")}
            />
            <span>
              I&apos;m providing a guarantor who will co-sign the lease.
            </span>
          </label>

          {hasGuarantor ? (
            <div className="grid gap-6 rounded-2xl border border-charcoal/10 bg-white p-5 md:grid-cols-2">
              <div>
                <label className={label}>Guarantor name</label>
                <input className={field} {...register("guarantorName")} />
              </div>
              <div>
                <label className={label}>Relationship to you</label>
                <input className={field} {...register("guarantorRelation")} />
              </div>
              <div>
                <label className={label}>Guarantor phone</label>
                <input className={field} {...register("guarantorPhone")} />
              </div>
              <div>
                <label className={label}>Guarantor email</label>
                <input
                  type="email"
                  className={field}
                  {...register("guarantorEmail")}
                />
              </div>
            </div>
          ) : null}
        </div>
      ) : null}

      {step === 5 ? (
        <div className="grid gap-6">
          <label className="flex items-start gap-3 text-sm text-charcoal/80">
            <input
              type="checkbox"
              className="mt-1 h-4 w-4 rounded border-charcoal/30 text-gold-600 focus:ring-gold-500"
              {...register("evictedBefore")}
            />
            <span>
              I have been asked to leave a property before the end of a lease
              in the last five years.
            </span>
          </label>
          {evictedBefore ? (
            <div>
              <label className={label}>Briefly, what happened?</label>
              <textarea
                rows={3}
                className={field}
                placeholder="Be honest. Context matters more than you think."
                {...register("evictionExplanation")}
              />
            </div>
          ) : null}

          <label className="flex items-start gap-3 text-sm text-charcoal/80">
            <input
              type="checkbox"
              className="mt-1 h-4 w-4 rounded border-charcoal/30 text-gold-600 focus:ring-gold-500"
              {...register("convictedOfFraud")}
            />
            <span>
              I have been convicted of a fraud or financial offence in the
              last ten years.
            </span>
          </label>
          {convictedOfFraud ? (
            <div>
              <label className={label}>Brief context</label>
              <textarea
                rows={3}
                className={field}
                {...register("convictionExplanation")}
              />
            </div>
          ) : null}

          <div className="rounded-2xl border border-charcoal/10 bg-white p-5">
            <div className="flex items-start gap-3 text-charcoal">
              <ShieldCheck className="mt-1 h-5 w-5 text-gold-600" />
              <div>
                <div className="font-serif text-lg">How Goldstay uses this</div>
                <p className="mt-1 text-sm text-charcoal/70">
                  We verify income, call your employer and previous landlord,
                  and confirm your identity. Your file is only shared with the
                  landlord of the property you&apos;re applying for, and only
                  after you pass reference checks. We do not sell your data.
                </p>
              </div>
            </div>
          </div>

          <label className="flex items-start gap-3 text-sm text-charcoal/80">
            <input
              type="checkbox"
              className="mt-1 h-4 w-4 rounded border-charcoal/30 text-gold-600 focus:ring-gold-500"
              {...register("consentBackgroundCheck", { required: true })}
            />
            <span>
              I consent to Goldstay verifying my identity, employment and
              income with the sources I&apos;ve listed.{req}
            </span>
          </label>
          <label className="flex items-start gap-3 text-sm text-charcoal/80">
            <input
              type="checkbox"
              className="mt-1 h-4 w-4 rounded border-charcoal/30 text-gold-600 focus:ring-gold-500"
              {...register("consentLandlordReference", { required: true })}
            />
            <span>
              I consent to Goldstay contacting my previous and current landlord
              for a rental reference.{req}
            </span>
          </label>
          <label className="flex items-start gap-3 text-sm text-charcoal/80">
            <input
              type="checkbox"
              className="mt-1 h-4 w-4 rounded border-charcoal/30 text-gold-600 focus:ring-gold-500"
              {...register("consentDataProcessing", { required: true })}
            />
            <span>
              I consent to Goldstay storing the information on this form for
              the purpose of processing my rental application under the Kenya
              Data Protection Act 2019 or Ghana Data Protection Act 2012, as
              applicable.{req}
            </span>
          </label>

          {(errors.consentBackgroundCheck ||
            errors.consentLandlordReference ||
            errors.consentDataProcessing) && (
            <p className="text-xs text-red-700">
              All three consents are required to submit the application.
            </p>
          )}
        </div>
      ) : null}

      {error ? (
        <div className="rounded-xl border border-red-300 bg-red-50 p-4 text-sm text-red-800">
          {error}
        </div>
      ) : null}

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-charcoal/10 pt-6">
        <button
          type="button"
          onClick={handleBack}
          disabled={step === 0}
          className="btn-secondary disabled:opacity-40"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        {step < stepTitles.length - 1 ? (
          <button type="button" onClick={handleNext} className="btn-primary">
            Continue
            <ArrowRight className="h-4 w-4" />
          </button>
        ) : (
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary disabled:opacity-60"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Submitting
              </>
            ) : (
              <>
                Submit application
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        )}
      </div>
    </form>
  );
}
