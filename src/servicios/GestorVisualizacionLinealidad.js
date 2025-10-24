/**
 * GESTOR: GestorVisualizacionLinealidad
 * RESPONSABILIDAD: Coordinar la visualización de linealidad
 * SRP: Solo coordina servicios, no maneja lógica de negocio ni presentación
 */
export class GestorVisualizacionLinealidad {
  constructor() {
    this.estado = null
    this.configuracion = null
    this.calculadora = null
    this.verificador = null
    this.renderizadorGrafico = null
    this.renderizadorCalculos = null
    this.onEstadoCambiado = () => {}
  }

  // Inicializar el gestor
  inicializar(estado, configuracion, calculadora, verificador, renderizadorGrafico, renderizadorCalculos) {
    this.estado = estado
    this.configuracion = configuracion
    this.calculadora = calculadora
    this.verificador = verificador
    this.renderizadorGrafico = renderizadorGrafico
    this.renderizadorCalculos = renderizadorCalculos
  }

  // Actualizar función f(x)
  actualizarFFuncion(funcion) {
    if (!this.estado) return
    
    this.estado.actualizarFFuncion(funcion)
    this.recalcularYRenderizar()
  }

  // Actualizar función g(x)
  actualizarGFuncion(funcion) {
    if (!this.estado) return
    
    this.estado.actualizarGFuncion(funcion)
    this.recalcularYRenderizar()
  }

  // Actualizar coeficiente α
  actualizarAlpha(alpha) {
    if (!this.estado) return
    
    this.estado.actualizarAlpha(alpha)
    this.recalcularYRenderizar()
  }

  // Actualizar coeficiente β
  actualizarBeta(beta) {
    if (!this.estado) return
    
    this.estado.actualizarBeta(beta)
    this.recalcularYRenderizar()
  }

  // Actualizar límite A
  actualizarLimiteA(limiteA) {
    if (!this.estado) return
    
    this.estado.actualizarLimiteA(limiteA)
    this.recalcularYRenderizar()
  }

  // Actualizar límite B
  actualizarLimiteB(limiteB) {
    if (!this.estado) return
    
    this.estado.actualizarLimiteB(limiteB)
    this.recalcularYRenderizar()
  }

  // Recalcular y renderizar
  recalcularYRenderizar() {
    if (!this.estado || !this.calculadora || !this.verificador) return
    
    try {
      // Validar entrada
      const validacion = this.verificarEntrada()
      if (!validacion.esValida) {
        this.mostrarError(validacion.mensaje)
        return
      }
      
      // Calcular
      const calculos = this.calcularTodos()
      
      // Actualizar estado
      this.estado.actualizarCalculos(calculos)
      
      // Renderizar
      this.renderizar()
      
      // Notificar cambio
      this.onEstadoCambiado()
      
    } catch (error) {
      this.mostrarError(`Error en cálculo: ${error.message}`)
    }
  }

  // Verificar entrada
  verificarEntrada() {
    if (!this.estado || !this.verificador) {
      return { esValida: false, mensaje: "Estado o verificador no inicializado" }
    }
    
    const funcionesDisponibles = this.calculadora.obtenerFuncionesDisponibles()
    const verificacion = this.verificador.verificarCompleta(
      this.estado.fFuncion,
      this.estado.gFuncion,
      this.estado.alpha,
      this.estado.beta,
      this.estado.limiteA,
      this.estado.limiteB,
      funcionesDisponibles
    )
    
    return {
      esValida: verificacion.esCompletaValida,
      mensaje: verificacion.esCompletaValida ? "Entrada válida" : this.verificador.obtenerMensajeError(verificacion.verificaciones)
    }
  }

  // Calcular todos los valores
  calcularTodos() {
    if (!this.calculadora) {
      throw new Error("Calculadora no inicializada")
    }
    
    return this.calculadora.calcularTodos(
      this.estado.fFuncion,
      this.estado.gFuncion,
      this.estado.alpha,
      this.estado.beta,
      this.estado.limiteA,
      this.estado.limiteB,
      this.configuracion.precision.tolerancia
    )
  }

  // Renderizar
  renderizar() {
    if (!this.renderizadorGrafico || !this.renderizadorCalculos) return
    
    // Obtener cálculos actualizados
    const calculos = this.obtenerCalculos()
    
    // Renderizar gráfico con actualización automática
    if (this.renderizadorGrafico.actualizarGrafica) {
      this.renderizadorGrafico.actualizarGrafica(this.estado, calculos)
    } else {
      this.renderizadorGrafico.renderizar(this.estado, calculos)
    }
    
    // Renderizar cálculos
    this.renderizadorCalculos.renderizar(this.estado, calculos)
  }

  // Mostrar error
  mostrarError(mensaje) {
    if (this.renderizadorCalculos) {
      this.renderizadorCalculos.renderizarError(mensaje)
    }
  }

  // Mostrar estado de carga
  mostrarCargando() {
    if (this.renderizadorCalculos) {
      this.renderizadorCalculos.renderizarCargando()
    }
  }

  // Obtener estado actual
  obtenerEstado() {
    return this.estado
  }

  // Obtener configuración
  obtenerConfiguracion() {
    return this.configuracion
  }

  // Obtener cálculos
  obtenerCalculos() {
    return this.estado ? this.estado.calculos : null
  }

  // Obtener validación
  obtenerValidacion() {
    return this.estado ? this.estado.validacion : null
  }

  // Reiniciar
  reiniciar() {
    if (this.estado) {
      this.estado.reiniciar()
      this.recalcularYRenderizar()
    }
  }

  // Obtener casos especiales
  obtenerCasosEspeciales() {
    if (!this.verificador) return []
    
    return this.verificador.verificarCasosEspeciales(this.estado.alpha, this.estado.beta)
  }

  // Obtener funciones disponibles
  obtenerFuncionesDisponibles() {
    return this.calculadora ? this.calculadora.obtenerFuncionesDisponibles() : []
  }

  // Obtener configuración de sliders
  obtenerConfiguracionSliders() {
    return this.configuracion ? this.configuracion.obtenerConfiguracionSliders() : null
  }

  // Obtener colores
  obtenerColores() {
    return this.configuracion ? this.configuracion.obtenerColores() : null
  }
}
