'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { ServicioAutenticacion } from '../servicios/ServicioAutenticacion.js'

interface Usuario {
  id: string
  primerNombre: string
  segundoNombre?: string
  primerApellido: string
  segundoApellido?: string
  nombreUsuario: string
  correo: string
  tipoUsuario: 'estudiante' | 'docente'
  semestre?: number
  activo: boolean
  obtenerNombreCompleto(): string
  esDocente(): boolean
  esEstudiante(): boolean
}

interface AuthContextType {
  usuario: Usuario | null
  estaAutenticado: boolean
  cargando: boolean
  iniciarSesion: (correo: string, contrasena: string) => Promise<void>
  registrarUsuario: (datos: any) => Promise<void>
  cerrarSesion: () => void
  obtenerUsuarios: () => Usuario[]
  eliminarUsuario: (id: string) => boolean
  actualizarUsuario: (id: string, datos: any) => Usuario | null
  verificarPermisos: (permiso: string) => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null)
  const [cargando, setCargando] = useState(true)
  const [servicioAuth] = useState(() => {
    // Solo crear el servicio en el cliente
    if (typeof window !== 'undefined') {
      return new ServicioAutenticacion()
    }
    return null
  })

  useEffect(() => {
    // Verificar si hay una sesión activa al cargar la aplicación
    const verificarSesion = () => {
      try {
        // Verificar si estamos en el cliente y el servicio está disponible
        if (typeof window !== 'undefined' && servicioAuth) {
          const usuarioActual = servicioAuth.obtenerUsuarioActual()
          if (usuarioActual) {
            setUsuario(usuarioActual)
          }
        }
      } catch (error) {
        console.error('Error verificando sesión:', error)
      } finally {
        setCargando(false)
      }
    }

    verificarSesion()
  }, [servicioAuth])

  const iniciarSesion = async (correo: string, contrasena: string) => {
    if (!servicioAuth) {
      throw new Error('Servicio de autenticación no disponible')
    }
    try {
      setCargando(true)
      const usuarioAutenticado = servicioAuth.iniciarSesion(correo, contrasena)
      setUsuario(usuarioAutenticado)
    } catch (error) {
      throw error
    } finally {
      setCargando(false)
    }
  }

  const registrarUsuario = async (datos: any) => {
    if (!servicioAuth) {
      throw new Error('Servicio de autenticación no disponible')
    }
    try {
      setCargando(true)
      const nuevoUsuario = servicioAuth.registrarUsuario(datos)
      // No establecer como usuario actual automáticamente
      // El usuario debe hacer login después del registro
    } catch (error) {
      throw error
    } finally {
      setCargando(false)
    }
  }

  const cerrarSesion = () => {
    if (servicioAuth) {
      servicioAuth.cerrarSesion()
    }
    setUsuario(null)
  }

  const obtenerUsuarios = () => {
    if (!servicioAuth) return []
    return servicioAuth.obtenerTodosLosUsuarios()
  }

  const eliminarUsuario = (id: string) => {
    if (!servicioAuth) return false
    const resultado = servicioAuth.eliminarUsuario(id)
    if (resultado) {
      // Si se eliminó el usuario actual, cerrar sesión
      if (usuario?.id === id) {
        cerrarSesion()
      }
    }
    return resultado
  }

  const actualizarUsuario = (id: string, datos: any) => {
    if (!servicioAuth) return null
    const usuarioActualizado = servicioAuth.actualizarUsuario(id, datos)
    if (usuarioActualizado && usuario?.id === id) {
      setUsuario(usuarioActualizado)
    }
    return usuarioActualizado
  }

  const verificarPermisos = (permiso: string) => {
    if (!servicioAuth) return false
    return servicioAuth.verificarPermisos(permiso)
  }

  const value: AuthContextType = {
    usuario,
    estaAutenticado: !!usuario,
    cargando,
    iniciarSesion,
    registrarUsuario,
    cerrarSesion,
    obtenerUsuarios,
    eliminarUsuario,
    actualizarUsuario,
    verificarPermisos
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider')
  }
  return context
}
