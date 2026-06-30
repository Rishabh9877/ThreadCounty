import hashlib
import random
from datetime import datetime


FABRIC_TYPES = ["Cotton", "Denim", "Twill", "Satin", "Linen"]

SUGGESTIONS_MAP = {
    "Cotton": [
        {"type": "quality", "text": "Cotton fabric shows consistent thread distribution. Quality meets standard production specifications."},
        {"type": "improvement", "text": "Consider using a tighter weave for better durability. Current density is suitable for lightweight applications."},
        {"type": "info", "text": "Plain weave structure detected. This is the most common cotton weave pattern."},
    ],
    "Denim": [
        {"type": "quality", "text": "Denim weave shows characteristic twill diagonal pattern with good thread regularity."},
        {"type": "improvement", "text": "Warp-to-weft ratio indicates a standard 3/1 twill. For heavier denim, consider increasing warp thread density."},
        {"type": "info", "text": "Indigo-dyed warp threads detected with undyed weft. Classic denim construction confirmed."},
    ],
    "Twill": [
        {"type": "quality", "text": "Twill weave pattern is well-defined with clear diagonal lines. Good structural integrity."},
        {"type": "improvement", "text": "Consider tighter weft packing for improved fabric hand feel and drape characteristics."},
        {"type": "info", "text": "2/1 twill pattern detected. This weave offers good balance of strength and flexibility."},
    ],
    "Satin": [
        {"type": "quality", "text": "Satin weave shows excellent surface smoothness with long float threads creating characteristic sheen."},
        {"type": "improvement", "text": "High float length may reduce abrasion resistance. Consider satin-back reinforcement for high-wear applications."},
        {"type": "info", "text": "5-harness satin detected. Float length creates premium lustrous appearance."},
    ],
    "Linen": [
        {"type": "quality", "text": "Linen fabric shows characteristic irregular thread thickness typical of natural flax fibers."},
        {"type": "improvement", "text": "Natural fiber variation is within acceptable range. Consider blending with cotton for more uniform appearance."},
        {"type": "info", "text": "Plain weave with typical linen slub texture detected. Natural fiber characteristics confirmed."},
    ],
}


def analyze_fabric(file_content: bytes, filename: str) -> dict:
    """
    Deterministic mock AI engine that generates realistic analysis results
    based on file content hash for consistency.
    """
    file_hash = hashlib.sha256(file_content).hexdigest()
    hash_int = int(file_hash[:8], 16)

    # Deterministic values based on file hash
    fabric_type = FABRIC_TYPES[hash_int % len(FABRIC_TYPES)]
    thread_density = 130 + (hash_int % 160)
    warp_ratio = 0.50 + (hash_int % 15) / 100
    warp_count = int(thread_density * warp_ratio)
    weft_count = thread_density - warp_count

    # Confidence based on file size (larger = higher confidence simulation)
    base_confidence = 88 + (hash_int % 11)
    confidence = min(99.9, base_confidence + random.uniform(0, 1.5))

    uniformity = 85 + (hash_int % 13)

    suggestions = SUGGESTIONS_MAP.get(fabric_type, SUGGESTIONS_MAP["Cotton"])

    return {
        "thread_density": thread_density,
        "warp_count": warp_count,
        "weft_count": weft_count,
        "fabric_type": fabric_type,
        "confidence": round(confidence, 1),
        "uniformity": round(uniformity, 1),
        "ai_suggestions": suggestions,
        "analysis_metadata": {
            "model_version": "v2.4.1",
            "processing_time_ms": 1200 + (hash_int % 800),
            "input_resolution": f"{800 + (hash_int % 400)}x{600 + (hash_int % 300)}",
        },
    }
