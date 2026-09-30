import os
import yaml
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import SQLModel, create_engine
import asyncio

from events import WsEvent
from hw.safety import SafetyGuard
from hw.camera import MockCamera
from hw.lights import MockLights
from hw.stepper import MockStepper
from hw.sensors import MockSensors
from hw.nfc import MockNfc

app = FastAPI(title="Pandulipi API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

engine = create_engine("sqlite:///pandulipi.db")

active_websockets = []

def get_config():
    with open("config.yaml", "r") as f:
        return yaml.safe_load(f)

config = get_config()

# Hardware Setup (Mock)
camera = MockCamera()
lights = MockLights()
stepper = MockStepper()
sensors = MockSensors()
nfc = MockNfc()

guard = SafetyGuard(config, lights, stepper)

@app.on_event("startup")
async def on_startup():
    SQLModel.metadata.create_all(engine)
    asyncio.create_task(guard.monitor_loop())
    asyncio.create_task(env_monitor())

async def env_monitor():
    while True:
        data = sensors.read()
        safe, msg = guard.check_env(data)
        data["status"] = "Safe" if safe else "Blocked"
        data["message"] = msg
        await broadcast(WsEvent(type="env.update", payload=data).dict())
        await asyncio.sleep(2)

async def broadcast(message: dict):
    for ws in active_websockets:
        try:
            await ws.send_json(message)
        except Exception:
            pass

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    active_websockets.append(websocket)
    try:
        while True:
            data = await websocket.receive_text()
    except WebSocketDisconnect:
        active_websockets.remove(websocket)

@app.post("/scan/start")
async def start_scan():
    # Simulate a full scan for D5 and D6
    asyncio.create_task(simulate_scan())
    return {"status": "started"}

async def simulate_scan():
    # 1. Capturing
    await broadcast(WsEvent(type="scan.state", payload={"state": "capturing"}).dict())
    await broadcast(WsEvent(type="process.progress", payload={"stage": "Capture", "pct": 0}).dict())
    
    lights = ["N", "E", "S", "W", "RING", "IR"]
    n_tiles = 4
    for i in range(n_tiles):
        # Move carriage
        await broadcast(WsEvent(type="carriage.position", payload={"mm": i * 50}).dict())
        for j, light in enumerate(lights):
            await broadcast(WsEvent(type="light.state", payload={"channel": light, "duty": 1.0}).dict())
            await asyncio.sleep(0.1)
            await broadcast(WsEvent(type="light.state", payload={"channel": light, "duty": 0.0}).dict())
            
        progress = (i + 1) / n_tiles
        await broadcast(WsEvent(type="scan.tile", payload={"i": i, "n": n_tiles, "light": "IR", "progress": progress}).dict())
        await broadcast(WsEvent(type="scan.thumb", payload={"i": i, "url": f"/mock-thumb-{i}.jpg"}).dict())
        await broadcast(WsEvent(type="process.progress", payload={"stage": "Capture", "pct": progress * 100}).dict())
        await asyncio.sleep(0.5)
        
    # 2. Stitching
    await broadcast(WsEvent(type="scan.state", payload={"state": "stitching"}).dict())
    for p in range(0, 101, 20):
        await broadcast(WsEvent(type="process.progress", payload={"stage": "Stitch", "pct": p}).dict())
        await asyncio.sleep(0.2)
        
    # 3. Enhancing
    await broadcast(WsEvent(type="scan.state", payload={"state": "enhancing"}).dict())
    for p in range(0, 101, 25):
        await broadcast(WsEvent(type="process.progress", payload={"stage": "Enhance", "pct": p}).dict())
        await asyncio.sleep(0.2)
        
    # 4. Reading
    await broadcast(WsEvent(type="scan.state", payload={"state": "reading"}).dict())
    for p in range(0, 101, 33):
        await broadcast(WsEvent(type="process.progress", payload={"stage": "Read", "pct": p}).dict())
        await asyncio.sleep(0.2)
        
    # Done
    await broadcast(WsEvent(type="scan.state", payload={"state": "review"}).dict())

@app.get("/scans/{id}/lines")
def get_lines(id: int):
    # Mock line geometries
    return [
        {"id": 1, "index": 0, "polygon": "[[10, 10], [900, 10], [900, 50], [10, 50]]", "image_ref": "line1.jpg"},
        {"id": 2, "index": 1, "polygon": "[[10, 60], [900, 60], [900, 100], [10, 100]]", "image_ref": "line2.jpg"}
    ]

@app.get("/scans/{id}/text")
def get_text(id: int):
    # Use MockRecognizer
    from language.reader import MockRecognizer
    recognizer = MockRecognizer()
    
    lines = []
    for line_id in [1, 2]:
        words = recognizer.recognize(None) # dummy image
        lines.append({
            "line_id": line_id,
            "index": line_id - 1,
            "words": [w.__dict__ for w in words]
        })
    return {"lines": lines}

@app.get("/env/history")
def get_env_history():
    import random
    import time
    now = int(time.time())
    data = []
    for i in range(24):
        data.append({
            "ts": now - (23 - i) * 3600,
            "humidity": 50 + random.uniform(-5, 5),
            "temp": 22 + random.uniform(-2, 2),
            "voc": random.uniform(80, 150)
        })
    return {"history": data}

@app.get("/alerts")
def get_alerts():
    return {"alerts": [
        {"ts": "2026-09-29T10:00:00Z", "type": "env", "message": "Humidity dropped below 45% for 2 hours.", "acknowledged": False},
        {"ts": "2026-09-30T08:00:00Z", "type": "safety", "message": "UV lock bypassed by PIN.", "acknowledged": True}
    ]}

@app.get("/bundles")
def get_bundles():
    return {"bundles": [
        {"id": 1, "title": "Rigveda Samhita excerpt", "material": "Palm Leaf", "scans": 2, "nfc_uid": "04:6B:A1:22"},
        {"id": 2, "title": "Bhagavad Gita folio", "material": "Paper", "scans": 1, "nfc_uid": "04:7C:B2:33"},
        {"id": 3, "title": "Unknown Ayurvedic text", "material": "Palm Leaf", "scans": 0, "nfc_uid": "04:8D:C3:44"}
    ]}

@app.get("/scans/{id}/rescue")
def get_rescue_score(id: int):
    from rescue import compute_rescue_score
    features = {
        "structural": 0.8,
        "biological": 0.2,
        "fading": 0.5,
        "env_history": 0.6,
        "importance": 0.9
    }
    return compute_rescue_score(features)

@app.post("/backup")
def trigger_backup():
    return {"status": "Backup initiated via AES-GCM to encrypted vault."}

