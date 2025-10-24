/**
 * ESCENARIO: EscenarioJardinRiemann
 * RESPONSABILIDAD: Manejar la lógica específica del Jardín de Riemann
 * SRP: Solo maneja la lógica de negocio del escenario de Riemann, no la presentación
 */
import { Escenario } from "./Escenario.js"
import { EstadoVisualizacion } from "../entidades/EstadoVisualizacion.js"
import { ConfiguracionCanvas } from "../entidades/ConfiguracionCanvas.js"
import { CalculadoraRiemann } from "../servicios/CalculadoraRiemann.js"
import { CalculadoraIntegralExacta } from "../servicios/CalculadoraIntegralExacta.js"
import { CalculadoraError } from "../servicios/CalculadoraError.js"
import { GestorLogros } from "../servicios/GestorLogros.js"
import { GestorAnimacion } from "../servicios/GestorAnimacion.js"
import { GestorMetricas } from "../servicios/GestorMetricas.js"
import { GestorTeoria } from "../servicios/GestorTeoria.js"
import { GeneradorEjemplos } from "../servicios/GeneradorEjemplos.js"
import { FuncionMatematica } from "../entidades/FuncionMatematica.js"
import { GestorPropiedadesMagicas } from "../servicios/GestorPropiedadesMagicas.js"

export class EscenarioJardinRiemann extends Escenario {
  constructor() {
    super(
      "Jardín Mágico de Riemann",
      "Aprende integrales definidas plantando macetas mágicas con el Hada Aria"
    )
    
    // Inicializar servicios
    this.estado = new EstadoVisualizacion()
    this.configuracion = new ConfiguracionCanvas(800, 500)
    this.calculadoraRiemann = new CalculadoraRiemann()
    this.calculadoraExacta = new CalculadoraIntegralExacta()
    this.calculadoraError = new CalculadoraError()
    this.gestorLogros = new GestorLogros()
    this.gestorAnimacion = new GestorAnimacion()
    this.gestorMetricas = new GestorMetricas()
    this.gestorTeoria = new GestorTeoria()
    this.generadorEjemplos = new GeneradorEjemplos()
    this.gestorPropiedadesMagicas = new GestorPropiedadesMagicas()
    
    // Funciones disponibles
    this.funciones = {
      parabola: new FuncionMatematica("cuadratica", { a: 0.5, b: 0, c: 1 }),
      seno: new FuncionMatematica("seno", { a: 2, b: 1, c: 0, d: 3 }),
      cubica: new FuncionMatematica("cubica", { a: 0.1, b: 0.5, c: 0, d: 2 }),
    }
    
    this.funcionActual = "parabola"
    this.resultados = {
      aproximacionRiemann: 0,
      integralExacta: 0,
      errorAbsoluto: 0,
      precision: 0
    }
  }

  inicializar() {
    this.estado.funcion = this.funciones[this.funcionActual]
    this.calcularYActualizar()
  }

  cambiarFuncion(tipoFuncion) {
    if (this.funciones[tipoFuncion]) {
      this.funcionActual = tipoFuncion
      this.estado.funcion = this.funciones[tipoFuncion]
      this.calcularYActualizar()
      this.onEstadoCambiado()
    }
  }

  actualizarMacetas(numeroMacetas) {
    if (this.estado) {
      this.estado.actualizarMacetas(numeroMacetas)
      this.calcularYActualizar()
      this.onEstadoCambiado()
    }
  }

  actualizarLimites(limiteIzquierdo, limiteDerecho) {
    if (this.estado) {
      this.estado.actualizarLimites(limiteIzquierdo, limiteDerecho)
      this.calcularYActualizar()
      this.onEstadoCambiado()
    }
  }

  cambiarTipoHechizo(tipo) {
    if (this.estado) {
      this.estado.cambiarTipoHechizo(tipo)
      this.calcularYActualizar()
      this.onEstadoCambiado()
    }
  }

  cambiarModoAprendizaje(modo) {
    if (this.estado) {
      this.estado.cambiarModoAprendizaje(modo)
      this.onEstadoCambiado()
    }
  }

  toggleAnimacion() {
    if (this.gestorAnimacion && this.gestorAnimacion.estaActiva()) {
      this.gestorAnimacion.detener()
      this.estado.toggleAnimacion()
    } else if (this.gestorAnimacion) {
      this.gestorAnimacion.iniciar(this.estado.numeroMacetas, 50, (macetas) => {
        this.estado.actualizarMacetas(macetas)
        this.calcularYActualizar()
        this.onEstadoCambiado()
      })
      this.estado.toggleAnimacion()
    }
    this.onEstadoCambiado()
  }

