import { ProxyType } from './types';

const API_BASE_URL = 'http://localhost:8000';

// Configuración común de headers
const headers = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

interface NginxRoute {
  id: number;
  proxy_type: ProxyType;
  domain: string;
  path: string;
  container_id?: string | null;
  port?: number | null;
  static_path?: string | null;
  enabled: boolean;
  info?: string | null;
  custom_config?: string | null;
}

// Función auxiliar para manejar las respuestas
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    throw new Error(`Error: ${response.status} ${response.statusText}`);
  }
  return response.json();
};

// Funciones para cada endpoint
export const getConfig = async () => {
  const response = await fetch(`${API_BASE_URL}/config`, { headers });
  return handleResponse(response);
};

export const getDockerClient = async () => {
  const response = await fetch(`${API_BASE_URL}/docker_client`, { headers });
  return handleResponse(response);
};

export const verifyDockers = async () => {
  const response = await fetch(`${API_BASE_URL}/verify_dockers`, {
    method: 'POST',
    headers,
  });
  return handleResponse(response);
};

export const connectContainers = async (id: number) => {
  const response = await fetch(`${API_BASE_URL}/connect_container/${id}`, {
    method: 'PUT',
    headers,
  });
  return handleResponse(response);
};

export const getDomains = async () => {
  const response = await fetch(`${API_BASE_URL}/domains`, { headers });
  return handleResponse(response);
};

export const updateDomain = async (domain: string, config: string) => {
  const response = await fetch(`${API_BASE_URL}/domains/${domain}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify({ config }),
  });
  return handleResponse(response);
};

export const getDomainConfig = async (domain: string) => {
  const response = await fetch(`${API_BASE_URL}/domains/${domain}`, { headers });
  return handleResponse(response);
};

export const getRoutesByDomain = async (domain: string) => {
  const response = await fetch(`${API_BASE_URL}/routes/${domain}`, { headers });
  return handleResponse(response);
};

export const getRoutesGroupedByDomain = async () => {
  const response = await fetch(`${API_BASE_URL}/routes_by_domain`, { headers });
  return handleResponse(response);
};

export const getAllRoutes = async () => {
  const response = await fetch(`${API_BASE_URL}/routes`, { headers });
  return handleResponse(response);
};

export const registerRoute = async (route: NginxRoute) => {
  const response = await fetch(`${API_BASE_URL}/route`, {
    method: 'POST',
    headers,
    body: JSON.stringify(route),
  });
  return handleResponse(response);
};

export const updateRoute = async (route: NginxRoute) => {
  const response = await fetch(`${API_BASE_URL}/route/${route.id}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify(route),
  });
  return handleResponse(response);
};

export const deactivateRoute = async (id: number) => {
  const response = await fetch(`${API_BASE_URL}/route/deactivate/${id}`, {
    method: 'PUT',
    headers,
  });
  return handleResponse(response);
};

export const activateRoute = async (id: number) => {
  const response = await fetch(`${API_BASE_URL}/route/activate/${id}`, {
    method: 'PUT',
    headers,
  });
  return handleResponse(response);
};

export const deleteRoute = async (id: number) => {
  const response = await fetch(`${API_BASE_URL}/route/${id}`, {
    method: 'DELETE',
    headers,
  });
  return handleResponse(response);
};

export const getNginxStatus = async () => {
  const response = await fetch(`${API_BASE_URL}/nginx_status`, { headers });
  return handleResponse(response);
};

export const updateNginxConfig = async () => {
  const response = await fetch(`${API_BASE_URL}/update_nginx_config`, {
    method: 'POST',
    headers,
  });
  return handleResponse(response);
}; 

