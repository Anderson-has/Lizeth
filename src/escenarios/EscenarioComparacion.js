/**
 * ESCENARIO: EscenarioComparacion
 * RESPONSABILIDAD: Coordinar la propiedad de comparación
 * SRP: Solo coordinación, no cálculos ni renderizado
 */
import { Escenario } from './Escenario.js'
import { EstadoComparacion } from '../entidades/EstadoComparacion'
import { ConfiguracionComparacion } from '../entidades/ConfiguracionComparacion'
import { GestorVisualizacionComparacion } from '../servicios/GestorVisualizacionComparacion'
import { TransformadorCoordenadas } from '../servicios/TransformadorCoordenadas'

export class EscenarioComparacion extends Escenario {
    constructor() {
        // ✅ LLAMAR AL CONSTRUCTOR PADRE
        super('Comparación de Integrales', 'Propiedad de comparación de integrales')
        
        // Inicializar componentes
        this.estadoComparacion = new EstadoComparacion()
        this.configuracionComparacion = new ConfiguracionComparacion()
        this.gestorVisualizacion = new GestorVisualizacionComparacion(this.estadoComparacion, this.configuracionComparacion)

        // Referencias
        this.transformador = null
        this.canvas = null
        this.containerCalculos = null
    }
    
    // ✅ IMPLEMENTAR MÉTODO REQUERIDO POR ESCENARIO BASE
    inicializar() {
        // Ya inicializado en el constructor
        this.estado = this.estadoComparacion
        this.configuracion = this.configuracionComparacion
        return this
    }

    // Configurar canvas
    configurarCanvas(canvas, containerCalculos = null) {
        if (!canvas) {
            throw new Error("Canvas es requerido")
        }

        this.canvas = canvas
        this.containerCalculos = containerCalculos

        // Crear transformador de coordenadas
        const limites = this.estadoComparacion.obtenerLimites()
        const funciones = this.estadoComparacion.obtenerFunciones()
        
        // Calcular rango X basado en los límites
        const rangoX = Math.abs(limites.b - limites.a)
        const margenX = rangoX * 0.1 // 10% de margen
        const intervaloX = {
            min: Math.min(limites.a, limites.b) - margenX,
            max: Math.max(limites.a, limites.b) + margenX
        }
        
        // Calcular rango Y basado en las funciones
        const calculadora = this.gestorVisualizacion.calculadora
        const paso = (intervaloX.max - intervaloX.min) / 100
        let maxY = 0
        let minY = 0
        
        for (let x = intervaloX.min; x <= intervaloX.max; x += paso) {
            const yF = calculadora.calcularValorFuncion(funciones.f, x)
            const yG = calculadora.calcularValorFuncion(funciones.g, x)
            maxY = Math.max(maxY, yF, yG)
            minY = Math.min(minY, yF, yG)
        }
        
        const margenY = (maxY - minY) * 0.1 // 10% de margen
        const intervaloY = { 
            min: Math.max(minY - margenY, -2), // No ir muy abajo
            max: maxY + margenY 
        }

        this.transformador = new TransformadorCoordenadas(
            this.configuracionComparacion,
            intervaloX,
            intervaloY
        )

        // Configurar referencias en el gestor
        this.gestorVisualizacion.configurarReferencias(
            canvas,
            this.transformador,
            containerCalculos
        )

        // Renderizar inicial
        this.renderizar()
    }

    // Renderizar
    renderizar() {
        if (!this.gestorVisualizacion) return

        this.gestorVisualizacion.renderizar()
    }

    // Métodos de control
    actualizarLimites(a, b) {
        this.gestorVisualizacion.actualizarLimites(a, b)
    }

    actualizarFunciones(funcionF, funcionG) {
        this.gestorVisualizacion.actualizarFunciones(funcionF, funcionG)
    }

    // Manejar hover
    manejarHover(evento, canvas, transformador) {
        if (this.gestorVisualizacion && this.gestorVisualizacion.manejarHover) {
            this.gestorVisualizacion.manejarHover(evento, canvas, transformador)
        }
    }

    // Limpiar hover
    limpiarHover() {
        if (this.gestorVisualizacion && this.gestorVisualizacion.limpiarHover) {
            this.gestorVisualizacion.limpiarHover()
        }
    }

    // Obtener datos
    obtenerDatos() {
        return {
            estado: this.estado,
            configuracion: this.configuracion,
            calculadora: this.gestorVisualizacion.calculadora,
            verificador: this.gestorVisualizacion.verificador,
            renderizadorGrafico: this.gestorVisualizacion.renderizadorGrafico,
            renderizadorCalculos: this.gestorVisualizacion.renderizadorCalculos,
            gestorVisualizacion: this.gestorVisualizacion,
            transformador: this.transformador
        }
    }
}
