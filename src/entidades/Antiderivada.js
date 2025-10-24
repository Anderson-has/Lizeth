/**
 * Entidad: Antiderivada
 * Responsabilidad: Representar una antiderivada y su relación con la función original
 * SRP: Solo almacena datos de la antiderivada, no realiza cálculos
 */
export class Antiderivada {
  constructor(funcionOriginal, funcionAntiderivada, constante = 0) {
    this.funcionOriginal = funcionOriginal // f(x)
    this.funcionAntiderivada = funcionAntiderivada // F(x)
    this.constante = constante // C
    this.reglaUtilizada = null // nombre de la regla de integración
    this.pasos = [] // pasos de la integración
    this.esVerificada = false
  }

  setRegla(regla) {
    this.reglaUtilizada = regla
  }

  agregarPaso(descripcion, expresion) {
    this.pasos.push({ descripcion, expresion })
  }

  setVerificada(esVerificada) {
    this.esVerificada = esVerificada
  }

  setConstante(constante) {
    this.constante = constante
  }
}
