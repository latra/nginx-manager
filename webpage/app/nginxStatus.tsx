"use client"

import { useEffect, useState } from 'react'
import { getNginxStatus, updateNginxConfig } from './api'
import { Button, Badge } from './components/ui'

interface DockerStatus {
  State: {
    Status: string;
    Running: boolean;
    StartedAt: string;
  }
}

interface NginxStatusProps {
  onRestart?: () => void;
}

export default function NginxStatus({ onRestart }: NginxStatusProps) {
  const [status, setStatus] = useState<DockerStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)

  const loadStatus = async () => {
    try {
      const data = await getNginxStatus()
      setStatus(data)
    } catch (error) {
      console.error('Error loading nginx status:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleRestart = async () => {
    try {
      setUpdating(true)
      await updateNginxConfig()
      await loadStatus() // Recargar el estado después de reiniciar
      onRestart?.() // Llamar a la función de recarga si existe
    } catch (error) {
      console.error('Error restarting nginx:', error)
    } finally {
      setUpdating(false)
    }
  }

  useEffect(() => {
    loadStatus()
  }, [])

  if (loading) {
    return (
      <div className="text-center">
        <div className="animate-spin h-8 w-8 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto"></div>
      </div>
    )
  }

  if (!status) {
    return (
      <div className="text-red-600">
        Error loading Nginx status
      </div>
    )
  }

  const startDate = new Date(status.State.StartedAt)
  const formattedDate = startDate.toLocaleString()

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">Status:</span>
            <Badge variant={status.State.Running ? 'success' : 'error'}>
              {status.State.Status}
            </Badge>
          </div>
          <div className="text-sm text-gray-600">
            <span className="font-medium">Started at:</span> {formattedDate}
          </div>
        </div>
        <Button
          variant="primary"
          onClick={handleRestart}
          disabled={updating}
        >
          {updating ? 'Restarting...' : 'Restart Nginx'}
        </Button>
      </div>
    </div>
  )
}