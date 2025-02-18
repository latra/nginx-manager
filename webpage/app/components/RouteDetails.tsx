"use client"

import { useState } from 'react'
import { Button, Input, Textarea } from './ui'
import { NginxRoute } from '../types'
import { Tooltip } from './Tooltip'
import { updateRoute } from '../api'
interface RouteDetailsProps {
  route: NginxRoute
  onClose: () => void
  onUpdate: () => void
}

export function RouteDetails({ route, onClose, onUpdate }: RouteDetailsProps) {
  const [formData, setFormData] = useState(route)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
        await updateRoute(formData)
        onUpdate()
      onClose()
    } catch (error) {
      console.error('Error updating route:', error)
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
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Route Details</h2>
          <Button variant="secondary" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>

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
            <Tooltip text="La ruta donde se servirá el contenido">
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
                value={formData.contact_user || ''}
                onChange={handleInputChange}
                placeholder="Pepe Villuela"
                required
              />
            </Tooltip>
            <Tooltip text="Indica el nombre del proyecto">
              <Input
                label="Project Name"
                name="project_name"
                value={formData.project_name || ''}
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
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
            </div>
          )}

          {formData.proxy_type === 'static' && (
            <Tooltip text="La ruta en el sistema de archivos donde se encuentran los archivos estáticos">
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

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
            >
              {loading ? 'Updating...' : 'Update Route'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
} 