  actualizarVelocidadAnimacion(velocidad) {
    this.estado.actualizarVelocidad(velocidad)
    if (this.gestorAnimacion) {
      this.gestorAnimacion.cambiarVelocidad(velocidad)
    }
    this.onEstadoCambiado()
  }

  calcularYActualizar() {
    if (!this.estado.funcion) return

    const intervalo = this.estado.obtenerIntervalo()
    const tipoAproximacion = this.estado.tipoHechizo === "izquierdo" ? "izquierda" : 
                           this.estado.tipoHechizo === "derecho" ? "derecha" : "punto-medio"

    // Calcular valores usando las clases de servicio
    const aprox = this.calculadoraRiemann.calcularSumaRiemann(
      this.estado.funcion,
      intervalo,
      this.estado.numeroMacetas,
      tipoAproximacion,
    )
    const exacta = this.calculadoraExacta.calcular(this.estado.funcion, intervalo)
    const error = this.calculadoraError.calcularErrorAbsoluto(aprox, exacta)
    const prec = this.calculadoraError.calcularPrecision(aprox, exacta)

    this.resultados = {
      aproximacionRiemann: aprox,
      integralExacta: exacta,
      errorAbsoluto: error,
      precision: prec
    }

    // Actualizar métricas
    this.gestorMetricas.registrarIntento()
    this.gestorMetricas.calcularPrecision(aprox, exacta)

    // Verificar logros - obtener usuario actual y verificar logros
    try {
      const usuarioActual = this.gestorLogros.servicioAuth.obtenerUsuarioActual()
      if (usuarioActual && usuarioActual.esEstudiante()) {
        const logrosDesbloqueados = this.gestorLogros.verificarLogrosEstudiante(usuarioActual.id)
        if (logrosDesbloqueados.length > 0) {
          console.log('Logros desbloqueados:', logrosDesbloqueados)
        }
      }
    } catch (error) {
      console.error('Error verificando logros:', error)
    }
  }

  obtenerTeoria(tipo) {
    return this.gestorTeoria.obtenerTeoria(tipo)
  }

  obtenerEjemplo(tipo) {
    switch (tipo) {
      case 'riemann':
        return this.generadorEjemplos.generarEjemploRiemann()
      case 'aditividad':
        return this.generadorEjemplos.generarEjemploAditividad()
      case 'comparacion':
        return this.generadorEjemplos.generarEjemploComparacion()
      case 'inversionLimites':
        return this.generadorEjemplos.generarEjemploInversionLimites()
      case 'linealidad':
        return this.generadorEjemplos.generarEjemploLinealidad()
      default:
        return null
    }
  }

  obtenerLogros() {
    try {
      const usuarioActual = this.gestorLogros.servicioAuth.obtenerUsuarioActual()
      if (usuarioActual && usuarioActual.esEstudiante()) {
        return this.gestorLogros.obtenerLogrosEstudiante(usuarioActual.id)
      }
    } catch (error) {
      console.error('Error obteniendo logros:', error)
    }
    return []
  }

  obtenerMetricas() {
    return this.gestorMetricas.obtenerResumen()
  }

  reiniciar() {
    super.reiniciar()
    
    // Reinicializar completamente el escenario
    this.estado = new EstadoVisualizacion()
    this.gestorMetricas = new GestorMetricas()
    this.gestorLogros = new GestorLogros()
    this.gestorAnimacion = new GestorAnimacion()
    
    // Resetear función actual y resultados
    this.funcionActual = "parabola"
    this.estado.funcion = this.funciones[this.funcionActual]
    
    this.resultados = {
      aproximacionRiemann: 0,
      integralExacta: 0,
      errorAbsoluto: 0,
      precision: 0
    }
    
    // Recalcular con los valores por defecto
    this.calcularYActualizar()
    this.onEstadoCambiado()
  }

  obtenerDatos() {
    return {
      ...super.obtenerDatos(),
      funcionActual: this.funcionActual,
      resultados: this.resultados,
      logros: this.obtenerLogros(),
      metricas: this.obtenerMetricas(),
      funciones: Object.keys(this.funciones),
      propiedadesMagicas: this.gestorPropiedadesMagicas.obtenerPropiedadesDisponibles()
    }
  }

  // Métodos para propiedades mágicas
  obtenerPropiedadesMagicas() {
    return this.gestorPropiedadesMagicas.obtenerPropiedadesDisponibles()
  }

  activarPropiedadMagica(id) {
    return this.gestorPropiedadesMagicas.activarPropiedad(id)
  }

  obtenerEscenarioPropiedadActiva() {
    return this.gestorPropiedadesMagicas.obtenerEscenarioActivo()
  }

  desactivarPropiedadMagica() {
    this.gestorPropiedadesMagicas.desactivarPropiedad()
  }

  hayPropiedadMagicaActiva() {
    return this.gestorPropiedadesMagicas.hayPropiedadActiva()
  }
}
