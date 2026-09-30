import numpy as np
from PIL import Image, ImageDraw, ImageFont
import os
import math
import cv2

def make_sample_leaf(out_dir="assets/sample"):
    os.makedirs(out_dir, exist_ok=True)
    width, height = 2000, 400
    
    # 1. Base Albedo (parchment-green texture)
    noise = np.random.normal(0, 10, (height, width)).astype(np.float32)
    base_color = np.array([170, 190, 140], dtype=np.float32) # BGR for cv2
    albedo = np.ones((height, width, 3), dtype=np.float32) * base_color
    albedo[:, :, 0] += noise
    albedo[:, :, 1] += noise
    albedo[:, :, 2] += noise
    albedo = np.clip(albedo, 0, 255).astype(np.uint8)

    # 2. Add string holes and cracks to Albedo & mask
    mask = np.ones((height, width), dtype=np.float32)
    # holes
    cv2.circle(albedo, (width//4, height//2), 30, (0, 0, 0), -1)
    cv2.circle(mask, (width//4, height//2), 30, 0, -1)
    cv2.circle(albedo, (3*width//4, height//2), 30, (0, 0, 0), -1)
    cv2.circle(mask, (3*width//4, height//2), 30, 0, -1)
    
    # 3. Height Map for text
    height_map = np.zeros((height, width), dtype=np.float32)
    # We will use Pillow to draw text onto the height map
    pil_img = Image.fromarray((height_map * 255).astype(np.uint8))
    draw = ImageDraw.Draw(pil_img)
    
    # In a real setup, we'd use a real font file. Here we just draw lines as placeholders for text.
    # To meet the spec, we should draw some squiggles representing Devanagari and Kannada
    for y_offset in [100, 200, 300]:
        for x_offset in range(100, width - 100, 20):
            if np.random.rand() > 0.2:
                draw.line([(x_offset, y_offset), (x_offset + 15, y_offset + np.random.randint(-10, 10))], fill=255, width=2)
                draw.line([(x_offset, y_offset - 10), (x_offset, y_offset + 10)], fill=255, width=1)
                
    height_map_img = np.array(pil_img).astype(np.float32) / 255.0
    # incised text means negative height
    height_map -= height_map_img * 5.0 

    # Compute Normals from Height Map
    dzdx = cv2.Sobel(height_map, cv2.CV_32F, 1, 0, ksize=3)
    dzdy = cv2.Sobel(height_map, cv2.CV_32F, 0, 1, ksize=3)
    normal = np.dstack((-dzdx, -dzdy, np.ones_like(height_map)))
    norm = np.linalg.norm(normal, axis=2, keepdims=True)
    normal = normal / (norm + 1e-8)

    def render_light(light_vec, ambient=0.1):
        light_vec = np.array(light_vec, dtype=np.float32)
        light_vec /= np.linalg.norm(light_vec)
        
        # Lambertian
        dot = np.sum(normal * light_vec, axis=2)
        intensity = np.clip(dot, 0, 1) + ambient
        intensity = np.clip(intensity, 0, 1)
        
        shaded = albedo.astype(np.float32) * intensity[:, :, np.newaxis]
        return np.clip(shaded, 0, 255).astype(np.uint8)

    # 4. Raking lights (N, E, S, W) - elevation ~15 deg
    elev = np.sin(np.radians(15))
    azim = np.cos(np.radians(15))
    
    lights = {
        "N": [0, azim, elev],
        "E": [azim, 0, elev],
        "S": [0, -azim, elev],
        "W": [-azim, 0, elev],
        "RING": [0, 0, 1], # straight down
        "IR": [0, 0, 1]
    }
    
    images = {}
    for name, vec in lights.items():
        img = render_light(vec, ambient=0.2 if name != "RING" else 0.5)
        if name == "IR":
            img = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
            img = cv2.cvtColor(img, cv2.COLOR_GRAY2BGR) # keep 3 channels
        images[name] = img
        cv2.imwrite(os.path.join(out_dir, f"leaf_{name}.jpg"), img)
        
    # 5. Flat phone photo
    phone = render_light([0.1, -0.1, 1.0], ambient=0.4)
    phone = cv2.GaussianBlur(phone, (5, 5), 0)
    cv2.imwrite(os.path.join(out_dir, f"leaf_phone.jpg"), phone)

    print(f"Generated sample leaf assets in {out_dir}")

if __name__ == "__main__":
    make_sample_leaf()
