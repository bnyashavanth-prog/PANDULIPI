import numpy as np
import cv2

def compute_normals(images_nesw: list[np.ndarray]) -> tuple[np.ndarray, np.ndarray]:
    """
    Computes normal map and albedo from 4 raking light images (N, E, S, W).
    Assumes images are grayscale (or single channel) and aligned.
    Returns (normal_map (H, W, 3) in [-1, 1], albedo (H, W) in [0, 1]).
    """
    # Light vectors at 15 degrees elevation
    elev = np.radians(15)
    c = np.cos(elev)
    s = np.sin(elev)
    
    L = np.array([
        [0,  c, s], # N
        [c,  0, s], # E
        [0, -c, s], # S
        [-c, 0, s], # W
    ], dtype=np.float32)
    
    # L_inv = (L^T L)^-1 L^T
    L_inv = np.linalg.pinv(L)
    
    # Stack images into (H, W, 4)
    I = np.stack([img.astype(np.float32) / 255.0 for img in images_nesw], axis=-1)
    H, W, _ = I.shape
    
    I_flat = I.reshape(-1, 4).T # (4, H*W)
    
    N_flat = L_inv @ I_flat # (3, H*W)
    
    # Albedo is magnitude of N
    albedo_flat = np.linalg.norm(N_flat, axis=0)
    
    # Normalize normals
    # Add epsilon to prevent division by zero
    normals_flat = N_flat / (albedo_flat + 1e-8)
    
    normal_map = normals_flat.T.reshape(H, W, 3)
    albedo = albedo_flat.reshape(H, W)
    albedo = np.clip(albedo, 0, 1)
    
    # normal_map is currently (x, y, z)
    # Convert to RGB representation [0, 255] for saving
    normal_rgb = ((normal_map + 1.0) / 2.0 * 255).astype(np.uint8)
    
    return normal_rgb, albedo

def create_fused_reveal(images_nesw: list[np.ndarray]) -> np.ndarray:
    """
    Creates a 2D 'reveal' image by combining Max - Min of the 4 lights + CLAHE.
    Useful for the 2D fallback.
    """
    stacked = np.stack(images_nesw, axis=-1)
    max_img = np.max(stacked, axis=-1).astype(np.float32)
    min_img = np.min(stacked, axis=-1).astype(np.float32)
    
    diff = max_img - min_img
    diff_norm = cv2.normalize(diff, None, 0, 255, cv2.NORM_MINMAX).astype(np.uint8)
    
    clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8,8))
    enhanced = clahe.apply(diff_norm)
    return enhanced
