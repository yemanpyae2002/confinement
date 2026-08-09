#!/usr/bin/env python3
"""Apply data/overrides.csv to data/listings.csv -> data/listings_final.csv

Kept separate from the vendored clean_listings.py so the upstream cleaner stays
deterministic and re-runnable. Overrides encode human review decisions
(mis-tagged Google types, duplicates, category corrections).
"""
import pandas as pd
from pathlib import Path

D = Path(__file__).parent / "data"

def main():
    df = pd.read_csv(D / "listings.csv")
    ov = pd.read_csv(D / "overrides.csv").fillna("")

    dropped, recat = [], []
    for _, o in ov.iterrows():
        m = df["slug"] == o["slug"]
        if not m.any():
            print(f"  ! override slug not found: {o['slug']}")
            continue
        if o["action"] == "drop":
            dropped.append(df.loc[m, "name"].iloc[0])
            df = df[~m]
        elif o["action"] == "recategorise":
            recat.append((df.loc[m, "name"].iloc[0], o["service_category"]))
            df.loc[m, "service_category"] = o["service_category"]

    # De-duplicate by place_id and by normalised name
    before = len(df)
    df = df.drop_duplicates(subset=["place_id"])
    df["_n"] = df["name"].str.lower().str.replace(r"[^a-z0-9]", "", regex=True)
    df = df.sort_values("reviews", ascending=False).drop_duplicates(subset=["_n"]).drop(columns=["_n"])
    if len(df) < before:
        print(f"  de-duplicated {before - len(df)} row(s)")

    df = df.sort_values(["reviews"], ascending=False).reset_index(drop=True)
    df.to_csv(D / "listings_final.csv", index=False)

    print(f"Dropped {len(dropped)}: " + "; ".join(dropped))
    print(f"Recategorised {len(recat)}: " + "; ".join(f"{n} -> {c}" for n, c in recat))
    print(f"\nFinal: {len(df)} listings")
    print("\nBy region:\n" + df["region"].value_counts().to_string())
    print("\nBy service:\n" + df["service_category"].fillna("Confinement Centre").replace("", "Confinement Centre").value_counts().to_string())

if __name__ == "__main__":
    main()
