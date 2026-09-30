from typing import Optional, List
from sqlmodel import SQLModel, Field
from datetime import datetime

class Bundle(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    nfc_uid: Optional[str] = Field(default=None, index=True)
    title: str
    custodian_name: str
    material: str
    script_guess: str
    notes: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

class Leaf(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    bundle_id: int = Field(foreign_key="bundle.id")
    index: int
    length_mm: float
    width_mm: float

class Scan(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    leaf_id: int = Field(foreign_key="leaf.id")
    state: str
    started_at: datetime = Field(default_factory=datetime.utcnow)
    finished_at: Optional[datetime] = None
    hw_mode: str
    light_dose: float = 0.0
    stitch_error_px: Optional[float] = None

class Tile(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    scan_id: int = Field(foreign_key="scan.id")
    index: int
    position_mm: float
    light_channel: str
    file_path: str
    checksum: str

class Line(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    scan_id: int = Field(foreign_key="scan.id")
    index: int
    polygon: str
    image_ref: str

class Word(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    line_id: int = Field(foreign_key="line.id")
    index: int
    text: str
    conf: float
    bbox: str
    alts: str # JSON list
    status: str # machine | confirmed

class Correction(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    word_id: int = Field(foreign_key="word.id")
    predicted: str
    corrected: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

class EnvReading(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    ts: datetime = Field(default_factory=datetime.utcnow)
    humidity: float
    temp: float
    voc: float
    lux: float

class Alert(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    ts: datetime = Field(default_factory=datetime.utcnow)
    type: str
    message: str
    acknowledged: bool = False

class Consent(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    bundle_id: int = Field(foreign_key="bundle.id")
    level: str # private | research | public
    signed_by: str
    signed_at: datetime = Field(default_factory=datetime.utcnow)
    revoked_at: Optional[datetime] = None

class RescueScore(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    scan_id: int = Field(foreign_key="scan.id")
    score: float
    tier: str
    factors_json: str

class Setting(SQLModel, table=True):
    key: str = Field(primary_key=True)
    value: str
