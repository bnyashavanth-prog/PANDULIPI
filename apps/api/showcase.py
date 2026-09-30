import os
import json

def generate_showcase_html(bundle_id: int, scan_id: int, data: dict) -> str:
    """
    Generates a single self-contained HTML file for public showcasing.
    Includes inline CSS, JS, and base64 embedded images if needed.
    """
    
    html = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pandulipi Showcase: {data.get('title', 'Manuscript')}</title>
    <style>
        :root {{
            --ink-950: #0A0E22;
            --text-main: #F5F1E6;
            --lamp-glow: #FFD98A;
            --saffron-500: #E8891B;
        }}
        body {{
            margin: 0;
            background-color: var(--ink-950);
            color: var(--text-main);
            font-family: sans-serif;
            overflow-x: hidden;
        }}
        .hero {{
            height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
            padding: 2rem;
            position: relative;
        }}
        .title {{ font-size: 3rem; color: var(--lamp-glow); font-family: serif; }}
        .card {{
            background: rgba(255,255,255,0.05);
            padding: 2rem;
            border-radius: 24px;
            max-width: 600px;
            margin: 4rem auto;
        }}
        /* Animation for scroll-driven storytelling */
        .fade-in {{ opacity: 0; transform: translateY(20px); transition: opacity 1s, transform 1s; }}
        .fade-in.visible {{ opacity: 1; transform: translateY(0); }}
    </style>
</head>
<body>
    <div class="hero">
        <h1 class="title">{data.get('title', 'Manuscript')}</h1>
        <p>Preserved by Pandulipi</p>
        <div style="margin-top: 2rem; max-width: 800px; width: 100%;">
           <img src="data:image/jpeg;base64,{data.get('image_b64', '')}" alt="Manuscript image" style="width: 100%; border-radius: 12px;"/>
        </div>
    </div>
    
    <div class="card fade-in">
        <h2>Custodian's Note</h2>
        <p>This manuscript is under the care of {data.get('custodian', 'a local custodian')}.</p>
        <p>Condition Tier: <strong style="color:var(--saffron-500)">{data.get('rescue_tier', 'Stable')}</strong></p>
    </div>

    <script>
        const observer = new IntersectionObserver((entries) => {{
            entries.forEach(entry => {{
                if (entry.isIntersecting) entry.target.classList.add('visible');
            }});
        }});
        document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
    </script>
</body>
</html>
"""
    return html
