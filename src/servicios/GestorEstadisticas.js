/**
 * Servicio: GestorEstadisticas
 * Responsabilidad: Calcular y gestionar estadísticas globales del dashboard
 * Principio SRP: Solo maneja lógica de estadísticas, no presentación
 */

export class GestorEstadisticas {
  constructor() {
    this.escenarios = [
      {
        id: "jardin-riemann",
        titulo: "Jardín de Riemann",
        descripcion: "Aprende integrales de Riemann plantando macetas mágicas",
        nivel: "Básico",
        duracion: 15,
        temas: ["Sumas de Riemann", "Propiedades de integrales"],
        icono: "🌱",
        color: "bg-green-500",
      },
      {
        id: "puente-teorema",
        titulo: "Puente del teorema Fundamental",
        descripcion: "Descubre la conexión entre derivadas e integrales",
        nivel: "Intermedio",
        duracion: 22,
        temas: ["Teorema fundamental", "Derivadas e integrales"],
        icono: "🌉",
        color: "bg-blue-500",
      },
      {
        id: "torre-valor-medio",
        titulo: "Torre del valor medio",
        descripcion: "Encuentra el punto donde la función alcanza su valor promedio",
        nivel: "Intermedio",
        duracion: 18,
        temas: ["Valor medio", "Punto intermedio"],
        icono: "🏰",
        color: "bg-purple-500",
      },
      {
        id: "cristal-antiderivadas",
        titulo: "Cristal de Antiderivadas",
        descripcion: "Explora las familias de antiderivadas",
        nivel: "Avanzado",
        duracion: 12,
        temas: ["Antiderivadas", "Constante de integración"],
        icono: "💎",
        color: "bg-pink-500",
      },
    ]
  }

  obtenerEscenarios() {
    return this.escenarios
  }

  calcularEscenariosDisponibles() {
    return this.escenarios.length
  }

  calcularTemasCubiertos() {
    const temasUnicos = new Set()
    this.escenarios.forEach((escenario) => {
      escenario.temas.forEach((tema) => temasUnicos.add(tema))
    })
    return temasUnicos.size
  }

  calcularTiempoEstimado() {
    return this.escenarios.reduce((total, escenario) => total + escenario.duracion, 0)
  }

  obtenerEstadisticas() {
    return {
      escenariosDisponibles: this.calcularEscenariosDisponibles(),
      temasCubiertos: this.calcularTemasCubiertos(),
      tiempoEstimado: this.calcularTiempoEstimado(),
    }
  }
}
