/**
 * ENTIDAD: Estudiante
 * RESPONSABILIDAD: Extender Usuario con funcionalidades específicas de estudiantes
 * SRP: Solo maneja datos y comportamiento específico de estudiantes
 */
import { Usuario } from './Usuario.js'

export class Estudiante extends Usuario {
  constructor(datos) {
    super(datos)
    this.semestre = datos.semestre
    this.progreso = datos.progreso || {
      escenariosCompletados: [],
      tiempoTotal: 0,
      logros: [],
      ultimaActividad: null
    }
    this.escenariosHabilitados = datos.escenariosHabilitados || []
    this.historialActividad = datos.historialActividad || []
  }

  agregarActividad(escenario, tiempo, accion) {
    const actividad = {
      id: Date.now(),
      escenario,
      tiempo,
      accion,
      fecha: new Date(),
      timestamp: Date.now()
    }
    
    this.historialActividad.push(actividad)
    this.progreso.ultimaActividad = new Date()
    this.progreso.tiempoTotal += tiempo
  }

  completarEscenario(escenario) {
    if (!this.progreso.escenariosCompletados.includes(escenario)) {
      this.progreso.escenariosCompletados.push(escenario)
    }
  }

  agregarLogro(logro) {
    if (!this.progreso.logros.includes(logro)) {
      this.progreso.logros.push(logro)
    }
  }

  obtenerProgresoEscenario(escenario) {
    const actividades = this.historialActividad.filter(a => a.escenario === escenario)
    const tiempoTotal = actividades.reduce((sum, a) => sum + a.tiempo, 0)
    const completado = this.progreso.escenariosCompletados.includes(escenario)
    
    return {
      escenario,
      tiempoTotal,
      completado,
      numeroActividades: actividades.length,
      ultimaActividad: actividades[actividades.length - 1]?.fecha || null
    }
  }

  obtenerEstadisticas() {
    return {
      totalEscenarios: this.escenariosHabilitados.length,
      escenariosCompletados: this.progreso.escenariosCompletados.length,
      tiempoTotal: this.progreso.tiempoTotal,
      logrosObtenidos: this.progreso.logros.length,
      ultimaActividad: this.progreso.ultimaActividad,
      progresoGeneral: this.escenariosHabilitados.length > 0 
        ? (this.progreso.escenariosCompletados.length / this.escenariosHabilitados.length) * 100 
        : 0
    }
  }

  toJSON() {
    return {
      ...super.toJSON(),
      semestre: this.semestre,
      progreso: this.progreso,
      escenariosHabilitados: this.escenariosHabilitados,
      historialActividad: this.historialActividad
    }
  }
}
