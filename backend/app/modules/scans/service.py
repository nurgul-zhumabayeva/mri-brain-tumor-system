from sqlalchemy import or_, select
from sqlalchemy.orm import Session

from .models import Scan
from .schemas import ScanCreate, ScanUpdate


def list_scans(
    session: Session,
    q: str | None = None,
    tumor_type: str | None = None,
    limit: int = 20,
    offset: int = 0,
) -> list[Scan]:
    stmt = select(Scan).order_by(Scan.created_at.desc(), Scan.id.desc())
    if q:
        pattern = f"%{q}%"
        stmt = stmt.where(or_(Scan.title.ilike(pattern), Scan.dataset.ilike(pattern)))
    if tumor_type:
        stmt = stmt.where(Scan.tumor_type == tumor_type)
    return list(session.scalars(stmt.limit(limit).offset(offset)))


def get_scan(session: Session, scan_id: int) -> Scan | None:
    return session.get(Scan, scan_id)


def create_scan(session: Session, data: ScanCreate) -> Scan:
    scan = Scan(**data.model_dump())
    session.add(scan)
    session.commit()
    session.refresh(scan)
    return scan


def update_scan(session: Session, scan: Scan, data: ScanUpdate) -> Scan:
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(scan, field, value)
    session.commit()
    session.refresh(scan)
    return scan


def delete_scan(session: Session, scan: Scan) -> None:
    session.delete(scan)
    session.commit()
