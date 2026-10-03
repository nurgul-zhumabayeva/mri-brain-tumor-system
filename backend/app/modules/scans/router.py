from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.db import get_session

from . import service
from .models import Scan
from .schemas import ScanCreate, ScanOut, ScanUpdate, TumorType

router = APIRouter(prefix="/scans", tags=["scans"])


def get_or_404(scan_id: int, session: Session = Depends(get_session)) -> Scan:
    scan = service.get_scan(session, scan_id)
    if scan is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Scan not found")
    return scan


@router.get("", response_model=list[ScanOut])
def list_scans(
    q: str | None = Query(default=None, max_length=200),
    tumor_type: TumorType | None = None,
    limit: int = Query(default=20, ge=1, le=100),
    offset: int = Query(default=0, ge=0),
    session: Session = Depends(get_session),
):
    return service.list_scans(session, q, tumor_type, limit, offset)


@router.get("/{scan_id}", response_model=ScanOut)
def read_scan(scan: Scan = Depends(get_or_404)):
    return scan


@router.post("", response_model=ScanOut, status_code=status.HTTP_201_CREATED)
def create_scan(data: ScanCreate, session: Session = Depends(get_session)):
    try:
        return service.create_scan(session, data)
    except IntegrityError:
        session.rollback()
        raise HTTPException(status.HTTP_409_CONFLICT, "Scan with this file name exists")


@router.patch("/{scan_id}", response_model=ScanOut)
def update_scan(
    data: ScanUpdate,
    scan: Scan = Depends(get_or_404),
    session: Session = Depends(get_session),
):
    try:
        return service.update_scan(session, scan, data)
    except IntegrityError:
        session.rollback()
        raise HTTPException(status.HTTP_409_CONFLICT, "Scan with this file name exists")


@router.delete("/{scan_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_scan(scan: Scan = Depends(get_or_404), session: Session = Depends(get_session)) -> None:
    service.delete_scan(session, scan)
