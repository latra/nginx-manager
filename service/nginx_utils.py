from schema import Config, NginxRoute
from nginx_config import generate_route_config, generate_config_file, config_lines
class NginxUtils:
    def __init__(self, config: Config):
        self.static_path = config.nginx.static_path
        self.config_path = config.nginx.config_path
        self.docker_config_file = config.nginx.docker_config_file
        self.config_warn_message = config.nginx.config_warn_message
        self.private_key_path = config.nginx.private_key_path
        self.certificate_path = config.nginx.certificate_path
        self.letsencrypt_path = config.nginx.letsencrypt_path

    def update_nginx_config(self, domain: str, domain_config: str, routes: list[NginxRoute]):
        routes_config = [generate_route_config(route.path, route.container_id, route.port, route.custom_config) if route.enabled else '' for route in routes]
        config_data = generate_config_file(server_config=domain_config, routes_config=routes_config)
        if domain == "default":
            config_file_path = self.config_path + self.docker_config_file
        else:
            config_file_path = self.config_path + '.'.join(domain.split(".")[:-1]) + ".conf"
        with open(config_file_path, "w") as f:
            f.write(config_data)
        print(config_file_path)

    def get_ssl_certificate_route(self, path: str):
        return self.letsencrypt_path + path + "/fullchain.pem"
    
    def get_ssl_private_key_route(self, path: str):
        return self.letsencrypt_path + path + "/privkey.pem"
    
    def get_route_config(self, route: NginxRoute):
        return generate_route_config(route.path, route.container_id, route.port)
    
    def get_default_domain_config(self, domain: str):
        return config_lines(is_default=True if domain == "default" else False, 
                            server_name=domain, 
                            ssl_certificate=self.get_ssl_certificate_route(domain) if domain != "default" else self.certificate_path, 
                            ssl_certificate_key=self.get_ssl_private_key_route(domain) if domain != "default" else self.private_key_path)
