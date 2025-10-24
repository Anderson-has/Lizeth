/**
 * GESTOR: GestorPropiedadesMagicas
 * RESPONSABILIDAD: Gestionar el acceso a las propiedades mágicas
 * SRP: Solo maneja la navegación entre propiedades, no lógica de negocio
 */
import { EscenarioFactory } from "../escenarios/EscenarioFactory.js"

export class GestorPropiedadesMagicas {
  constructor() {
    this.propiedades = this.inicializarPropiedades()
    this.propiedadActiva = null
    this.escenarioActivo = null
    this.escenarioFactory = new EscenarioFactory()
  }

  inicializarPropiedades() {
    return {
      linealidad: {
        id: "linealidad",
        nombre: "Linealidad",
        descripcion: "La integral de una combinación lineal es igual a la combinación lineal de las integrales",
        formula: "∫[a,b] (αf(x) + βg(x)) dx = α∫[a,b] f(x) dx + β∫[a,b] g(x) dx",
        icono: "📊",
        color: "blue",
        disponible: true
      },
      aditividad: {
        id: "aditividad",
        nombre: "Aditividad",
        descripcion: "La integral sobre un intervalo puede dividirse en la suma de integrales sobre subintervalos",
        formula: "∫[a,c] f(x) dx = ∫[a,b] f(x) dx + ∫[b,c] f(x) dx",
        icono: "🏔️",
        color: "green",
        disponible: true
      },
      inversionLimites: {
        id: "inversion-limites",
        nombre: "Inversión de Límites",
        descripcion: "Invertir los límites de integración cambia el signo de la integral",
        formula: "∫[a,b] f(x) dx = -∫[b,a] f(x) dx",
        icono: "🔄",
        color: "orange",
        disponible: false
      },
      comparacion: {
        id: "comparacion",
        nombre: "Propiedad de Comparación",
        descripcion: "Si una función es menor o igual que otra, su integral también es menor o igual",
        formula: "Si f(x) ≤ g(x) en [a,b] → ∫[a,b] f(x) dx ≤ ∫[a,b] g(x) dx",
        icono: "📈",
        color: "purple",
        disponible: false
      }
    }
  }

  // Obtener todas las propiedades
  obtenerPropiedades() {
    return Object.values(this.propiedades)
  }

  // Obtener propiedades disponibles
  obtenerPropiedadesDisponibles() {
    return Object.values(this.propiedades).filter(prop => prop.disponible)
  }

  // Obtener propiedad por ID
  obtenerPropiedad(id) {
    return this.propiedades[id] || null
  }

  // Activar propiedad
  activarPropiedad(id) {
    const propiedad = this.obtenerPropiedad(id)
    if (!propiedad || !propiedad.disponible) {
      throw new Error(`Propiedad ${id} no disponible`)
    }

    // Desactivar propiedad actual si existe
    if (this.propiedadActiva) {
      this.desactivarPropiedad()
    }

    // Crear escenario específico
    this.escenarioActivo = this.crearEscenarioPropiedad(id)
    this.propiedadActiva = propiedad

    return this.escenarioActivo
  }

  // Crear escenario de propiedad usando Factory
  crearEscenarioPropiedad(id) {
    switch (id) {
      case "linealidad":
        return this.escenarioFactory.crearEscenario('propiedades-linealidad')
      case "aditividad":
        return this.escenarioFactory.crearEscenario('propiedades-aditividad')
      case "inversion-limites":
        return this.escenarioFactory.crearEscenario('inversion-limites')
      case "comparacion":
        return this.escenarioFactory.crearEscenario('comparacion')
      default:
        throw new Error(`Escenario de propiedad ${id} no encontrado`)
    }
  }

  // Desactivar propiedad actual
  desactivarPropiedad() {
    if (this.escenarioActivo) {
      // Limpiar recursos si es necesario
      this.escenarioActivo = null
    }
    this.propiedadActiva = null
  }

  // Obtener escenario activo
  obtenerEscenarioActivo() {
    return this.escenarioActivo
  }

  // Obtener propiedad activa
  obtenerPropiedadActiva() {
    return this.propiedadActiva
  }

  // Verificar si hay propiedad activa
  hayPropiedadActiva() {
    return this.propiedadActiva !== null
  }

  // Obtener estadísticas
  obtenerEstadisticas() {
    const total = Object.keys(this.propiedades).length
    const disponibles = this.obtenerPropiedadesDisponibles().length
    const activas = this.hayPropiedadActiva() ? 1 : 0

    return {
      total,
      disponibles,
      activas,
      porcentajeDisponibles: (disponibles / total) * 100
    }
  }

  // Habilitar propiedad (para futuras implementaciones)
  habilitarPropiedad(id) {
    const propiedad = this.propiedades[id]
    if (propiedad) {
      propiedad.disponible = true
    }
  }

  // Deshabilitar propiedad
  deshabilitarPropiedad(id) {
    const propiedad = this.propiedades[id]
    if (propiedad) {
      propiedad.disponible = false
    }
  }

  // Reiniciar gestor
  reiniciar() {
    this.desactivarPropiedad()
    this.propiedades = this.inicializarPropiedades()
  }
}
