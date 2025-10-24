/**
 * CLASE BASE: Escenario
 * RESPONSABILIDAD: Definir la interfaz común para todos los escenarios
 * SRP: Solo define el contrato que deben implementar los escenarios específicos
 */
export class Escenario {
  constructor(nombre, descripcion) {
    this.nombre = nombre
    this.descripcion = descripcion
    this.activo = false
    this.configuracion = null
    this.estado = null
  }

  // Métodos abstractos que deben ser implementados por las clases hijas
  inicializar() {
    throw new Error("Método inicializar() debe ser implementado por la clase hija")
  }

  configurar(configuracion) {
    this.configuracion = configuracion
  }

  activar() {
    this.activo = true
    this.onActivar()
  }

  desactivar() {
    this.activo = false
    this.onDesactivar()
  }

  // Hooks que pueden ser sobrescritos por las clases hijas
  onActivar() {
    // Implementación por defecto vacía
  }

  onDesactivar() {
    // Implementación por defecto vacía
  }

  obtenerEstado() {
    return this.estado
  }

  actualizarEstado(nuevoEstado) {
    this.estado = { ...this.estado, ...nuevoEstado }
    this.onEstadoCambiado()
  }

  onEstadoCambiado() {
    // Implementación por defecto vacía
  }

  obtenerConfiguracion() {
    return this.configuracion
  }

  reiniciar() {
    this.estado = null
    this.onReiniciar()
  }

  onReiniciar() {
    // Implementación por defecto vacía
  }

  // Método para obtener datos específicos del escenario
  obtenerDatos() {
    return {
      nombre: this.nombre,
      descripcion: this.descripcion,
      activo: this.activo,
      estado: this.estado,
      configuracion: this.configuracion
    }
  }
}
