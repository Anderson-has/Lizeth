/**
 * SERVICIO: CalculadoraRiemann
 * RESPONSABILIDAD: Realizar cálculos de sumas de Riemann e integrales
 */
export class CalculadoraRiemann {
  constructor() {
    this.precision = 0.001
    this.tipoAproximacion = "izquierda"
  }

  calcularSumaRiemann(funcion, intervalo, particiones, tipo = "izquierda") {
    const { inicio, fin } = intervalo
    const deltaX = (fin - inicio) / particiones
    let suma = 0

    for (let i = 0; i < particiones; i++) {
      let x
      switch (tipo) {
        case "izquierda":
          x = inicio + i * deltaX
          break
        case "derecha":
          x = inicio + (i + 1) * deltaX
          break
        case "punto-medio":
          x = inicio + (i + 0.5) * deltaX
          break
        default:
          x = inicio + i * deltaX
      }

      const altura = funcion.evaluar(x)
      suma += altura * deltaX
    }

    return suma
  }

  calcularIntegralExacta(funcion, intervalo) {
    // Usar método del trapecio con muchas particiones para aproximar
    const particiones = 10000
    return this.calcularSumaRiemann(funcion, intervalo, particiones, "punto-medio")
  }

  calcularError(aproximacion, valorExacto) {
    return Math.abs(aproximacion - valorExacto)
  }

  calcularErrorRelativo(aproximacion, valorExacto) {
    if (valorExacto === 0) return 0
    return Math.abs((aproximacion - valorExacto) / valorExacto) * 100
  }

  generarRectangulos(funcion, intervalo, particiones, tipo = "izquierda") {
    const { inicio, fin } = intervalo
    const deltaX = (fin - inicio) / particiones
    const rectangulos = []

    for (let i = 0; i < particiones; i++) {
      let x
      switch (tipo) {
        case "izquierda":
          x = inicio + i * deltaX
          break
        case "derecha":
          x = inicio + (i + 1) * deltaX
          break
        case "punto-medio":
          x = inicio + (i + 0.5) * deltaX
          break
        default:
          x = inicio + i * deltaX
      }

      const altura = funcion.evaluar(x)
      rectangulos.push({
        x: inicio + i * deltaX,
        altura,
        ancho: deltaX,
        area: altura * deltaX,
      })
    }

    return rectangulos
  }
}
