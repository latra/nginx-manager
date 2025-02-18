import docker
from schema import Config, NginxRoute, ProxyType
from database import Database

class DockerUtils:
    def __init__(self, config: Config):
        self.config = config
        try:
            # Intentar primero usar from_env()
            self.docker_client = docker.from_env()
        except docker.errors.DockerException:
            try:
                # Si falla, intentar con la URL específica
                self.docker_client = docker.DockerClient(base_url=config.docker.base_url)
            except docker.errors.DockerException as e:
                print(f"Error connecting to Docker: {e}")
                raise

        self.docker_network = self._get_docker_network()
        self.db = Database()

    def _get_docker_network(self):
        try:
            network = self.docker_client.networks.get(self.config.docker.network)
        except docker.errors.NotFound:
            network = self.docker_client.networks.create(
                self.config.docker.network,
                driver="bridge"
            )
        return network

    def get_docker_client(self):
        return self.docker_client.containers.list()

    def verify_dockers(self, routes: list[NginxRoute]):
        for route in routes:
            if route.proxy_type == ProxyType.docker:
                try:
                    registered = self.docker_client.containers.get(route.container_id)
                    if self.docker_network.name not in registered.attrs["NetworkSettings"]["Networks"]:
                        route.info = "Docker container not connected to the network"
                        self.db.deactivate_route(route)
                except docker.errors.NotFound:
                    route.info = "Docker container not found"
                    self.db.deactivate_route(route)

    def get_docker_network(self):
        return self.docker_network
    
    def connect_containers(self, routes: list[NginxRoute]):
        for route in routes:
            self.docker_network.connect(route.container_id)

    def restart_container(self, container_id: str):
        self.docker_client.containers.get(container_id).restart()

    def get_container_info(self, container_id: str):
        return self.docker_client.containers.get(container_id).attrs