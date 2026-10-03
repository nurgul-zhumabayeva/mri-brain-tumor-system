import io

from PIL import Image

from app.core.config import settings

LABELS = {"glioma", "meningioma", "pituitary", "no_tumor"}


def make_image() -> bytes:
    buffer = io.BytesIO()
    Image.new("L", (256, 256), color=90).save(buffer, format="JPEG")
    return buffer.getvalue()


def test_predict_creates_scan(client, tmp_path, monkeypatch):
    monkeypatch.setattr(settings, "upload_dir", str(tmp_path))

    response = client.post(
        "/scans/predict", files={"file": ("scan_01.jpg", make_image(), "image/jpeg")}
    )
    assert response.status_code == 201

    scan = response.json()
    assert scan["title"] == "scan_01"
    assert scan["predicted_label"] in LABELS
    assert scan["tumor_type"] == scan["predicted_label"]
    assert 0.0 <= scan["confidence"] <= 1.0
    assert (tmp_path / scan["image_path"]).exists()


def test_predict_rejects_non_image(client, tmp_path, monkeypatch):
    monkeypatch.setattr(settings, "upload_dir", str(tmp_path))

    response = client.post(
        "/scans/predict", files={"file": ("notes.txt", b"not an image", "text/plain")}
    )
    assert response.status_code == 422


def test_delete_removes_image(client, tmp_path, monkeypatch):
    monkeypatch.setattr(settings, "upload_dir", str(tmp_path))

    scan = client.post(
        "/scans/predict", files={"file": ("scan_02.jpg", make_image(), "image/jpeg")}
    ).json()
    assert client.delete(f"/scans/{scan['id']}").status_code == 204
    assert not (tmp_path / scan["image_path"]).exists()


def test_predict_short_file_name(client, tmp_path, monkeypatch):
    monkeypatch.setattr(settings, "upload_dir", str(tmp_path))

    response = client.post("/scans/predict", files={"file": ("a.jpg", make_image(), "image/jpeg")})
    assert response.status_code == 201
    assert response.json()["title"] == "scan_a"
