'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/src/contexts/AuthContext'
import { Loader2 } from 'lucide-react'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: 'estudiante' | 'docente'
  redirectTo?: string
}

export function ProtectedRoute({ 
  children, 
  requiredRole, 
  redirectTo = '/login' 
}: ProtectedRouteProps) {
  const { usuario, estaAutenticado, cargando } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!cargando) {
      if (!estaAutenticado) {
        router.push(redirectTo)
        return
      }

      if (requiredRole && usuario?.tipoUsuario !== requiredRole) {
        // Redirigir según el tipo de usuario
        if (usuario?.esDocente()) {
          router.push('/dashboard-docente')
        } else if (usuario?.esEstudiante()) {
          router.push('/')
        } else {
          router.push(redirectTo)
        }
        return
      }
    }
  }, [usuario, estaAutenticado, cargando, requiredRole, redirectTo, router])

  if (cargando) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-purple-600" />
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    )
  }

  if (!estaAutenticado) {
    return null
  }

  if (requiredRole && usuario?.tipoUsuario !== requiredRole) {
    return null
  }

  return <>{children}</>
}
