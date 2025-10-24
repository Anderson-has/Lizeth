/**
 * ENTIDAD: TeoriaLinealidad
 * RESPONSABILIDAD: Representar los datos de la teoría de linealidad de integrales
 * SRP: Solo almacena información teórica sobre linealidad, no realiza cálculos
 */
export class TeoriaLinealidad {
  constructor() {
    this.titulo = "Propiedad de Linealidad"
    this.definicion = "La integral de una combinación lineal es igual a la combinación lineal de las integrales."
    this.formula = "∫[a,b] [αf(x) + βg(x)] dx = α∫[a,b] f(x) dx + β∫[a,b] g(x) dx"
    this.condiciones = [
      "α y β son constantes",
      "f(x) y g(x) son integrables en [a,b]",
      "La combinación lineal es integrable"
    ]
    this.interpretacionGeometrica = "El área bajo la suma ponderada de funciones es igual a la suma ponderada de las áreas individuales."
    this.aplicaciones = [
      "Descomposición de integrales complejas",
      "Cálculo de integrales por partes",
      "Demostración de teoremas"
    ]
    this.ejemplo = {
      funcion1: "f(x) = x²",
      funcion2: "g(x) = x",
      constante1: 2,
      constante2: 3,
      intervalo: { inicio: 0, fin: 1 },
      resultado: "∫[0,1] [2x² + 3x] dx = 2∫[0,1] x² dx + 3∫[0,1] x dx"
    }
  }
}
