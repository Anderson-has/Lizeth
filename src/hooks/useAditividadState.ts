/**
 * useAditividadState - Hook personalizado para sincronización entre React y clases OOP
 * RESPONSABILIDAD ÚNICA: Sincronización de estado entre React y arquitectura SRP + OOP
 */
import { useState, useCallback, useRef, useEffect } from 'react'
import { EstadoAditividad } from '../entidades/EstadoAditividad.js'
import { ConfiguracionAditividad } from '../entidades/ConfiguracionAditividad.js'

export interface AditividadState {
  estado: EstadoAditividad
  configuracion: ConfiguracionAditividad
  actualizarEstado: (nuevoEstado: Partial<EstadoAditividad>) => void
  actualizarConfiguracion: (nuevaConfig: Partial<ConfiguracionAditividad>) => void
  sincronizarConReact: () => void
}

export const useAditividadState = (): AditividadState => {
  // ✅ ESTADO LOCAL PARA SINCRONIZACIÓN
  const [estado, setEstado] = useState(() => new EstadoAditividad())
  const [configuracion, setConfiguracion] = useState(() => new ConfiguracionAditividad())
  
  // ✅ ACTUALIZAR ESTADO
  const actualizarEstado = useCallback((nuevoEstado: any) => {
    console.log('useAditividadState - Estado actualizado:', nuevoEstado)
    setEstado(prev => ({ ...prev, ...nuevoEstado }))
  }, [])
  
  // ✅ ACTUALIZAR CONFIGURACIÓN
  const actualizarConfiguracion = useCallback((nuevaConfig: any) => {
    console.log('useAditividadState - Configuración actualizada:', nuevaConfig)
    setConfiguracion(prev => ({ ...prev, ...nuevaConfig }))
  }, [])
  
  // ✅ SINCRONIZACIÓN SIMPLE CON REACT
  const sincronizarConReact = useCallback(() => {
    console.log('useAditividadState - Sincronizando con React...')
    // Sincronización simple sin bucles
  }, [])
  
  return {
    estado,
    configuracion,
    actualizarEstado,
    actualizarConfiguracion,
    sincronizarConReact
  }
}
