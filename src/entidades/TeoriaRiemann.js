/**
 * ENTIDAD: TeoriaRiemann
 * RESPONSABILIDAD: Representar los datos de la teoría de sumas de Riemann
 * SRP: Solo almacena información teórica, no realiza cálculos ni presentación
 */
export class TeoriaRiemann {
  constructor() {
    this.titulo = "Sumas de Riemann"
    this.definicion = "Las sumas de Riemann son aproximaciones del área bajo una curva dividiendo el intervalo en subintervalos y sumando las áreas de rectángulos."
    this.formula = "S_n = Σ[i=1 to n] f(x_i) * Δx"
    this.simbolos = {
      "S_n": "Suma de Riemann con n particiones",
      "f(x_i)": "Valor de la función en el punto x_i",
      "Δx": "Ancho de cada subintervalo",
      "n": "Número de particiones"
    }
    this.tiposAproximacion = {
      "izquierda": "Usa el punto izquierdo de cada subintervalo",
      "derecha": "Usa el punto derecho de cada subintervalo", 
      "punto-medio": "Usa el punto medio de cada subintervalo"
    }
    this.ventajas = [
      "Aproximación visual intuitiva del área",
      "Base para la definición de integral definida",
      "Permite entender el concepto de límite"
    ]
    this.limitaciones = [
      "Solo es una aproximación",
      "Precisión depende del número de particiones",
      "No siempre converge al valor exacto"
    ]
  }
}
