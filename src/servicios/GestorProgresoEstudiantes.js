/**
 * SERVICIO: GestorProgresoEstudiantes
 * RESPONSABILIDAD: Gestionar el seguimiento de progreso y tiempo de estudiantes
 * SRP: Solo maneja la lógica de seguimiento de progreso, no almacena datos persistentes
 */
import { ServicioAutenticacion } from './ServicioAutenticacion.js'

export class GestorProgresoEstudiantes {
  constructor() {
    this.servicioAuth = new ServicioAutenticacion()
    this.actividadActual = null
    this.tiempoInicio = null
  }

  iniciarSeguimiento(estudianteId, escenario) {
    this.actividadActual = {
      estudianteId,
      escenario,
      tiempoInicio: Date.now(),
      acciones: []
    }
    this.tiempoInicio = Date.now()
  }

  registrarAccion(accion, datos = {}) {
    if (this.actividadActual) {
      const tiempoTranscurrido = Date.now() - this.tiempoInicio
      this.actividadActual.acciones.push({
        accion,
        datos,
        tiempo: tiempoTranscurrido,
        timestamp: Date.now()
      })
    }
  }

  finalizarSeguimiento() {
    if (!this.actividadActual) return null

    const tiempoTotal = Date.now() - this.tiempoInicio
    const actividad = {
      ...this.actividadActual,
      tiempoTotal,
      fecha: new Date(),
      timestamp: Date.now()
    }

    // Guardar actividad en el estudiante
    this.guardarActividad(actividad)

    // Limpiar actividad actual
    this.actividadActual = null
    this.tiempoInicio = null

    return actividad
  }

  guardarActividad(actividad) {
    const usuarios = this.servicioAuth.obtenerTodosLosUsuarios()
    const estudiante = usuarios.find(u => u.id === actividad.estudianteId)
    
    if (estudiante && estudiante.esEstudiante()) {
      estudiante.agregarActividad(
        actividad.escenario,
        actividad.tiempoTotal,
        'interaccion'
      )
      
      // Actualizar usuario en el servicio
      this.servicioAuth.actualizarUsuario(estudiante.id, estudiante)
    }
  }

  obtenerProgresoEstudiante(estudianteId) {
    const usuarios = this.servicioAuth.obtenerTodosLosUsuarios()
    const estudiante = usuarios.find(u => u.id === estudianteId)
    
    if (!estudiante || !estudiante.esEstudiante()) {
      return null
    }

    return {
      id: estudiante.id,
      nombre: estudiante.obtenerNombreCompleto(),
      nombreUsuario: estudiante.nombreUsuario,
      semestre: estudiante.semestre,
      estadisticas: estudiante.obtenerEstadisticas(),
      historial: estudiante.historialActividad || [],
      escenariosHabilitados: estudiante.escenariosHabilitados || []
    }
  }

  obtenerProgresoPorEscenario(estudianteId, escenario) {
    const progreso = this.obtenerProgresoEstudiante(estudianteId)
    if (!progreso) return null

    const actividadesEscenario = progreso.historial.filter(a => a.escenario === escenario)
    const tiempoTotal = actividadesEscenario.reduce((sum, a) => sum + a.tiempo, 0)
    const numeroActividades = actividadesEscenario.length
    const completado = progreso.estadisticas.escenariosCompletados.includes(escenario)

    return {
      escenario,
      tiempoTotal,
      numeroActividades,
      completado,
      ultimaActividad: actividadesEscenario[actividadesEscenario.length - 1]?.fecha || null,
      progreso: completado ? 100 : Math.min((numeroActividades / 5) * 100, 100) // Asumiendo 5 actividades para completar
    }
  }

