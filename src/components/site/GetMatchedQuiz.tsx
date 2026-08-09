"use client";

import { useState } from "react";
import { REGIONS } from "@/lib/listings";
import LeadForm from "@/components/site/LeadForm";

const HELP_OPTIONS = [
  "Stay at a confinement centre",
  "Confinement nanny at home",
  "Postnatal massage & recovery",
  "Confinement meal delivery",
  "Still deciding",
];

function dueOptions(): string[] {
  const out: string[] = [];
  const d = new Date();
  for (let i = 0; i < 6; i++) {
    const dt = new Date(d.getFullYear(), d.getMonth() + i, 1);
    out.push(dt.toLocaleString("en-SG", { month: "short", year: "numeric" }));
  }
  return out;
}

export default function GetMatchedQuiz() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<{ due: string; region_pref: string; help: string }>({
    due: "",
    region_pref: "",
    help: "",
  });

  function choose(key: keyof typeof answers, val: string, next: number) {
    setAnswers((a) => ({ ...a, [key]: val }));
    setStep(next);
  }

  return (
    <div className="quiz">
      <div className="q-prog" aria-hidden="true">
        {[0, 1, 2, 3].map((i) => (
          <i key={i} className={i <= step ? "done" : ""} />
        ))}
      </div>

      <div className={`q-step${step === 0 ? " on" : ""}`}>
        <p className="q-q">When are you due?</p>
        <div className="q-opts">
          {dueOptions().map((d) => (
            <button key={d} type="button" onClick={() => choose("due", d, 1)}>
              {d}
            </button>
          ))}
          <button type="button" onClick={() => choose("due", "Already delivered", 1)}>
            Already delivered
          </button>
        </div>
      </div>

      <div className={`q-step${step === 1 ? " on" : ""}`}>
        <p className="q-q">Which part of Singapore suits you?</p>
        <div className="q-opts">
          {REGIONS.map((r) => (
            <button key={r} type="button" onClick={() => choose("region_pref", r, 2)}>
              {r}
            </button>
          ))}
          <button type="button" onClick={() => choose("region_pref", "No preference", 2)}>
            No preference
          </button>
        </div>
        <p className="q-back">
          <button className="linkbtn" type="button" onClick={() => setStep(0)}>
            ← Back
          </button>
        </p>
      </div>

      <div className={`q-step${step === 2 ? " on" : ""}`}>
        <p className="q-q">What kind of help are you looking for?</p>
        <div className="q-opts">
          {HELP_OPTIONS.map((h) => (
            <button key={h} type="button" onClick={() => choose("help", h, 3)}>
              {h}
            </button>
          ))}
        </div>
        <p className="q-back">
          <button className="linkbtn" type="button" onClick={() => setStep(1)}>
            ← Back
          </button>
        </p>
      </div>

      <div className={`q-step${step === 3 ? " on" : ""}`}>
        <div className="q-recap">
          <strong>Your answers:</strong> due {answers.due || "—"} · {answers.region_pref || "—"} ·{" "}
          {answers.help || "—"}
        </div>
        <LeadForm
          subject="Get Matched request — ConfinementFinderSG"
          hidden={{ lead_type: "get-matched", due: answers.due, region_pref: answers.region_pref, help: answers.help }}
          heading="Where should we send your shortlist?"
          hint="We usually reply within one working day with 3–5 suitable options."
          button="Send my shortlist request"
          compact
        />
        <p className="q-back">
          <button className="linkbtn" type="button" onClick={() => setStep(2)}>
            ← Back
          </button>
        </p>
      </div>
    </div>
  );
}
