"use client"

import { useEffect, useState, forwardRef, useImperativeHandle, useMemo } from 'react'
import { getAllRoutes } from './api'
import RouteRow from './components/RouteRow'
import { SearchFilter } from './components/SearchFilter'
import { NginxRoute } from './types'

interface RoutesResponse {
  routes: NginxRoute[];
}

const PathsList = forwardRef((props, ref) => {
  const [routes, setRoutes] = useState<RoutesResponse>({ routes: [] })
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({ domain: '', path: '' })

  const loadRoutes = async () => {
    try {
      const data = await getAllRoutes()
      setRoutes(data)
    } catch (error) {
      console.error('Error loading routes:', error)
    } finally {
      setLoading(false)
    }
  }

  useImperativeHandle(ref, () => ({
    loadRoutes
  }))

  useEffect(() => {
    loadRoutes()
  }, [])

  const filteredRoutes = useMemo(() => {
    return routes.routes.filter(route => {
      const domainMatch = route.domain.toLowerCase().includes(filters.domain.toLowerCase())
      const pathMatch = route.path.toLowerCase().includes(filters.path.toLowerCase())
      return domainMatch && pathMatch
    })
  }, [routes.routes, filters])

  if (loading) {
    return (
      <div className="text-center py-4">
        <div className="animate-spin h-8 w-8 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto"></div>
      </div>
    )
  }

  return (
    <div>
      <SearchFilter onFilterChange={setFilters} />
      
      <div className="flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table className="min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Domain</th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Path</th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Type</th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Info</th>
                  <th className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredRoutes.length > 0 ? (
                  filteredRoutes.map((route) => (
                    <RouteRow 
                      key={`${route.domain}${route.path}`}
                      route={route}
                      onRouteChange={loadRoutes}
                    />
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-3 py-4 text-sm text-gray-500 text-center">
                      No routes found matching your filters
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
})

PathsList.displayName = 'PathsList'

export default PathsList