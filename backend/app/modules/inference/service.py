import io
import json
from functools import lru_cache

import numpy as np
import onnxruntime as ort
from PIL import Image, UnidentifiedImageError

from app.core.config import settings

IMAGE_SIZE = 224
MEAN = np.array([0.485, 0.456, 0.406], dtype=np.float32)
STD = np.array([0.229, 0.224, 0.225], dtype=np.float32)
LABEL_MAP = {"notumor": "no_tumor"}


class InvalidImageError(ValueError):
    pass


@lru_cache
def get_model() -> tuple[ort.InferenceSession, list[str]]:
    session = ort.InferenceSession(settings.model_path, providers=["CPUExecutionProvider"])
    with open(settings.labels_path, encoding="utf-8") as f:
        labels = [LABEL_MAP.get(name, name) for name in json.load(f)]
    return session, labels


def preprocess(content: bytes) -> np.ndarray:
    try:
        image = Image.open(io.BytesIO(content)).convert("RGB")
    except (UnidentifiedImageError, OSError) as exc:
        raise InvalidImageError("File is not a valid image") from exc
    image = image.resize((IMAGE_SIZE, IMAGE_SIZE), Image.Resampling.BILINEAR)
    array = (np.asarray(image, dtype=np.float32) / 255.0 - MEAN) / STD
    return array.transpose(2, 0, 1)[np.newaxis, ...]


def predict(content: bytes) -> tuple[str, float]:
    session, labels = get_model()
    logits = session.run(None, {"input": preprocess(content)})[0][0]
    exp = np.exp(logits - logits.max())
    probabilities = exp / exp.sum()
    index = int(probabilities.argmax())
    return labels[index], float(probabilities[index])
