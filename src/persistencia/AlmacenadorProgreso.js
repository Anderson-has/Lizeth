/**
 * PERSISTENCIA: AlmacenadorProgreso
 * RESPONSABILIDAD: Guardar progreso del usuario en localStorage
 */
export class AlmacenadorProgreso {
  constructor(clave = "integralearn_progreso") {
    this.clave = clave
  }

  guardar(datos) {
    try {
      const json = JSON.stringify(datos)
      localStorage.setItem(this.clave, json)
      return true
    } catch (error) {
      console.error("Error al guardar progreso:", error)
      return false
    }
  }

  cargar() {
    try {
      const json = localStorage.getItem(this.clave)
      return json ? JSON.parse(json) : null
    } catch (error) {
      console.error("Error al cargar progreso:", error)
      return null
    }
  }

  eliminar() {
    try {
      localStorage.removeItem(this.clave)
      return true
    } catch (error) {
      console.error("Error al eliminar progreso:", error)
      return false
    }
  }

  existe() {
    return localStorage.getItem(this.clave) !== null
  }
}
