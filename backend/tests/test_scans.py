SAMPLE = {
    "title": "Te-gl_0010",
    "dataset": "Brain Tumor MRI Dataset",
    "tumor_type": "glioma",
}


def test_health(client):
    assert client.get("/health").json() == {"status": "ok"}


def test_create_and_read(client):
    created = client.post("/scans", json=SAMPLE)
    assert created.status_code == 201
    scan_id = created.json()["id"]

    response = client.get(f"/scans/{scan_id}")
    assert response.status_code == 200
    assert response.json()["title"] == SAMPLE["title"]


def test_search_by_title_and_dataset(client):
    client.post("/scans", json=SAMPLE)
    client.post("/scans", json={**SAMPLE, "title": "Tr-me_0042", "dataset": "Figshare"})

    by_title = client.get("/scans", params={"q": "tr-me"})
    assert [s["title"] for s in by_title.json()] == ["Tr-me_0042"]

    by_dataset = client.get("/scans", params={"q": "figshare"})
    assert [s["title"] for s in by_dataset.json()] == ["Tr-me_0042"]


def test_filter_by_tumor_type(client):
    client.post("/scans", json=SAMPLE)
    client.post("/scans", json={**SAMPLE, "title": "Tr-pi_0001", "tumor_type": "pituitary"})

    response = client.get("/scans", params={"tumor_type": "pituitary"})
    assert [s["title"] for s in response.json()] == ["Tr-pi_0001"]


def test_pagination(client):
    for i in range(5):
        client.post("/scans", json={**SAMPLE, "title": f"Scan {i}"})

    assert len(client.get("/scans", params={"limit": 2}).json()) == 2
    assert len(client.get("/scans", params={"limit": 2, "offset": 4}).json()) == 1


def test_update(client):
    scan_id = client.post("/scans", json=SAMPLE).json()["id"]
    response = client.patch(f"/scans/{scan_id}", json={"tumor_type": "meningioma"})
    assert response.status_code == 200
    assert response.json()["tumor_type"] == "meningioma"


def test_delete(client):
    scan_id = client.post("/scans", json=SAMPLE).json()["id"]
    assert client.delete(f"/scans/{scan_id}").status_code == 204
    assert client.get(f"/scans/{scan_id}").status_code == 404


def test_not_found(client):
    assert client.get("/scans/999").status_code == 404
    assert client.patch("/scans/999", json={"title": "New title"}).status_code == 404
    assert client.delete("/scans/999").status_code == 404


def test_validation_error(client):
    response = client.post("/scans", json={**SAMPLE, "tumor_type": "unknown"})
    assert response.status_code == 422

    response = client.post("/scans", json={**SAMPLE, "title": "ab"})
    assert response.status_code == 422


def test_duplicate_file_name(client):
    data = {**SAMPLE, "file_name": "Te-gl_0010.jpg"}
    assert client.post("/scans", json=data).status_code == 201
    assert client.post("/scans", json=data).status_code == 409
