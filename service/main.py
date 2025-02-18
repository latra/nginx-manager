from fastapi import FastAPI, HTTPException
from schema import NginxRoute, Config
from database import Database
from contextlib import asynccontextmanager
from docker_utils import DockerUtils
from nginx_utils import NginxUtils
from fastapi.middleware.cors import CORSMiddleware

@asynccontextmanager
async def startup_event(fastapi_app: FastAPI):
    # Any initialization code can go here
    fastapi_app.config = Config.load_from_yaml("config.yaml")
    fastapi_app.docker_utils = DockerUtils(fastapi_app.config)
    fastapi_app.nginx_utils = NginxUtils(fastapi_app.config)
    print("FastAPI application has started.")
    yield
    print("FastAPI application has stopped.")

nginx_app = FastAPI(lifespan=startup_event)

nginx_app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

db = Database()
nginx_app.config = None


@nginx_app.get("/config", tags=["config"])
def get_config():
    return nginx_app.config.model_dump()

@nginx_app.get("/docker_client", tags=["docker"])
def get_docker_client():
    print(nginx_app.docker_utils.get_docker_client())
    return {"message": "Docker client retrieved successfully"}

@nginx_app.post("/verify_dockers", tags=["docker"])
def verify_dockers():
    nginx_app.docker_utils.verify_dockers(db.get_all_routes())
    return {"message": "Dockers verified successfully"}

@nginx_app.post("/connect_containers", tags=["docker"])
def connect_containers():
    nginx_app.docker_utils.connect_containers(db.get_all_routes())
    return {"message": "Containers connected successfully"}

@nginx_app.put("/connect_container/{id}", tags=["docker"])
def connect_container(id: int):
    nginx_app.docker_utils.connect_containers([db.get_route(id)])
    return {"message": "Container connected successfully"}

@nginx_app.get("/domains", tags=["domains"])
def get_domains():
    domains = db.get_domains()
    return {"domains": domains}

@nginx_app.get("/domains/{domain}", tags=["domains"])
def get_domain_custom_config(domain: str):
    custom_config = db.get_domain_custom_config(domain)
    return {"custom_config": custom_config}

@nginx_app.put("/domains/{domain}", tags=["domains"])
def add_domain_custom_config(domain: str, custom_config: dict):
    db.update_domain_custom_config(domain, custom_config["config"])
    return {"message": "Domain custom config added successfully"}

@nginx_app.get("/routes/{domain}", tags=["routes"])
def get_routes_filtered_by_domain(domain: str):
    routes = db.get_routes_by_domain(domain)
    return {"routes": [route.model_dump() for route in routes]}

@nginx_app.get("/routes_by_domain", tags=["routes"])
def get_routes_grouped_by_domain():
    domains = db.get_domains()
    routes = {}
    for domain in domains:
        routes[domain] = [route.model_dump() for route in db.get_routes_by_domain(domain)]
    return {"routes": routes}

@nginx_app.get("/routes", tags=["routes"])
def get_routes():
    routes = db.get_all_routes()
    return {"routes": [route.model_dump() for route in routes]}

@nginx_app.post("/route", tags=["routes"])
def register_route(route: NginxRoute):
    if not route.domain or route.domain == "":
        route.domain = "default"
    domain = db.get_domain_custom_config(route.domain)
    if not domain:
        db.add_domain_custom_config(route.domain, nginx_app.nginx_utils.get_default_domain_config(route.domain))
    if db.add_route(route):
        return {"message": "Route registered successfully", "route": route}
    raise HTTPException(status_code=500)

@nginx_app.put("/route/{id}", tags=["routes"])
def update_route(id: int, route: NginxRoute):
    if db.update_route(id, route):
        return {"message": "Route updated successfully", "route": route}
    raise HTTPException(status_code=500)

@nginx_app.put("/route/deactivate/{id}", tags=["routes"])
def deactivate_route(id: int):
    route = db.get_route(id)
    if route:
        route.enabled = False
        route.info = "Manually deactivated"
        db.deactivate_route(route)
        return {"message": "Route deactivated successfully", "route": route}
    raise HTTPException(status_code=404)

@nginx_app.put("/route/activate/{id}", tags=["routes"])
def activate_route(id: int):
    route = db.get_route(id)
    if route:
        route.enabled = True
        route.info = "OK"
        db.activate_route(route)
        nginx_app.docker_utils.verify_dockers([route])
        return {"route": route.model_dump()}
    raise HTTPException(status_code=404)

@nginx_app.delete("/route/{id}", tags=["routes"])
def delete_route(id: int):
    db.delete_route(id)
    return {"message": "Route deleted successfully"}

@nginx_app.get("/nginx_status", tags=["nginx"])
def get_nginx_status():
    return nginx_app.docker_utils.get_container_info(nginx_app.config.nginx.container_id)

@nginx_app.post("/update_nginx_config", tags=["nginx"])
def update_nginx_config():
    nginx_app.docker_utils.verify_dockers(db.get_all_routes())

    domains = db.get_domains()
    for domain in domains:
        domain_config = db.get_domain_custom_config(domain)
        nginx_app.nginx_utils.update_nginx_config(domain, domain_config, db.get_routes_by_domain(domain))
    
    nginx_app.docker_utils.restart_container(nginx_app.config.nginx.container_id)
    return {"message": "Nginx config updated successfully"}