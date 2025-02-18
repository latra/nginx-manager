import { useState } from 'react'
import { Button, Badge } from './ui'
import { activateRoute, deactivateRoute, deleteRoute, connectContainers } from '../api'
import { NginxRoute } from '../types'
import { RouteDetails } from './RouteDetails'

interface RouteRowProps {
  route: NginxRoute;
  onRouteChange: () => void;
}

export default function RouteRow({ route, onRouteChange }: RouteRowProps) {
  const [showDetails, setShowDetails] = useState(false)

  const handleStatusChange = async () => {
    try {
      if (route.enabled) {
        await deactivateRoute(route.id)
      } else {
        await activateRoute(route.id)
      }
      onRouteChange()
    } catch (error) {
      console.error('Error changing route status:', error)
    }
  }
  
  const handleDelete = async () => {
    try {
      await deleteRoute(route.id)
      onRouteChange()
    } catch (error) {
      console.error('Error deleting route:', error)
    }
  }

  const handleForceConnection = async () => {
    try {
      await connectContainers(route.id)
      onRouteChange()
    } catch (error) {
      console.error('Error forcing connection:', error)
    }
  } 

  return (
    <tr key={`${route.domain}${route.path}`}>
      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
        {route.domain}
      </td>
      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
        {route.path}
      </td>
      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
        <Badge variant="default">{route.proxy_type}</Badge>
      </td>
      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
        <Badge variant={route.enabled ? 'success' : 'error'}>
          {route.enabled ? 'Active' : 'Inactive'}
        </Badge>
      </td>
      <td className="px-3 py-4 text-sm text-gray-500">
        {route.info || '-'}
      </td>
      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 text-right space-x-2">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setShowDetails(true)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </Button>
        <Button
          variant={route.enabled ? 'danger' : 'primary'}
          size="sm"
          onClick={handleStatusChange}
        >
          {route.enabled ? 'Deactivate' : 'Activate'}
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={handleForceConnection}
        >
          Force Connection
        </Button>
        <Button
          variant="danger"
          size="sm"
          onClick={handleDelete}
        >
          Delete
        </Button>
        {showDetails && (
          <RouteDetails
            route={route}
            onClose={() => setShowDetails(false)}
            onUpdate={onRouteChange}
          />
        )}
      </td>
    </tr>
  )
} 