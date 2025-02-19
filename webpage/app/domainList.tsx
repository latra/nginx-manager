"use client"

import { useEffect, useState, forwardRef, useImperativeHandle } from 'react'
import { getDomains } from './api'
import { DomainDetail } from './components/DomainDetail'
interface RoutesResponse {
  domains: string[];
}

const DomainList =  forwardRef((_, ref) => {
  const [domains, setDomains] = useState<RoutesResponse>({ domains: [] })
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [showDomainDetails, setShowDomainDetails] = useState(false)

  const loadDomains = async () => {
    try {
      const data = await getDomains()
      setDomains(data)
    } catch (error) {
      console.error('Error loading routes:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDomainClick = async (domain: string) => {
    setSelectedDomain(domain)
    setShowDomainDetails(true)
  }

  useImperativeHandle(ref, () => ({
    loadDomains
  }))

  useEffect(() => {
    loadDomains() 
  }, [])

  if (loading) {
    return (
      <div className="text-center py-4">
        <div className="animate-spin h-8 w-8 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8 flex flex-col gap-4">
          
                {domains.domains.length > 0 ? (
                  domains.domains.map((domain) => (
                  
                      <div key={domain} className="flex items-center justify-between">
                        <div>
                          <span className="font-medium text-gray-700"><i>{domain}</i></span> 
                        </div>
                        <button
                          className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                          onClick={() => {
                            handleDomainClick(domain)
                          }}
                        >
                          Update
                        </button>
                      </div>
                  ))
                ) : (
                  <div>No domains found</div>
                )}

      </div>
      </div>
      </div>
        {showDomainDetails && (
            <DomainDetail
              
              domain={selectedDomain ?? ''}
              onClose={() => setShowDomainDetails(false)}
              onUpdate={loadDomains}
            />
          )}
    </div>
  )
})

DomainList.displayName = 'DomainList'
export default DomainList