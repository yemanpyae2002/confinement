"use client";

import { useId, useState } from "react";
import { REGIONS } from "@/lib/listings";

const WEB3FORMS_KEY: string = "3c46be5a-3469-4cd8-bdc1-2fe584a69771";

export default function LeadForm({
  subject,
  hidden = {},
  heading,
  hint,
  button = "Send my enquiry",
  compact = false,
}: {
  subject: string;
  hidden?: Record<string, string>;
  heading?: string;
  hint?: string;
  button?: string;
  compact?: boolean;
}) {
  const id = useId();
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "err">("idle");
  const [errMsg, setErrMsg] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (WEB3FORMS_KEY === "YOUR_WEB3FORMS_KEY") {
      setStatus("err");
      setErrMsg("This form isn’t connected yet. Add your Web3Forms access key to enable enquiries.");
      return;
    }
    setStatus("sending");
    const form = e.currentTarget;
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { Accept: "application/json" },
        body: new FormData(form),
      });
      const d = await res.json();
      if (d.success) {
        form.reset();
        setStatus("ok");
      } else {
        throw new Error(d.message || "failed");
      }
    } catch {
      setStatus("err");
      setErrMsg("Sorry, something went wrong. Please email us at hello@confinementfindersg.com.");
    }
  }

  if (status === "ok") {
    return (
      <div className="lead">
        {heading && <h3>{heading}</h3>}
        <div className="formstatus ok">
          Thank you — your enquiry is on its way. Expect a reply within 1–2 working days.
        </div>
      </div>
    );
  }

  return (
    <form className="lead" onSubmit={onSubmit}>
      <input type="hidden" name="access_key" value={WEB3FORMS_KEY} />
      <input type="hidden" name="subject" value={subject} />
      <input type="hidden" name="from_name" value="ConfinementFinderSG" />
      <input type="checkbox" name="botcheck" className="sr-only" style={{ display: "none" }} tabIndex={-1} autoComplete="off" />
      {Object.entries(hidden).map(([k, v]) => (
        <input type="hidden" name={k} value={v} key={k} />
      ))}
      {heading && <h3>{heading}</h3>}
      {hint && <p className="hint">{hint}</p>}

      <div className="form-fields">
        <div className="field">
          <label htmlFor={`${id}-name`}>Your name</label>
          <input id={`${id}-name`} type="text" name="name" required autoComplete="name" />
        </div>
        <div className="field">
          <label htmlFor={`${id}-email`}>Email</label>
          <input id={`${id}-email`} type="email" name="email" required autoComplete="email" />
        </div>
        <div className="field">
          <label htmlFor={`${id}-phone`}>
            Phone <span className="opt">(optional)</span>
          </label>
          <input id={`${id}-phone`} type="tel" name="phone" autoComplete="tel" />
        </div>
        <div className="field">
          <label htmlFor={`${id}-due`}>Due month</label>
          <input id={`${id}-due`} type="month" name="due_month" />
        </div>
        {!compact && (
          <>
            <div className="field">
              <label htmlFor={`${id}-region`}>Preferred region</label>
              <select id={`${id}-region`} name="region" defaultValue="">
                <option value="">Any region</option>
                {REGIONS.map((r) => (
                  <option key={r}>{r}</option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor={`${id}-budget`}>
                Budget range <span className="opt">(optional)</span>
              </label>
              <select id={`${id}-budget`} name="budget" defaultValue="">
                <option value="">Not sure yet</option>
                <option>Under S$10,000</option>
                <option>S$10,000 – S$15,000</option>
                <option>S$15,000 – S$20,000</option>
                <option>Above S$20,000</option>
              </select>
            </div>
          </>
        )}
        <div className="field">
          <label htmlFor={`${id}-msg`}>
            Anything else? <span className="opt">(optional)</span>
          </label>
          <textarea id={`${id}-msg`} name="message" rows={3} />
        </div>
      </div>

      <button className="btn btn-block" type="submit" disabled={status === "sending"}>
        {status === "sending" ? "Sending…" : button}
      </button>
      {status === "err" && <div className="formstatus err">{errMsg}</div>}
      <p className="privacy-note">
        We share your enquiry only with the provider(s) you ask about so they can reply. No spam, no selling your
        data. See our <a href="/privacy/">privacy policy</a>.
      </p>
    </form>
  );
}
