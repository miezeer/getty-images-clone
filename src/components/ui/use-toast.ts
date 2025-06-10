import React, { useState, useCallback } from "react"

export interface Toast {
  id: string
  title?: string
  description?: string
  variant?: "default" | "destructive"
  duration?: number
}

// Simple toast implementation
let toastCounter = 0
const toasts: Toast[] = []
const listeners: Array<(toasts: Toast[]) => void> = []

const addToast = (toast: Omit<Toast, "id">) => {
  const id = `toast-${++toastCounter}`
  const newToast = { id, ...toast }
  toasts.push(newToast)

  for (const listener of listeners) {
    listener([...toasts]);
  }

  // Auto-remove after duration
  setTimeout(() => {
    removeToast(id)
  }, toast.duration || 5000)

  return id
}

const removeToast = (id: string) => {
  const index = toasts.findIndex(toast => toast.id === id)
  if (index > -1) {
    toasts.splice(index, 1)
    for (const listener of listeners) {
      listener([...toasts]);
    }
  }
}

export const toast = (toast: Omit<Toast, "id">) => {
  return addToast(toast)
}

export const useToast = () => {
  const [toastList, setToastList] = useState<Toast[]>([...toasts])

  const subscribe = useCallback((listener: (toasts: Toast[]) => void) => {
    listeners.push(listener)
    return () => {
      const index = listeners.indexOf(listener)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
  }, [])

  React.useEffect(() => {
    return subscribe(setToastList)
  }, [subscribe])

  return {
    toasts: toastList,
    toast,
    dismiss: removeToast
  }
}
