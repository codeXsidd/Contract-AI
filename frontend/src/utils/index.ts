import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function formatCurrency(amount: number | null | undefined, currency = 'USD'): string {
  if (amount == null) return '—'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function getDaysRemaining(dateStr: string): number {
  const target = new Date(dateStr)
  const now = new Date()
  const diff = target.getTime() - now.getTime()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

export function getRiskColor(score: number): string {
  if (score <= 30) return '#10b981'
  if (score <= 60) return '#f59e0b'
  return '#ef4444'
}

export function getRiskLabel(score: number): string {
  if (score <= 30) return 'Safe'
  if (score <= 60) return 'Moderate'
  return 'High Risk'
}

export function getRiskBadgeClass(score: number): string {
  if (score <= 30) return 'badge badge-success'
  if (score <= 60) return 'badge badge-warning'
  return 'badge badge-danger'
}

export function getStatusBadgeClass(status: string): string {
  switch (status) {
    case 'active': return 'badge badge-success'
    case 'draft': return 'badge badge-neutral'
    case 'under_review': return 'badge badge-info'
    case 'approved': return 'badge badge-brand'
    case 'expired': return 'badge badge-danger'
    case 'renewed': return 'badge badge-success'
    case 'terminated': return 'badge badge-danger'
    default: return 'badge badge-neutral'
  }
}

export function truncate(text: string, maxLength = 80): string {
  if (text.length <= maxLength) return text
  return `${text.slice(0, maxLength)}...`
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export function sleep(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms))
}
