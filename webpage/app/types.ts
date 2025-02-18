export type ProxyType = 'docker' | 'static';

export interface NginxRoute {
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
  project_name?: string | null;
  contact_user?: string | null;
} 