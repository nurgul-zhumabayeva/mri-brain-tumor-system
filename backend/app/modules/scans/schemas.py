from datetime import datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field

TumorType = Literal["glioma", "meningioma", "pituitary", "no_tumor"]
Plane = Literal["axial", "sagittal", "coronal"]


class ScanBase(BaseModel):
    title: str = Field(min_length=3, max_length=500)
    dataset: str = Field(min_length=2, max_length=255)
    tumor_type: TumorType
    plane: Plane | None = None
    description: str | None = None
    file_name: str | None = Field(default=None, max_length=255)


class ScanCreate(ScanBase):
    pass


class ScanUpdate(BaseModel):
    title: str | None = Field(default=None, min_length=3, max_length=500)
    dataset: str | None = Field(default=None, min_length=2, max_length=255)
    tumor_type: TumorType | None = None
    plane: Plane | None = None
    description: str | None = None
    file_name: str | None = Field(default=None, max_length=255)


class ScanOut(ScanBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: datetime
