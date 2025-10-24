/**
 * ENTIDAD: TeoriaInversionLimites
 * RESPONSABILIDAD: Representar los datos de la teoría de inversión de límites
 * SRP: Solo almacena información teórica sobre inversión de límites, no realiza cálculos
 */
export class TeoriaInversionLimites {
  constructor() {
    this.titulo = "Propiedad de Inversión de Límites"
    this.definicion = "Invertir los límites de integración cambia el signo de la integral."
    this.formula = "∫[a,b] f(x) dx = -∫[b,a] f(x) dx"
    this.condiciones = [
      "f(x) es integrable en [a,b]",
      "a ≠ b (límites diferentes)",
      "La integral existe en ambos sentidos"
    ]
    this.interpretacionGeometrica = "El área bajo la curva de a a b es igual al negativo del área de b a a."
    this.aplicaciones = [
      "Cálculo de integrales definidas",
      "Demostración de propiedades",
      "Evaluación de integrales impropias"
    ]
    this.ejemplo = {
      funcion: "f(x) = x²",
      intervaloOriginal: { inicio: 0, fin: 2 },
      intervaloInvertido: { inicio: 2, fin: 0 },
      resultado: "∫[0,2] x² dx = -∫[2,0] x² dx"
    }
  }
}
