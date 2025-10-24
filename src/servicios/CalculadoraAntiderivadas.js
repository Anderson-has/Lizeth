/**
 * Servicio: CalculadoraAntiderivadas
 * Responsabilidad: Calcular antiderivadas y verificar su corrección
 * SRP: Solo se encarga de los cálculos de antiderivadas, no de la presentación
 */
export class CalculadoraAntiderivadas {
  constructor() {
    this.reglas = this.inicializarReglas()
  }

  /**
   * Inicializar las reglas de integración básicas
   */
  inicializarReglas() {
    return [
      {
        nombre: "Regla de la Potencia",
        patron: /x\^(\d+)/,
        aplicar: (n) => ({
          expresion: `x^${n + 1}/${n + 1}`,
          evaluar: (x) => Math.pow(x, n + 1) / (n + 1),
          derivada: (x) => Math.pow(x, n),
        }),
      },
      {
        nombre: "Regla Exponencial",
        patron: /e\^x/,
        aplicar: () => ({
          expresion: "e^x",
          evaluar: (x) => Math.exp(x),
          derivada: (x) => Math.exp(x),
        }),
      },
      {
        nombre: "Regla Trigonométrica (sin)",
        patron: /sin$$x$$/,
        aplicar: () => ({
          expresion: "-cos(x)",
          evaluar: (x) => -Math.cos(x),
          derivada: (x) => Math.sin(x),
        }),
      },
      {
        nombre: "Regla Trigonométrica (cos)",
        patron: /cos$$x$$/,
        aplicar: () => ({
          expresion: "sin(x)",
          evaluar: (x) => Math.sin(x),
          derivada: (x) => Math.cos(x),
        }),
      },
      {
        nombre: "Regla Logarítmica",
        patron: /1\/x/,
        aplicar: () => ({
          expresion: "ln|x|",
          evaluar: (x) => Math.log(Math.abs(x)),
          derivada: (x) => 1 / x,
        }),
      },
    ]
  }

  /**
   * Calcular antiderivada de una función
   */
  calcularAntiderivada(antiderivada) {
    const { funcionOriginal } = antiderivada
    const expresion = funcionOriginal.expresion

    // Buscar regla aplicable
    for (const regla of this.reglas) {
      const match = expresion.match(regla.patron)
      if (match) {
        antiderivada.setRegla(regla.nombre)

        // Aplicar la regla
        let resultado
        if (regla.nombre === "Regla de la Potencia") {
          const n = Number.parseInt(match[1])
          resultado = regla.aplicar(n)
          antiderivada.agregarPaso(`Aplicar regla de la potencia: ∫x^n dx = x^(n+1)/(n+1) + C`, resultado.expresion)
        } else {
          resultado = regla.aplicar()
          antiderivada.agregarPaso(`Aplicar ${regla.nombre}`, resultado.expresion)
        }

        return resultado
      }
    }

    // Si no se encuentra regla, intentar integración numérica
    return this.integracionNumerica(funcionOriginal)
  }

  /**
   * Verificar que la antiderivada es correcta derivándola
   */
  verificarAntiderivada(antiderivada, funcionAntiderivadaCalculada) {
    const { funcionOriginal } = antiderivada

    // Verificar en varios puntos
    const puntosPrueba = [-2, -1, 0, 1, 2, 3]
    const errores = []

    for (const x of puntosPrueba) {
      if (x === 0 && funcionOriginal.expresion.includes("1/x")) {
        continue // Evitar división por cero
      }

      // Calcular f(x)
      const fx = funcionOriginal.evaluar(x)

      // Calcular F'(x) usando diferencias finitas
      const h = 0.0001
      const Fx = funcionAntiderivadaCalculada.evaluar(x)
      const FxPlusH = funcionAntiderivadaCalculada.evaluar(x + h)
      const derivada = (FxPlusH - Fx) / h

      const error = Math.abs(fx - derivada)
      errores.push(error)
    }

    // Calcular error promedio
    const errorPromedio = errores.reduce((a, b) => a + b, 0) / errores.length
    const esVerificada = errorPromedio < 0.01

    antiderivada.setVerificada(esVerificada)

    return {
      esVerificada,
      errorPromedio,
      errores,
    }
  }

  /**
   * Integración numérica para funciones complejas
   */
  integracionNumerica(funcion) {
    return {
      expresion: "Antiderivada numérica",
      evaluar: (x) => {
        // Integrar desde 0 hasta x
        const n = 100
        const h = x / n
        let suma = 0

        for (let i = 0; i <= n; i++) {
          const t = i * h
          const peso = i === 0 || i === n ? 0.5 : 1
          suma += peso * funcion.evaluar(t)
        }

        return suma * h
      },
      derivada: (x) => funcion.evaluar(x),
    }
  }

  /**
   * Calcular integral definida usando la antiderivada
   */
  calcularIntegralDefinida(antiderivada, a, b, funcionAntiderivadaCalculada) {
    const Fb = funcionAntiderivadaCalculada.evaluar(b)
    const Fa = funcionAntiderivadaCalculada.evaluar(a)
    return Fb - Fa
  }
}