  obtenerEstadisticasGenerales() {
    const estudiantes = this.servicioAuth.obtenerEstudiantes()
    
    const estadisticas = {
      totalEstudiantes: estudiantes.length,
      estudiantesActivos: estudiantes.filter(e => e.activo).length,
      tiempoPromedio: 0,
      escenariosCompletados: 0,
      logrosObtenidos: 0,
      actividadReciente: []
    }

    if (estudiantes.length > 0) {
      estadisticas.tiempoPromedio = estudiantes.reduce((sum, e) => 
        sum + (e.progreso?.tiempoTotal || 0), 0) / estudiantes.length
      
      estadisticas.escenariosCompletados = estudiantes.reduce((sum, e) => 
        sum + (e.progreso?.escenariosCompletados?.length || 0), 0)
      
      estadisticas.logrosObtenidos = estudiantes.reduce((sum, e) => 
        sum + (e.progreso?.logros?.length || 0), 0)

      // Actividad reciente (últimos 7 días)
      const hace7Dias = new Date()
      hace7Dias.setDate(hace7Dias.getDate() - 7)
      
      estadisticas.actividadReciente = estudiantes
        .filter(e => e.progreso?.ultimaActividad && 
          new Date(e.progreso.ultimaActividad) > hace7Dias)
        .map(e => ({
          id: e.id,
          nombre: e.obtenerNombreCompleto(),
          ultimaActividad: e.progreso.ultimaActividad,
          tiempoTotal: e.progreso?.tiempoTotal || 0
        }))
        .sort((a, b) => new Date(b.ultimaActividad) - new Date(a.ultimaActividad))
        .slice(0, 10)
    }

    return estadisticas
  }

  obtenerReporteDetallado(estudianteId) {
    const progreso = this.obtenerProgresoEstudiante(estudianteId)
    if (!progreso) return null

    const escenarios = ['jardinRiemann', 'puenteTeorema', 'torreValorMedio', 'cristalAntiderivadas']
    
    const reporte = {
      estudiante: {
        id: progreso.id,
        nombre: progreso.nombre,
        nombreUsuario: progreso.nombreUsuario,
        semestre: progreso.semestre
      },
      resumen: progreso.estadisticas,
      progresoPorEscenario: escenarios.map(escenario => 
        this.obtenerProgresoPorEscenario(estudianteId, escenario)
      ).filter(Boolean),
      historialDetallado: progreso.historial.map(actividad => ({
        escenario: actividad.escenario,
        tiempo: actividad.tiempo,
        fecha: actividad.fecha,
        accion: actividad.accion,
        duracion: this.formatearTiempo(actividad.tiempo)
      })),
      recomendaciones: this.generarRecomendaciones(progreso)
    }

    return reporte
  }

  generarRecomendaciones(progreso) {
    const recomendaciones = []
    
    if (progreso.estadisticas.tiempoTotal < 300000) { // Menos de 5 minutos
      recomendaciones.push({
        tipo: 'tiempo',
        mensaje: 'Te recomendamos dedicar más tiempo a explorar los escenarios para mejorar tu comprensión.',
        prioridad: 'alta'
      })
    }

    if (progreso.estadisticas.escenariosCompletados.length === 0) {
      recomendaciones.push({
        tipo: 'progreso',
        mensaje: 'Comienza explorando el Jardín de Riemann para familiarizarte con los conceptos básicos.',
        prioridad: 'alta'
      })
    }

    if (progreso.estadisticas.logros.length === 0) {
      recomendaciones.push({
        tipo: 'logros',
        mensaje: 'Intenta completar más actividades para desbloquear logros y certificaciones.',
        prioridad: 'media'
      })
    }

    return recomendaciones
  }

  formatearTiempo(milisegundos) {
    const minutos = Math.floor(milisegundos / 60000)
    const segundos = Math.floor((milisegundos % 60000) / 1000)
    return `${minutos}m ${segundos}s`
  }

  exportarDatosEstudiante(estudianteId) {
    const reporte = this.obtenerReporteDetallado(estudianteId)
    if (!reporte) return null

    return {
      fechaExportacion: new Date().toISOString(),
      estudiante: reporte.estudiante,
      resumen: reporte.resumen,
      progresoPorEscenario: reporte.progresoPorEscenario,
      recomendaciones: reporte.recomendaciones
    }
  }
}
