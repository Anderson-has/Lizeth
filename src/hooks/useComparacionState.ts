import { useRef, useState, useCallback, useEffect } from 'react'
import { EscenarioFactory } from '../escenarios/EscenarioFactory'

export function useComparacionState() {
    const escenarioFactory = useRef<EscenarioFactory | null>(null)
    const escenarioComparacion = useRef<any>(null)
    const [estado, setEstado] = useState<any>(null)

    // Inicializar escenario automáticamente
    useEffect(() => {
        if (!escenarioFactory.current) {
            escenarioFactory.current = new EscenarioFactory()
            escenarioComparacion.current = escenarioFactory.current.crearEscenario('comparacion')
            setEstado(escenarioComparacion.current.estado)
        }
    }, [])

    const inicializarEscenario = useCallback(() => {
        if (!escenarioFactory.current) {
            escenarioFactory.current = new EscenarioFactory()
            escenarioComparacion.current = escenarioFactory.current.crearEscenario('comparacion')
            setEstado(escenarioComparacion.current.estado)
        }
        return escenarioComparacion.current
    }, [])

    const actualizarEstado = useCallback(() => {
        if (escenarioComparacion.current) {
            setEstado(escenarioComparacion.current.estado)
        }
    }, [])

    return {
        escenarioComparacion,
        estado,
        inicializarEscenario,
        actualizarEstado
    }
}
