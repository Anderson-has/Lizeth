/**
 * Entidad: TeoremaValorMedio
 * Responsabilidad: Representar el estado del Teorema del Valor Medio para Integrales
 * SRP: Solo almacena datos del teorema, no realiza cálculos
 */
export class TeoremaValorMedio {
  constructor(funcion, a, b) {
    this.funcion = funcion // FuncionMatematica
    this.a = a // límite inferior
    this.b = b // límite superior
    this.valorPromedio = null // f_avg
    this.puntoC = null // punto c donde f(c) = f_avg
    this.valorEnC = null // f(c)
    this.integral = null // valor de la integral
    this.esValido = false
    this.intentosBusqueda = 0
  }

  setResultados(valorPromedio, puntoC, valorEnC, integral) {
    this.valorPromedio = valorPromedio
    this.puntoC = puntoC
    this.valorEnC = valorEnC
    this.integral = integral
    this.esValido = Math.abs(valorEnC - valorPromedio) < 0.001
  }

  incrementarIntentos() {
    this.intentosBusqueda++
  }
}
