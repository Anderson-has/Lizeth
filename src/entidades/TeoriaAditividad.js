/**
 * ENTIDAD: TeoriaAditividad
 * RESPONSABILIDAD: Representar los datos de la teoría de aditividad de integrales
 * SRP: Solo almacena información teórica sobre aditividad, no realiza cálculos
 */
export class TeoriaAditividad {
  constructor() {
    this.titulo = "Propiedad de Aditividad"
    this.definicion = "La integral sobre un intervalo puede dividirse en la suma de integrales sobre subintervalos."
    this.formula = "∫[a,c] f(x) dx = ∫[a,b] f(x) dx + ∫[b,c] f(x) dx"
    this.condiciones = [
      "a < b < c (orden de los puntos)",
      "f(x) es integrable en [a,c]",
      "f(x) es integrable en [a,b] y [b,c]"
    ]
    this.interpretacionGeometrica = "El área total bajo la curva desde a hasta c es igual a la suma de las áreas desde a hasta b y desde b hasta c."
    this.aplicaciones = [
      "Cálculo de integrales por partes",
      "Evaluación de integrales definidas",
      "Demostración de propiedades de integrales"
    ]
    this.ejemplo = {
      funcion: "f(x) = x²",
      intervalo: { inicio: 0, fin: 3 },
      puntoIntermedio: 1,
      resultado: "∫[0,3] x² dx = ∫[0,1] x² dx + ∫[1,3] x² dx"
    }
  }
}
