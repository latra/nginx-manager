from enum import Enum
from pydantic import BaseModel
import yaml
class ProxyType(str, Enum):
    docker = "docker"
    static = "static"

class NginxRoute(BaseModel):
    proxy_type: ProxyType
    domain: str = ""
    path: str = "/"
    container_id: str | None = None
    target_path: str = ""
    port: int | None = None
    static_path: str | None = None
    enabled: bool = True
    info: str | None = None
    description: str | None = None
    custom_config: str | None = None
    project_name: str | None = None
    contact_user: str | None = None
class NginxRouteCreated(NginxRoute):
    id: int

class DockerConfig(BaseModel):
    base_url: str
    network: str

class NginxConfig(BaseModel):
    container_id: str
    static_path: str
    config_path: str
    docker_config_file: str
    config_warn_message: str
    private_key_path: str
    certificate_path: str
    letsencrypt_path: str

class Config(BaseModel):
    docker: DockerConfig
    nginx: NginxConfig

    @classmethod
    def load_from_yaml(cls, file_path: str) -> 'Config':
        with open(file_path, 'r') as file:
            config_data = yaml.safe_load(file)
        return cls(**config_data)
