"use client"

import { useState } from 'react'
import { Button, Input, Textarea } from './components/ui'
import { Tooltip } from './components/Tooltip'
import { ProxyType } from './types'
import { registerRoute } from './api'

interface FormData {
  domain: string
  path: string
  proxy_type: ProxyType
  container_id?: string
  port?: number
  target_path?: string
  static_path?: string
  custom_config?: string
  description?: string
  project_name?: string
  contact_user: string
}

interface CreateEntryProps {
  onRouteCreated?: () => void;
}

export default function CreateEntry({ onRouteCreated }: CreateEntryProps) {
  const [formData, setFormData] = useState<FormData>({
    domain: '',
    path: '/',
    proxy_type: 'docker',
    custom_config: '',
    container_id: '',
    port: undefined,
    target_path: '',
    static_path: '',
    project_name: '',
    contact_user: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      await registerRoute({
        ...formData,
        enabled: true,
        id: 0,
      })
      
      setFormData({
        domain: '',
        path: '/',
        proxy_type: 'docker',
        custom_config: '',
        container_id: '',
        port: undefined,
        static_path: '',
        project_name: '',
        contact_user: ''
      })

      onRouteCreated?.()
    } catch (err) {
      setError('Error creating route. Please try again.')
      console.error('Error creating route:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Tooltip text="Si no tienes dominio, deja el campo vacío">
          <Input
            label="Domain"
            name="domain"
            value={formData.domain}
            onChange={handleInputChange}
            placeholder="example.com"
          />
        </Tooltip>
        <Tooltip text="La ruta donde se servirá el contenido. Ejemplo: /api">
          <Input
            label="Path"
            name="path"
            value={formData.path}
            onChange={handleInputChange}
            placeholder="/api"
            required
          />
        </Tooltip>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Tooltip text="Indica tu nombre">
          <Input
            label="Name"
            name="contact_user"
            value={formData.contact_user}
            onChange={handleInputChange}
            placeholder="Pepe Villuela"
            required
          />
        </Tooltip>
        <Tooltip text="Indica el nombre del proyecto">
          <Input
            label="Project Name"
            name="project_name"
            value={formData.project_name}
            onChange={handleInputChange}
            placeholder="My Project"
            required
          />
        </Tooltip>
      </div>

      <div className="flex items-center space-x-4">
        <label className="text-sm font-medium text-gray-700">Proxy Type:</label>
        <div className="flex items-center space-x-4">
          <Tooltip text="Selecciona esta opción si quieres redirigir a un contenedor Docker">
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="proxy_type"
                value="docker"
                checked={formData.proxy_type === 'docker'}
                onChange={() => setFormData(prev => ({ ...prev, proxy_type: 'docker' }))}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-600"
              />
              <span className="ml-2 text-sm text-gray-700">Docker</span>
            </label>
          </Tooltip>
          <Tooltip text="Selecciona esta opción si quieres servir archivos estáticos">
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="proxy_type"
                value="static"
                checked={formData.proxy_type === 'static'}
                onChange={() => setFormData(prev => ({ ...prev, proxy_type: 'static' }))}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-600"
              />
              <span className="ml-2 text-sm text-gray-700">Static</span>
            </label>
          </Tooltip>
        </div>
      </div>

      {formData.proxy_type === 'docker' && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Tooltip text="El ID o nombre del contenedor Docker al que se redirigirá el tráfico">
            <Input
              label="Container ID"
              name="container_id"
              value={formData.container_id || ''}
              onChange={handleInputChange}
              placeholder="docker container id"
              required
            />
          </Tooltip>
          <Tooltip text="El puerto en el contenedor donde se está ejecutando el servicio">
            <Input
              label="Port"
              name="port"
              type="number"
              value={formData.port || ''}
              onChange={handleInputChange}
              placeholder="8080"
              required
            />
          </Tooltip>

          <Tooltip text="Si es necesario, una ruta dentro del contenedor especifica">
            <Input
              label="Target Path"
              name="target_path"
              value={formData.target_path || '/'}
              onChange={handleInputChange}
              placeholder="/"
              required
            />
          </Tooltip>
        </div>
      )}

      {formData.proxy_type === 'static' && (
        <Tooltip text="La ruta en el sistema de archivos donde se encuentran los archivos estáticos. Recuerda que la ruta es dentro del contenedor de nginx">
          <Input
            label="Static Path"
            name="static_path"
            value={formData.static_path || ''}
            onChange={handleInputChange}
            placeholder="/var/www/html"
            required
          />
        </Tooltip>
      )}

      <Tooltip text="Añade configuración personalizada de Nginx. Estas líneas se añadirán directamente al bloque de location">
        <div className="font-mono">
          <Textarea
            label="Custom Configuration"
            name="custom_config"
            value={formData.custom_config || ''}
            onChange={handleInputChange}
            placeholder="proxy_set_header Host $host;
proxy_set_header X-Real-IP $remote_addr;"
            rows={4}
            className="font-mono text-sm"
          />
        </div>
      </Tooltip>

      {error && (
        <div className="text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={loading}
        >
          {loading ? 'Creating...' : 'Create Route'}
        </Button>
      </div>
    </form>
  )
}