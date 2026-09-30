import json
from typing import Dict, Any

def compute_rescue_score(features: Dict[str, float]) -> Dict[str, Any]:
    """
    Computes the Rescue Score (0-100), HIGHER = MORE URGENT.
    features expects:
      - structural (0-1): cracks, holes, edge loss
      - biological (0-1): fungus, insect damage
      - fading (0-1): text contrast degradation
      - env_history (0-1): cumulative bad environment exposure
      - importance (0-1): historical significance
    """
    weights = {
        "structural": 0.30,
        "biological": 0.25,
        "fading": 0.20,
        "env_history": 0.15,
        "importance": 0.10
    }
    
    score = 0.0
    for k, w in weights.items():
        score += features.get(k, 0.0) * w * 100
        
    score = min(100.0, max(0.0, score))
    
    if score < 25:
        tier = "Stable"
    elif score < 50:
        tier = "Watch"
    elif score < 75:
        tier = "Priority"
    else:
        tier = "Urgent"
        
    reasons = []
    if features.get("structural", 0) > 0.6:
        reasons.append("Severe structural damage (cracks or edge loss).")
    if features.get("biological", 0) > 0.6:
        reasons.append("Active or extensive biological damage detected.")
    if features.get("env_history", 0) > 0.6:
        reasons.append("Prolonged exposure to poor storage conditions.")
        
    return {
        "score": score,
        "tier": tier,
        "sub_scores": {k: features.get(k, 0) * 100 for k in weights},
        "reasons": reasons,
        "calibration_note": "Scores are AI-generated and should be calibrated by a human conservator."
    }
