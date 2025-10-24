/**
 * ENTIDAD: EstadoLinealidad
 * RESPONSABILIDAD: Almacenar el estado de la visualización de linealidad
 * SRP: Solo maneja datos de estado, no lógica de negocio ni presentación
 */
export class EstadoLinealidad {
  constructor() {
    // Funciones seleccionadas
    this.fFuncion = "x"
    this.gFuncion = "x²"
    
    // Coeficientes de la combinación lineal
    this.alpha = 2
    this.beta = 1
    
    // Límites de integración
    this.limiteA = 0
    this.limiteB = 2
    
    // Resultados de cálculos
    this.calculos = {
      integralF: 0,
      integralG: 0,
      integralCombinada: 0,
      verificacion: false,
      tolerancia: 0.001
    }
    
    // Estado de validación
    this.validacion = {
      esValida: true,
      mensaje: ""
    }
  }

  // Getters
  obtenerFFuncion() {
    return this.fFuncion
  }

  obtenerGFuncion() {
    return this.gFuncion
  }

  obtenerAlpha() {
    return this.alpha
  }

  obtenerBeta() {
    return this.beta
  }

  obtenerLimiteA() {
    return this.limiteA
  }

  obtenerLimiteB() {
    return this.limiteB
  }

  obtenerCalculos() {
    return this.calculos
  }

  obtenerValidacion() {
    return this.validacion
  }

  // Setters
  actualizarFFuncion(funcion) {
    this.fFuncion = funcion
  }

  actualizarGFuncion(funcion) {
    this.gFuncion = funcion
  }

  actualizarAlpha(alpha) {
    this.alpha = Math.max(-5, Math.min(5, alpha))
  }

  actualizarBeta(beta) {
    this.beta = Math.max(-5, Math.min(5, beta))
  }

  actualizarLimiteA(limiteA) {
    this.limiteA = limiteA
  }

  actualizarLimiteB(limiteB) {
    this.limiteB = limiteB
  }

  actualizarCalculos(calculos) {
    this.calculos = { ...this.calculos, ...calculos }
  }

  actualizarValidacion(validacion) {
    this.validacion = { ...this.validacion, ...validacion }
  }

  // Validaciones
  sonLimitesValidos() {
    return this.limiteA < this.limiteB
  }

  esAlphaValido() {
    return this.alpha >= -5 && this.alpha <= 5
  }

  esBetaValido() {
    return this.beta >= -5 && this.beta <= 5
  }

  // Reset
  reiniciar() {
    this.fFuncion = "x"
    this.gFuncion = "x²"
    this.alpha = 2
    this.beta = 1
    this.limiteA = 0
    this.limiteB = 2
    this.calculos = {
      integralF: 0,
      integralG: 0,
      integralCombinada: 0,
      verificacion: false,
      tolerancia: 0.001
    }
    this.validacion = {
      esValida: true,
      mensaje: ""
    }
  }
}
