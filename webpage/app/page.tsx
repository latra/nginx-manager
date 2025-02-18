"use client"
import { Card } from './components/ui'
import PathsList from './pathsLists'
import DomainList from './domainList'
import CreateEntry from './createEntry'
import NginxStatus from './nginxStatus'
import { useCallback, useRef } from 'react'

export default function Home() {
  const pathsListRef = useRef<{ loadRoutes: () => void } | null>(null)

  const handleNginxRestart = useCallback(() => {
    pathsListRef.current?.loadRoutes()
  }, [])

  const handleRouteCreated = useCallback(() => {
    pathsListRef.current?.loadRoutes()
  }, [])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="col-span-1 m-4" >
        <Card>
          <h2 className="text-base font-semibold leading-7 text-gray-900 mb-4">
            Nginx Status
          </h2>
          <NginxStatus onRestart={handleNginxRestart} />
        </Card>
        <Card>
          <h2 className="text-base font-semibold leading-7 text-gray-900 mb-4">
            Domains
          </h2>
          <DomainList />
        </Card>
        </div>
        <Card>
          <h2 className="text-base font-semibold leading-7 text-gray-900 mb-4">
            Create New Route
          </h2>
          <CreateEntry onRouteCreated={handleRouteCreated} />
        </Card>
      </div>

      <Card>
        <h2 className="text-base font-semibold leading-7 text-gray-900 mb-4">
          Routes
        </h2>
        <PathsList ref={pathsListRef} />
      </Card>
    </div>
  )
}
