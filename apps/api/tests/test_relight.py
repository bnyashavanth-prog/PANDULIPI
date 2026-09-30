import numpy as np
from imaging.relight import compute_normals, create_fused_reveal

def test_compute_normals():
    # 4 images of size 10x10
    images = [np.random.randint(0, 255, (10, 10), dtype=np.uint8) for _ in range(4)]
    normal_rgb, albedo = compute_normals(images)
    
    assert normal_rgb.shape == (10, 10, 3)
    assert albedo.shape == (10, 10)
    assert np.all(albedo >= 0) and np.all(albedo <= 1)

def test_create_fused_reveal():
    images = [np.random.randint(0, 255, (10, 10), dtype=np.uint8) for _ in range(4)]
    reveal = create_fused_reveal(images)
    
    assert reveal.shape == (10, 10)
