/**
 * SERVICIO: CalculadoraError
 * RESPONSABILIDAD: Calcular diferentes tipos de errores
 */
export class CalculadoraError {
  calcularErrorAbsoluto(aproximacion, valorExacto) {
    return Math.abs(aproximacion - valorExacto)
  }

  calcularErrorRelativo(aproximacion, valorExacto) {
    if (Math.abs(valorExacto) < 1e-10) return 0
    return Math.abs((aproximacion - valorExacto) / valorExacto)
  }

  calcularErrorPorcentual(aproximacion, valorExacto) {
    return this.calcularErrorRelativo(aproximacion, valorExacto) * 100
  }

  calcularPrecision(aproximacion, valorExacto) {
    const errorRelativo = this.calcularErrorRelativo(aproximacion, valorExacto)
    return Math.max(0, (1 - errorRelativo) * 100)
  }

  clasificarError(errorAbsoluto) {
    if (errorAbsoluto < 0.01) return "excelente"
    if (errorAbsoluto < 0.1) return "bueno"
    if (errorAbsoluto < 0.5) return "aceptable"
    return "mejorable"
  }
}
