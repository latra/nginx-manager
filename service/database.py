import sqlite3
from contextlib import contextmanager
from schema import NginxRoute, NginxRouteCreated, ProxyType

class Database:
    def __init__(self, db_name="nginx_routes.db"):
        self.db_name = db_name
        self.init_db()

    @contextmanager
    def get_connection(self):
        conn = sqlite3.connect(self.db_name)
        try:
            yield conn
        finally:
            conn.close()

    def init_db(self):
        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS routes (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    domain TEXT NOT NULL,
                    path TEXT NOT NULL,
                    proxy_type TEXT NOT NULL,      
                    container_id TEXT,
                    port INTEGER,
                    static_path TEXT,
                    enabled BOOLEAN DEFAULT TRUE,
                    info TEXT,
                    description TEXT,
                    custom_config TEXT,
                    project_name TEXT,
                    contact_user TEXT,
                    UNIQUE(domain, path)
                )
            ''')
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS domains (
                    domain TEXT PRIMARY KEY NOT NULL,
                    custom_config TEXT,
                    UNIQUE(domain)
                )
            ''')
            conn.commit()

    def add_domain_custom_config(self, domain: str, custom_config: str):
        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute('''
                INSERT INTO domains (domain, custom_config) VALUES (?, ?)
            ''', (domain, custom_config))
            conn.commit()

    def update_domain_custom_config(self, domain: str, custom_config: str):
        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute('''
                UPDATE domains SET custom_config = ? WHERE domain = ?
            ''', (custom_config, domain))
            conn.commit()

    def get_domain_custom_config(self, domain: str):
        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute('''
                SELECT custom_config FROM domains WHERE domain = ?
            ''', (domain,))
            custom_config = cursor.fetchone()
            return custom_config[0] if custom_config else None

    def add_route(self, route: NginxRoute):
        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute('''
                INSERT INTO routes 
                (domain, path, proxy_type, container_id, port, static_path, enabled, info, description, custom_config, project_name, contact_user)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', (
                route.domain,
                route.path,
                route.proxy_type.value,
                route.container_id,
                route.port,
                route.static_path,
                route.enabled,
                route.info,
                route.description,
                route.custom_config,
                route.project_name,
                route.contact_user
            ))
            conn.commit()
            return True

    def update_route(self, id: int, route: NginxRoute):
        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute('''
                UPDATE routes SET domain = ?, path = ?, proxy_type = ?, container_id = ?, port = ?, static_path = ?, enabled = ?, info = ?, description = ?, custom_config = ?, project_name = ?, contact_user = ? WHERE id = ?
            ''', (route.domain, route.path, route.proxy_type.value, route.container_id, route.port, route.static_path, route.enabled, route.info, route.description, route.custom_config, route.project_name, route.contact_user, id))
            conn.commit()
            return True

    def get_routes_by_domain(self, domain: str):
        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute('''
                SELECT id, domain, path, proxy_type, container_id, port, static_path, enabled, info, description, custom_config, project_name, contact_user
                    FROM routes WHERE domain = ?
            ''', (domain,))
            routes = cursor.fetchall()
            print(routes)
            return [
                NginxRouteCreated(
                    id=route[0],
                    domain=route[1],
                    path=route[2],
                    proxy_type=route[3],
                    container_id=route[4],
                    port=route[5],
                    static_path=route[6],   
                    enabled=route[7],
                    info=route[8],
                    description=route[9],
                    custom_config=route[10],
                    project_name=route[11],
                    contact_user=route[12]
                )
                for route in routes
            ] 
    def get_domains(self):
        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute('''
                SELECT DISTINCT domain FROM routes
            ''')
            domains = cursor.fetchall()
            return [domain[0] for domain in domains]

    def get_all_routes(self):
        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute('''
                SELECT id, domain, path, proxy_type, container_id, port, static_path, enabled, info, description, custom_config, project_name, contact_user
                FROM routes
            ''')
            routes = cursor.fetchall()
            return [
                NginxRouteCreated(
                    id=route[0],
                    domain=route[1],
                    path=route[2],
                    proxy_type=route[3],
                    container_id=route[4],
                    port=route[5],
                    static_path=route[6],
                    enabled=route[7],
                    info=route[8],
                    description=route[9],
                    custom_config=route[10],
                    project_name=route[11],
                    contact_user=route[12]
                )
                for route in routes
            ] 
        
    def deactivate_route(self, route: NginxRoute):
        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute('''
                UPDATE routes SET enabled = FALSE, info = ? WHERE id = ?
            ''', (route.info, route.id))
            conn.commit()

    def activate_route(self, route: NginxRoute):
        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute('''
                UPDATE routes SET enabled = TRUE, info = ? WHERE id = ?
            ''', (route.info, route.id))
            conn.commit()   

    def get_route(self, id: int):
        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute('''
                SELECT id, domain, path, proxy_type, container_id, port, static_path, enabled, info, description, custom_config, project_name, contact_user FROM routes WHERE id = ?
            ''', (id,))
            route = cursor.fetchone()
            return NginxRouteCreated(
                id=route[0],
                domain=route[1],
                path=route[2],
                proxy_type=route[3],
                container_id=route[4],
                port=route[5],
                static_path=route[6],
                enabled=route[7],
                info=route[8],
                description=route[9],
                custom_config=route[10],
                project_name=route[11],
                contact_user=route[12]
            ) if route else None
        
    def delete_route(self, id: int):
        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute('''
                DELETE FROM routes WHERE id = ?
            ''', (id,))
            conn.commit()   