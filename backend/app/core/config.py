from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    database_url: str = "postgresql+psycopg://app:change_me@localhost:5432/research"
    cors_origins: list[str] = ["http://localhost:3000"]
    model_path: str = "ml/brain_tumor_resnet18.onnx"
    labels_path: str = "ml/labels.json"
    upload_dir: str = "uploads"

    model_config = SettingsConfigDict(env_file=".env", extra="ignore", protected_namespaces=())


settings = Settings()
