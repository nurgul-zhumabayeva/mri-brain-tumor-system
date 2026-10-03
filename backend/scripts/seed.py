import csv
from pathlib import Path

from sqlalchemy import select

from app.db import SessionLocal
from app.modules.scans.models import Scan

CSV_PATH = Path(__file__).resolve().parent.parent / "data" / "scans.csv"


def main() -> None:
    added = 0
    with SessionLocal() as session, CSV_PATH.open(encoding="utf-8") as f:
        existing = set(session.scalars(select(Scan.file_name)))
        for row in csv.DictReader(f):
            if row["file_name"] in existing:
                continue
            session.add(Scan(**row))
            added += 1
        session.commit()
    print(f"Added {added} scans")


if __name__ == "__main__":
    main()
