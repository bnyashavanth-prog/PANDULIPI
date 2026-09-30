import math
from typing import List, Dict

def plan_scan(leaf_length_mm: float, fov_mm: float, overlap: float = 0.25) -> List[Dict]:
    """
    Plan the physical scan steps.
    Returns a list of positions and the lights to trigger at each position.
    """
    if leaf_length_mm <= fov_mm:
        n = 1
        step = 0
    else:
        n = math.ceil((leaf_length_mm - fov_mm) / (fov_mm * (1 - overlap))) + 1
        step = (leaf_length_mm - fov_mm) / (n - 1) if n > 1 else 0

    lights = ["N", "E", "S", "W", "RING", "IR850"]
    
    plan = []
    for i in range(n):
        pos_mm = i * step
        plan.append({
            "index": i,
            "position_mm": pos_mm,
            "lights": lights
        })
    return plan
