/**
 * SERVICIO: VerificadorLinealidad
 * RESPONSABILIDAD: Verificar y validar la propiedad de linealidad
 * SRP: Solo maneja validaciones matemáticas, no cálculos ni presentación
 */
export class VerificadorLinealidad {
  constructor() {
    this.toleranciaPorDefecto = 0.001
  }

  // Verificar si los límites son válidos
  verificarLimites(limiteA, limiteB) {
    return {
      esValido: limiteA < limiteB,
      mensaje: limiteA < limiteB ? "Límites válidos" : "El límite inferior debe ser menor al superior"
    }
  }

  // Verificar si los coeficientes están en rango válido
  verificarCoeficientes(alpha, beta) {
    const alphaValido = alpha >= -5 && alpha <= 5
    const betaValido = beta >= -5 && beta <= 5
    
    return {
      esValido: alphaValido && betaValido,
      alphaValido,
      betaValido,
      mensaje: alphaValido && betaValido ? "Coeficientes válidos" : "Los coeficientes deben estar entre -5 y 5"
    }
  }

  // Verificar si las funciones son válidas
  verificarFunciones(fFuncion, gFuncion, funcionesDisponibles) {
    const fValida = funcionesDisponibles.includes(fFuncion)
    const gValida = funcionesDisponibles.includes(gFuncion)
    
    return {
      esValido: fValida && gValida,
      fValida,
      gValida,
      mensaje: fValida && gValida ? "Funciones válidas" : "Una o ambas funciones no son válidas"
    }
  }

  // Verificar la propiedad de linealidad matemáticamente
  verificarPropiedadMatematica(ladoIzquierdo, ladoDerecho, tolerancia = null) {
    const tol = tolerancia || this.toleranciaPorDefecto
    const diferencia = Math.abs(ladoIzquierdo - ladoDerecho)
    const esValida = diferencia < tol
    
    return {
      esValida,
      diferencia,
      tolerancia: tol,
      mensaje: esValida 
        ? `La propiedad se cumple (diferencia: ${diferencia.toFixed(6)})`
        : `La propiedad NO se cumple (diferencia: ${diferencia.toFixed(6)})`
    }
  }

  // Verificar casos especiales
  verificarCasosEspeciales(alpha, beta) {
    const casos = []
    
    if (alpha === 0 && beta !== 0) {
      casos.push({
        tipo: "solo_g",
        descripcion: "Solo se muestra g(x) (α = 0)",
        alpha,
        beta
      })
    }
    
    if (beta === 0 && alpha !== 0) {
      casos.push({
        tipo: "solo_f",
        descripcion: "Solo se muestra f(x) (β = 0)",
        alpha,
        beta
      })
    }
    
    if (alpha === 1 && beta === 1) {
      casos.push({
        tipo: "suma_simple",
        descripcion: "Suma simple f(x) + g(x)",
        alpha,
        beta
      })
    }
    
    if (alpha === -1 && beta === 1) {
      casos.push({
        tipo: "diferencia",
        descripcion: "Diferencia g(x) - f(x)",
        alpha,
        beta
      })
    }
    
    if (alpha < 0 || beta < 0) {
      casos.push({
        tipo: "coeficientes_negativos",
        descripcion: "Coeficientes negativos detectados",
        alpha,
        beta
      })
    }
    
    return casos
  }

  // Verificación completa
  verificarCompleta(fFuncion, gFuncion, alpha, beta, limiteA, limiteB, funcionesDisponibles, tolerancia = null) {
    const verificaciones = {
      limites: this.verificarLimites(limiteA, limiteB),
      coeficientes: this.verificarCoeficientes(alpha, beta),
      funciones: this.verificarFunciones(fFuncion, gFuncion, funcionesDisponibles)
    }
    
    const esCompletaValida = verificaciones.limites.esValido && 
                           verificaciones.coeficientes.esValido && 
                           verificaciones.funciones.esValido
    
    return {
      esCompletaValida,
      verificaciones,
      casosEspeciales: this.verificarCasosEspeciales(alpha, beta)
    }
  }

  // Obtener mensaje de error consolidado
  obtenerMensajeError(verificaciones) {
    const errores = []
    
    if (!verificaciones.limites.esValido) {
      errores.push(verificaciones.limites.mensaje)
    }
    
    if (!verificaciones.coeficientes.esValido) {
      errores.push(verificaciones.coeficientes.mensaje)
    }
    
    if (!verificaciones.funciones.esValido) {
      errores.push(verificaciones.funciones.mensaje)
    }
    
    return errores.length > 0 ? errores.join("; ") : "Todas las validaciones pasaron"
  }
}
