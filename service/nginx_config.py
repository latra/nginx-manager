
def _get_server_regex(server_name: str):
    return "~^(www\.)?{}".format(server_name.replace(".", "\\."))

def config_lines(is_default: bool = False, server_name: str = None, ssl_certificate: str = "", ssl_certificate_key: str = ""):
    server_name_field = "server_name " + _get_server_regex(server_name) + ";" if server_name and server_name != "default" else ""
    default_server = "default_server" if is_default else ""
    return f"""
\tlisten 443 ssl {default_server};
\tssl_protocols               TLSv1.2 TLSv1.3;
\tssl_ciphers                 ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES128-GCM-SHA256;
\tssl_prefer_server_ciphers   on;
\t{server_name_field}
\tssl_certificate     {ssl_certificate};
\tssl_certificate_key {ssl_certificate_key};
\tclient_max_body_size 200M;
"""

def generate_config_file(server_config: str, routes_config: list[str] = [], warn_message: str = ""):
    config = f"""
server {{
{warn_message}
{server_config}
{"\n".join(routes_config)}
}}"""
    return config

def _get_path(path: str):
    return f"{path}" if path[-1] == "/" else f"{path}/"

def generate_route_config(path: str, container_id: str, port: int, custom_config: str | None = None, target_path: str | None = None):
    print(path, container_id, port)
    config = f"""
\tlocation {_get_path(path)} {{
    \tproxy_pass http://{container_id}:{port}{target_path if target_path and target_path[0] == "/" else "/" + target_path if target_path else ""};
    \tproxy_set_header Host $http_host;
    \t{custom_config}
\t}}
    """
    return config 