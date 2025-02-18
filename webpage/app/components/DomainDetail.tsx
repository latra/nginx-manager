"use client"

import { useState, useEffect } from 'react'
import { Button, Input, Textarea } from './ui'
import { updateDomain, getDomainConfig } from '../api'
interface DomainDetailProps {
  domain: string
  onClose: () => void
  onUpdate: () => void
}

export function DomainDetail({ domain, onClose, onUpdate }: DomainDetailProps) {
  const [formData, setFormData] = useState({
    domain: domain,
    config: ''
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchDomainConfig = async () => {
      const config = await getDomainConfig(domain)
      setFormData(prev => ({ ...prev, config: config.custom_config || '' }))
      console.log(config.custom_config)
    }
    fetchDomainConfig()
  }, [domain])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
        await updateDomain(formData.domain, formData.config)
        onUpdate()
      onClose()
    } catch (error) {
      console.error('Error updating domain:', error)
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
          <h2 className="text-lg font-semibold">Domain Details</h2>
          <Button variant="secondary" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            
              <Input
                label="Domain"
                name="domain"
                disabled={true}
                value={formData.domain}
                onChange={handleInputChange}
                placeholder="example.com"
              />
          </div>

            <div className="font-mono">
              <Textarea
                label="Custom Configuration"
                name="config"
                value={formData.config || ''}
                onChange={handleInputChange}
                placeholder="proxy_set_header Host $host;
proxy_set_header X-Real-IP $remote_addr;"
                rows={4}
                className="font-mono text-sm"
              />
            </div>

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
              {loading ? 'Updating...' : 'Update Domain'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
} 