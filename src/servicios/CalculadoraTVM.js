/**
 * Servicio: CalculadoraTVM (Teorema del Valor Medio)
 * Responsabilidad: Realizar cálculos relacionados con el TVM para integrales
 * SRP: Solo se encarga de los cálculos del teorema, no de la presentación
 */
export class CalculadoraTVM {
  constructor() {
    this.precision = 1000
    this.tolerancia = 0.001
  }

  /**
   * Calcular el valor promedio de la función: f_avg = (1/(b-a)) * ∫[a,b] f(x)dx
   */
  calcularValorPromedio(teorema) {
    const { funcion, a, b } = teorema

    // Calcular la integral
    const integral = this.integralNumerica(funcion, a, b)

    // Calcular el valor promedio
    const valorPromedio = integral / (b - a)

    return { integral, valorPromedio }
  }

  /**
   * Buscar el punto c donde f(c) = f_avg
   * Teorema: Existe al menos un c en [a,b] tal que f(c) = f_avg
   */
  buscarPuntoC(teorema, valorPromedio) {
    const { funcion, a, b } = teorema

    // Método de búsqueda: dividir el intervalo y buscar donde f(x) ≈ f_avg
    const n = 1000
    const h = (b - a) / n
    let mejorC = null
    let menorDiferencia = Number.POSITIVE_INFINITY

    for (let i = 0; i <= n; i++) {
      const x = a + i * h
      const fx = funcion.evaluar(x)
      const diferencia = Math.abs(fx - valorPromedio)

      if (diferencia < menorDiferencia) {
        menorDiferencia = diferencia
        mejorC = x
      }

      // Si encontramos un punto muy cercano, podemos parar
      if (diferencia < this.tolerancia) {
        break
      }
    }

    const valorEnC = funcion.evaluar(mejorC)

    return {
      puntoC: mejorC,
      valorEnC,
      diferencia: Math.abs(valorEnC - valorPromedio),
    }
  }

  /**
   * Verificar el teorema completo
   */
  verificarTeorema(teorema) {
    teorema.incrementarIntentos()

    // Calcular valor promedio
    const { integral, valorPromedio } = this.calcularValorPromedio(teorema)

    // Buscar punto c
    const { puntoC, valorEnC, diferencia } = this.buscarPuntoC(teorema, valorPromedio)

    // Actualizar el teorema
    teorema.setResultados(valorPromedio, puntoC, valorEnC, integral)

    return {
      integral,
      valorPromedio,
      puntoC,
      valorEnC,
      diferencia,
      esValido: teorema.esValido,
      intentos: teorema.intentosBusqueda,
    }
  }

  /**
   * Integración numérica usando regla del trapecio
   */
  integralNumerica(funcion, a, b) {
    const n = this.precision
    const h = (b - a) / n
    let suma = 0

    for (let i = 0; i <= n; i++) {
      const x = a + i * h
      const peso = i === 0 || i === n ? 0.5 : 1
      suma += peso * funcion.evaluar(x)
    }

    return suma * h
  }

  /**
   * Calcular múltiples puntos c para visualización
   */
  calcularPuntosCercanos(teorema, valorPromedio, rango = 0.1) {
    const { funcion, a, b } = teorema
    const puntos = []
    const n = 100
    const h = (b - a) / n

    for (let i = 0; i <= n; i++) {
      const x = a + i * h
      const fx = funcion.evaluar(x)
      const diferencia = Math.abs(fx - valorPromedio)

      if (diferencia < rango) {
        puntos.push({ x, fx, diferencia })
      }
    }

    return puntos
  }
}
