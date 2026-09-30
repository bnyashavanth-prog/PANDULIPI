import cv2
import numpy as np
from typing import List, Tuple, Optional

def stitch_tiles(images: List[np.ndarray], expected_offsets_px: List[float]) -> Tuple[Optional[np.ndarray], float]:
    """
    Stitch a linear sequence of images along the horizontal axis.
    expected_offsets_px is the physical step distance converted to pixels for each tile relative to the previous.
    Returns (stitched_image, max_seam_error_px).
    """
    if not images:
        return None, 0.0
    if len(images) == 1:
        return images[0], 0.0

    stitched = images[0].copy()
    max_error = 0.0

    for i in range(1, len(images)):
        img1 = stitched
        img2 = images[i]
        
        # We expect img2 to be offset by expected_offset to the right.
        offset_x = int(expected_offsets_px[i-1])
        
        # Determine overlap region
        # img1 right side, img2 left side
        overlap_width = img1.shape[1] - offset_x
        if overlap_width <= 0:
            # No overlap, just concatenate with a gap (shouldn't happen with proper planning)
            stitched = np.hstack((img1, img2))
            continue
            
        region1 = img1[:, offset_x:]
        region2 = img2[:, :overlap_width]
        
        # Convert to grayscale for phase correlation
        g1 = cv2.cvtColor(region1, cv2.COLOR_BGR2GRAY) if len(region1.shape) == 3 else region1
        g2 = cv2.cvtColor(region2, cv2.COLOR_BGR2GRAY) if len(region2.shape) == 3 else region2
        
        g1 = g1.astype(np.float32)
        g2 = g2.astype(np.float32)

        # Phase correlation to refine offset
        # Apply Hanning window
        hann = cv2.createHanningWindow((overlap_width, img1.shape[0]), cv2.CV_32F)
        shift, response = cv2.phaseCorrelate(g1 * hann, g2 * hann)
        
        dx, dy = shift
        max_error = max(max_error, np.sqrt(dx**2 + dy**2))
        
        if max_error > 50: # arbitrary threshold for "fail gracefully"
            # Return current stitch and high error to suggest re-scan
            return None, max_error
            
        # Linear blend
        shift_x = int(round(dx))
        actual_offset = offset_x - shift_x
        
        # Create canvas for new stitched image
        new_width = max(img1.shape[1], actual_offset + img2.shape[1])
        new_height = img1.shape[0] # assuming no vertical shift for simplicity
        
        new_stitched = np.zeros((new_height, new_width, 3), dtype=np.uint8)
        
        # Paste img1
        new_stitched[:, :actual_offset] = img1[:, :actual_offset]
        
        # Blend overlap
        overlap_start = actual_offset
        overlap_end = min(img1.shape[1], actual_offset + img2.shape[1])
        actual_overlap = overlap_end - overlap_start
        
        if actual_overlap > 0:
            alpha = np.linspace(1, 0, actual_overlap).reshape(1, -1, 1)
            blend1 = img1[:, overlap_start:overlap_end] * alpha
            blend2 = img2[:, :actual_overlap] * (1 - alpha)
            new_stitched[:, overlap_start:overlap_end] = (blend1 + blend2).astype(np.uint8)
            
        # Paste remaining img2
        if actual_offset + img2.shape[1] > img1.shape[1]:
            new_stitched[:, img1.shape[1]:] = img2[:, actual_overlap:]
            
        stitched = new_stitched

    return stitched, float(max_error)
