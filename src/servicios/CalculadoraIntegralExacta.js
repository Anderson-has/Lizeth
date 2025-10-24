/**
 * SERVICIO: CalculadoraIntegralExacta
 * RESPONSABILIDAD: Calcular integrales exactas usando antiderivadas
 */
export class CalculadoraIntegralExacta {
  constructor() {
    this.precision = 0.0001
  }

  calcular(funcion, intervalo) {
    const antiderivada = this.obtenerAntiderivada(funcion)
    if (!antiderivada) {
      // Si no hay antiderivada analítica, usar método numérico de alta precisión
      return this.calcularNumericamente(funcion, intervalo)
    }

    const valorSuperior = antiderivada.evaluar(intervalo.fin)
    const valorInferior = antiderivada.evaluar(intervalo.inicio)
    return valorSuperior - valorInferior
  }

  obtenerAntiderivada(funcion) {
    switch (funcion.tipo) {
      case "cuadratica": {
        const { a, b, c } = funcion.parametros
        return {
          evaluar: (x) => (a / 3) * x ** 3 + (b / 2) * x ** 2 + c * x,
        }
      }
      case "lineal": {
        const { m, b } = funcion.parametros
        return {
          evaluar: (x) => (m / 2) * x ** 2 + b * x,
        }
      }
      case "seno": {
        const { a, b, c, d } = funcion.parametros
        return {
          evaluar: (x) => (-a / b) * Math.cos(b * x + c) + d * x,
        }
      }
      case "cubica": {
        const { a, b, c, d } = funcion.parametros
        return {
          evaluar: (x) => (a / 4) * x ** 4 + (b / 3) * x ** 3 + (c / 2) * x ** 2 + d * x,
        }
      }
      default:
        return null
    }
  }

  calcularNumericamente(funcion, intervalo) {
    // Método de Simpson con alta precisión
    const n = 10000
    const h = (intervalo.fin - intervalo.inicio) / n
    let suma = funcion.evaluar(intervalo.inicio) + funcion.evaluar(intervalo.fin)

    for (let i = 1; i < n; i++) {
      const x = intervalo.inicio + i * h
      const multiplicador = i % 2 === 0 ? 2 : 4
      suma += multiplicador * funcion.evaluar(x)
    }

    return (h / 3) * suma
  }
}
