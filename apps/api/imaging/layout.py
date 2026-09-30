import cv2
import numpy as np

def find_lines(image: np.ndarray) -> list[dict]:
    """
    Text line segmentation by smoothed horizontal projection profile.
    Returns a list of dicts with 'index' and 'polygon' (list of [x, y]).
    """
    # Assuming input is grayscale
    gray = image if len(image.shape) == 2 else cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    
    # Binarize
    _, thresh = cv2.threshold(gray, 128, 255, cv2.THRESH_BINARY_INV | cv2.THRESH_OTSU)
    
    # Horizontal projection
    proj = np.sum(thresh, axis=1)
    
    # Smooth projection
    smoothed = np.convolve(proj, np.ones(15)/15, mode='same')
    
    # Find peaks and valleys
    # Simplified peak finding: threshold the smoothed profile
    threshold_val = np.max(smoothed) * 0.2
    active = False
    lines = []
    start_y = 0
    
    for y, val in enumerate(smoothed):
        if val > threshold_val and not active:
            active = True
            start_y = y
        elif val <= threshold_val and active:
            active = False
            end_y = y
            
            # Create a simple rectangular polygon for the line
            h, w = gray.shape
            poly = [[0, start_y], [w, start_y], [w, end_y], [0, end_y]]
            lines.append({
                "index": len(lines),
                "polygon": poly
            })
            
    return lines
