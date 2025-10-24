/**
 * ENTIDAD: TeoriaComparacion
 * RESPONSABILIDAD: Representar los datos de la teoría de comparación de integrales
 * SRP: Solo almacena información teórica sobre comparación, no realiza cálculos
 */
export class TeoriaComparacion {
  constructor() {
    this.titulo = "Propiedad de Comparación"
    this.definicion = "Si una función es menor o igual que otra en un intervalo, su integral también es menor o igual."
    this.formula = "Si f(x) ≤ g(x) en [a,b] ⇒ ∫[a,b] f(x) dx ≤ ∫[a,b] g(x) dx"
    this.condiciones = [
      "f(x) ≤ g(x) para todo x en [a,b]",
      "f(x) y g(x) son integrables en [a,b]",
      "a ≤ b (intervalo válido)"
    ]
    this.interpretacionGeometrica = "Si una curva está siempre por debajo de otra, el área bajo la primera curva es menor o igual al área bajo la segunda."
    this.aplicaciones = [
      "Estimación de integrales",
      "Demostración de desigualdades",
      "Análisis de convergencia"
    ]
    this.ejemplo = {
      funcion1: "f(x) = x",
      funcion2: "g(x) = x²",
      intervalo: { inicio: 1, fin: 2 },
      resultado: "Como x ≤ x² en [1,2], entonces ∫[1,2] x dx ≤ ∫[1,2] x² dx"
    }
  }
}
