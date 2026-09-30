from pydantic import BaseModel
from typing import Optional, List, Any

class WsEvent(BaseModel):
    type: str
    payload: Any

class EnvUpdate(BaseModel):
    humidity: float
    temp: float
    voc: float
    lux: float
    status: str
    message: str

class ScanState(BaseModel):
    state: str
    scan_id: Optional[int]

class ScanTile(BaseModel):
    i: int
    n: int
    light: str
    progress: float

class ScanThumb(BaseModel):
    i: int
    url: str

class CarriagePosition(BaseModel):
    mm: float

class LightState(BaseModel):
    channel: str
    duty: float

class ProcessProgress(BaseModel):
    stage: str
    pct: float

class ReaderWord(BaseModel):
    text: str
    conf: float
    bbox: str
    alts: List[str]

class ReaderLine(BaseModel):
    i: int
    words: List[ReaderWord]

class NfcTag(BaseModel):
    uid: str

class AlertNew(BaseModel):
    message: str

class SafetyTrip(BaseModel):
    reason: str
