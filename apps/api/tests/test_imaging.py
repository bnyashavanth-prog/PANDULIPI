import pytest
import numpy as np
from imaging.planner import plan_scan
from imaging.stitch import stitch_tiles

def test_planner():
    # Length 100, fov 40, overlap 0.25 -> effective advance = 30
    # ceil((100 - 40) / 30) + 1 = ceil(60/30) + 1 = 3 tiles
    plan = plan_scan(100.0, 40.0, 0.25)
    assert len(plan) == 3
    assert plan[0]["position_mm"] == 0.0
    assert plan[1]["position_mm"] == 30.0
    assert plan[2]["position_mm"] == 60.0

def test_stitch():
    # Make dummy images that overlap
    img1 = np.zeros((100, 100, 3), dtype=np.uint8)
    img1[:, 75:100] = 255 # overlap region white
    
    img2 = np.zeros((100, 100, 3), dtype=np.uint8)
    img2[:, 0:25] = 255 # overlap region white
    
    stitched, error = stitch_tiles([img1, img2], [75.0])
    
    assert error < 5.0
    assert abs(stitched.shape[1] - 175) <= 2
    # The middle region should be blended white
    assert stitched[50, 75, 0] > 200
