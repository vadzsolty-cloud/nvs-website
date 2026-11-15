#!/usr/bin/env python3
"""Create responsive AVIF/WebP/JPEG variants of the owner photographs.

Originals in media/originals/ are never modified. Variants are resized only
(no crop, no retouching, aspect ratio kept; listed "redact" boxes such as a VIN are blurred) and stripped of EXIF/GPS metadata.
Output: public/assets/photos/<slug>-<width>.<ext> and src/photo-variants.json.
Requires Pillow >= 11 with WebP and AVIF support.
"""
import json
import pathlib
from PIL import Image, ImageFilter, ImageOps, features

ROOT = pathlib.Path(__file__).resolve().parent.parent
SRC = ROOT / "media" / "originals"
OUT = ROOT / "public" / "assets" / "photos"
assert features.check("webp") and features.check("avif"), "Pillow needs WebP and AVIF"

catalog = json.loads((ROOT / "media" / "photos.json").read_text(encoding="utf-8"))
OUT.mkdir(parents=True, exist_ok=True)
for old in OUT.glob("*"):
    old.unlink()

variants = {}
for photo in catalog["photos"]:
    image = ImageOps.exif_transpose(Image.open(SRC / photo["original"])).convert("RGB")
    for box in photo.get("redact", []):  # privacy: blur VIN / identifiers in the web copies only
        region = image.crop(tuple(box)).filter(ImageFilter.GaussianBlur(18)).filter(ImageFilter.GaussianBlur(18))
        image.paste(region, tuple(box[:2]))
    width, height = image.size
    sizes = sorted({min(w, width) for w in photo["widths"]})
    entry = {"original": photo["original"], "width": width, "height": height, "widths": sizes}
    for w in sizes:
        h = round(height * w / width)
        resized = image if w == width else image.resize((w, h), Image.LANCZOS)
        base = OUT / f"{photo['slug']}-{w}"
        resized.save(base.with_suffix(".avif"), quality=58, speed=4)
        resized.save(base.with_suffix(".webp"), quality=80, method=6)
        if w == sizes[-1]:  # one JPEG fallback (also the no-JS full-size link)
            resized.save(base.with_suffix(".jpg"), quality=82, optimize=True, progressive=True)
    variants[photo["slug"]] = entry
    print(photo["slug"], f"{width}x{height}", sizes)

(ROOT / "src" / "photo-variants.json").write_text(json.dumps(variants, indent=1) + "\n", encoding="utf-8")
