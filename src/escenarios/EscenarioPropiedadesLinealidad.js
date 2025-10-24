/**
 * ESCENARIO: EscenarioPropiedadesLinealidad
 * RESPONSABILIDAD: Gestionar el escenario de visualización de linealidad
 * SRP: Solo coordina la visualización de linealidad, no maneja lógica de negocio
 */
import { Escenario } from "./Escenario.js"
import { EstadoLinealidad } from "../entidades/EstadoLinealidad.js"
import { ConfiguracionLinealidad } from "../entidades/ConfiguracionLinealidad.js"
import { CalculadoraLinealidad } from "../servicios/CalculadoraLinealidad.js"
import { VerificadorLinealidad } from "../servicios/VerificadorLinealidad.js"
import { GestorVisualizacionLinealidad } from "../servicios/GestorVisualizacionLinealidad.js"
import { RenderizadorGraficoLinealidad } from "../presentacion/RenderizadorGraficoLinealidad.js"
import { RenderizadorCalculosLinealidad } from "../presentacion/RenderizadorCalculosLinealidad.js"
import { TransformadorCoordenadas } from "../servicios/TransformadorCoordenadas.js"

export class EscenarioPropiedadesLinealidad extends Escenario {
  constructor() {
    super()
    
    this.nombre = "Propiedades Mágicas - Linealidad"
    this.descripcion = "Visualización interactiva de la propiedad de linealidad de las integrales"
    
    // Inicializar componentes
    this.estado = new EstadoLinealidad()
    this.configuracion = new ConfiguracionLinealidad()
    this.calculadora = new CalculadoraLinealidad()
    this.verificador = new VerificadorLinealidad()
    this.gestorVisualizacion = new GestorVisualizacionLinealidad()
    
    // Renderizadores (se inicializarán cuando se tenga canvas)
    this.renderizadorGrafico = null
    this.renderizadorCalculos = null
    this.transformador = null
    
    this.inicializar()
  }

  // Inicializar el escenario
  inicializar() {
    // Configurar callback de cambio de estado
    this.gestorVisualizacion.onEstadoCambiado = () => {
      this.onEstadoCambiado()
    }
    
    // Inicializar gestor de visualización
    this.gestorVisualizacion.inicializar(
      this.estado,
      this.configuracion,
      this.calculadora,
      this.verificador,
      this.renderizadorGrafico,
      this.renderizadorCalculos
    )
  }

  // Configurar canvas y renderizadores
  configurarCanvas(canvas, containerCalculos, containerTooltip = null) {
    if (!canvas || !containerCalculos) {
      throw new Error("Canvas y container de cálculos son requeridos")
    }
    
    // Crear transformador de coordenadas
    const intervaloX = { 
      min: this.estado.limiteA, 
      max: this.estado.limiteB,
      inicio: this.estado.limiteA,  // Para compatibilidad
      fin: this.estado.limiteB     // Para compatibilidad
    }
    const intervaloY = { 
      min: -10, 
      max: 10,
      inicio: -10,  // Para compatibilidad
      fin: 10       // Para compatibilidad
    }
    
    
    this.transformador = new TransformadorCoordenadas(
      this.configuracion,
      intervaloX,
      intervaloY
    )
    
    // Crear renderizadores
    this.renderizadorGrafico = new RenderizadorGraficoLinealidad(
      canvas,
      this.configuracion,
      this.transformador
    )
    
    this.renderizadorCalculos = new RenderizadorCalculosLinealidad(containerCalculos)
    
    // Configurar interacción (tooltip) - opcional
    if (containerTooltip && this.renderizadorGrafico) {
      try {
        this.renderizadorGrafico.configurarInteraccion(
          this.estado,
          this.calculadora,
          containerTooltip
        )
      } catch (error) {
        // Continuar sin tooltip
      }
    }
    
    // Actualizar gestor de visualización
    this.gestorVisualizacion.inicializar(
      this.estado,
      this.configuracion,
      this.calculadora,
      this.verificador,
      this.renderizadorGrafico,
      this.renderizadorCalculos
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
  actualizarFFuncion(funcion) {
    this.gestorVisualizacion.actualizarFFuncion(funcion)
  }

  actualizarGFuncion(funcion) {
    this.gestorVisualizacion.actualizarGFuncion(funcion)
  }

  actualizarAlpha(alpha) {
    this.gestorVisualizacion.actualizarAlpha(alpha)
  }

  actualizarBeta(beta) {
    this.gestorVisualizacion.actualizarBeta(beta)
  }

  actualizarLimiteA(limiteA) {
    this.gestorVisualizacion.actualizarLimiteA(limiteA)
  }

  actualizarLimiteB(limiteB) {
    this.gestorVisualizacion.actualizarLimiteB(limiteB)
  }

  // Obtener datos
  obtenerDatos() {
    return {
      estado: this.estado,
      calculos: this.gestorVisualizacion.obtenerCalculos(),
      validacion: this.gestorVisualizacion.obtenerValidacion(),
      casosEspeciales: this.gestorVisualizacion.obtenerCasosEspeciales(),
      funcionesDisponibles: this.gestorVisualizacion.obtenerFuncionesDisponibles(),
      configuracionSliders: this.gestorVisualizacion.obtenerConfiguracionSliders(),
      colores: this.gestorVisualizacion.obtenerColores()
    }
  }

  // Obtener estado
  obtenerEstado() {
    return this.estado
  }

  // Obtener configuración
  obtenerConfiguracion() {
    return this.configuracion
  }

  // Reiniciar
  reiniciar() {
    this.estado.reiniciar()
    this.gestorVisualizacion.reiniciar()
  }

  // Obtener funciones disponibles
  obtenerFuncionesDisponibles() {
    return this.gestorVisualizacion.obtenerFuncionesDisponibles()
  }

  // Obtener configuración de sliders
  obtenerConfiguracionSliders() {
    return this.gestorVisualizacion.obtenerConfiguracionSliders()
  }

  // Obtener colores
  obtenerColores() {
    return this.gestorVisualizacion.obtenerColores()
  }

  // Obtener casos especiales
  obtenerCasosEspeciales() {
    return this.gestorVisualizacion.obtenerCasosEspeciales()
  }

  // Verificar si está inicializado
  estaInicializado() {
    return this.gestorVisualizacion && this.renderizadorGrafico && this.renderizadorCalculos
  }

  // Obtener nombre
  obtenerNombre() {
    return this.nombre
  }

  // Obtener descripción
  obtenerDescripcion() {
    return this.descripcion
  }
}
