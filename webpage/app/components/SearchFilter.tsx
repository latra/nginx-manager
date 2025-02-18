"use client"

import { Input } from './ui'
import { useState } from 'react'

interface SearchFilterProps {
  onFilterChange: (filters: { domain: string; path: string }) => void;
}

export function SearchFilter({ onFilterChange }: SearchFilterProps) {
  const [filters, setFilters] = useState({
    domain: '',
    path: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    const newFilters = { ...filters, [name]: value }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  return (
    <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
      <Input
        label="Filter by Domain"
        name="domain"
        value={filters.domain}
        onChange={handleChange}
        placeholder="example.com"
      />
      <Input
        label="Filter by Path"
        name="path"
        value={filters.path}
        onChange={handleChange}
        placeholder="/api"
      />
    </div>
  )
} 