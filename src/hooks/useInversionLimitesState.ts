/**
 * useInversionLimitesState - Hook para sincronizar React con el escenario de inversión de límites
 * RESPONSABILIDAD ÚNICA: Solo sincronización entre React y OOP
 */
import { useRef, useCallback, useState } from 'react'
import { EscenarioFactory } from '../escenarios/EscenarioFactory.js'

export const useInversionLimitesState = () => {
    const escenarioFactory = useRef<EscenarioFactory | null>(null)
    const escenarioRef = useRef<any>(null)
    const [isInitialized, setIsInitialized] = useState(false)
    
    // Inicializar escenario
    const inicializarEscenario = useCallback(() => {
        if (!escenarioFactory.current) {
            escenarioFactory.current = new EscenarioFactory()
            escenarioRef.current = escenarioFactory.current.crearEscenario('inversion-limites')
            setIsInitialized(true)
        }
    }, [])
    
    // Sincronizar con React
    const sincronizarConReact = useCallback(() => {
        if (escenarioRef.current) {
            // Solo sincronizar estado, NO lógica de negocio
            const estado = escenarioRef.current.obtenerEstado()
            // Aquí se puede actualizar el estado de React si es necesario
        }
    }, [])
    
    // Actualizar límites
    const actualizarLimites = useCallback((a: number, b: number) => {
        if (escenarioRef.current) {
            escenarioRef.current.actualizarLimites(a, b)
        }
    }, [])
    
    // Actualizar función
    const actualizarFuncion = useCallback((funcion: string) => {
        if (escenarioRef.current) {
            escenarioRef.current.actualizarFuncion(funcion)
        }
    }, [])
    
    // Obtener datos
    const obtenerDatos = useCallback(() => {
        if (escenarioRef.current) {
            return escenarioRef.current.obtenerDatos()
        }
        return null
    }, [])
    
    // Reiniciar
    const reiniciar = useCallback(() => {
        if (escenarioRef.current) {
            escenarioRef.current.reiniciar()
        }
    }, [])
    
    return {
        escenarioRef,
        isInitialized,
        inicializarEscenario,
        sincronizarConReact,
        actualizarLimites,
        actualizarFuncion,
        obtenerDatos,
        reiniciar
    }
}
