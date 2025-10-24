/**
 * ENTIDAD: Docente
 * RESPONSABILIDAD: Extender Usuario con funcionalidades específicas de docentes
 * SRP: Solo maneja datos y comportamiento específico de docentes
 */
import { Usuario } from './Usuario.js'

export class Docente extends Usuario {
  constructor(datos) {
    super(datos)
    this.estudiantesAsignados = datos.estudiantesAsignados || []
    this.escenariosConfigurados = datos.escenariosConfigurados || {
      jardinRiemann: { habilitado: true, fechaHabilitacion: new Date() },
      puenteTeorema: { habilitado: true, fechaHabilitacion: new Date() },
      torreValorMedio: { habilitado: true, fechaHabilitacion: new Date() },
      cristalAntiderivadas: { habilitado: true, fechaHabilitacion: new Date() }
    }
    this.permisos = datos.permisos || {
      gestionarEstudiantes: true,
      configurarEscenarios: true,
      verReportes: true,
      eliminarUsuarios: true
    }
  }

  habilitarEscenario(escenario) {
    if (this.escenariosConfigurados[escenario]) {
      this.escenariosConfigurados[escenario].habilitado = true
      this.escenariosConfigurados[escenario].fechaHabilitacion = new Date()
    }
  }

  deshabilitarEscenario(escenario) {
    if (this.escenariosConfigurados[escenario]) {
      this.escenariosConfigurados[escenario].habilitado = false
      this.escenariosConfigurados[escenario].fechaDeshabilitacion = new Date()
    }
  }

  obtenerEscenariosHabilitados() {
    return Object.entries(this.escenariosConfigurados)
      .filter(([_, config]) => config.habilitado)
      .map(([nombre, _]) => nombre)
  }

  asignarEstudiante(estudianteId) {
    if (!this.estudiantesAsignados.includes(estudianteId)) {
      this.estudiantesAsignados.push(estudianteId)
    }
  }

  desasignarEstudiante(estudianteId) {
    this.estudiantesAsignados = this.estudiantesAsignados.filter(id => id !== estudianteId)
  }

  obtenerEstadisticasEstudiantes(estudiantes) {
    const estudiantesAsignados = estudiantes.filter(e => 
      this.estudiantesAsignados.includes(e.id)
    )

    return {
      totalEstudiantes: estudiantesAsignados.length,
      estudiantesActivos: estudiantesAsignados.filter(e => e.activo).length,
      tiempoPromedio: estudiantesAsignados.reduce((sum, e) => 
        sum + (e.progreso?.tiempoTotal || 0), 0) / estudiantesAsignados.length || 0,
      escenariosMasPopulares: this.obtenerEscenariosMasPopulares(estudiantesAsignados),
      progresoGeneral: this.calcularProgresoGeneral(estudiantesAsignados)
    }
  }

  obtenerEscenariosMasPopulares(estudiantes) {
    const escenarios = {}
    
    estudiantes.forEach(estudiante => {
      estudiante.historialActividad?.forEach(actividad => {
        if (!escenarios[actividad.escenario]) {
          escenarios[actividad.escenario] = { accesos: 0, tiempoTotal: 0 }
        }
        escenarios[actividad.escenario].accesos++
        escenarios[actividad.escenario].tiempoTotal += actividad.tiempo
      })
    })

    return Object.entries(escenarios)
      .sort(([,a], [,b]) => b.accesos - a.accesos)
      .slice(0, 5)
      .map(([nombre, datos]) => ({ nombre, ...datos }))
  }

  calcularProgresoGeneral(estudiantes) {
    if (estudiantes.length === 0) return 0
    
    const totalEscenarios = this.obtenerEscenariosHabilitados().length
    const progresoTotal = estudiantes.reduce((sum, estudiante) => {
      const completados = estudiante.progreso?.escenariosCompletados?.length || 0
      return sum + (completados / totalEscenarios) * 100
    }, 0)

    return progresoTotal / estudiantes.length
  }

  toJSON() {
    return {
      ...super.toJSON(),
      estudiantesAsignados: this.estudiantesAsignados,
      escenariosConfigurados: this.escenariosConfigurados,
      permisos: this.permisos
    }
  }
}
