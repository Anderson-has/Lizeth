/**
 * FACTORY: EscenarioFactory
 * RESPONSABILIDAD: Crear y gestionar instancias de escenarios
 * SRP: Solo maneja la creación y selección de escenarios, no la lógica de negocio
 */
import { EscenarioJardinRiemann } from "./EscenarioJardinRiemann.js"
import { EscenarioPTFC } from "./EscenarioPTFC.js"
import { EscenarioPropiedadesLinealidad } from "./EscenarioPropiedadesLinealidad.js"
import { EscenarioPropiedadesAditividad } from "./EscenarioPropiedadesAditividad.js"
import { EscenarioComparacion } from "./EscenarioComparacion.js"
import { EscenarioInversionLimites } from "./EscenarioInversionLimites.js"
import { EscenarioTorreValorMedio } from "./EscenarioTorreValorMedio.js"

export class EscenarioFactory {
  constructor() {
    this.escenarios = new Map()
    this.escenarioActivo = null
    this.registrarEscenarios()
  }

  registrarEscenarios() {
    // Registrar todos los escenarios disponibles
    this.escenarios.set('jardin-riemann', () => new EscenarioJardinRiemann())
    this.escenarios.set('puente-teorema', () => new EscenarioPTFC())
    this.escenarios.set('propiedades-linealidad', () => new EscenarioPropiedadesLinealidad())
    this.escenarios.set('propiedades-aditividad', () => new EscenarioPropiedadesAditividad())
    this.escenarios.set('comparacion', () => new EscenarioComparacion())
    this.escenarios.set('inversion-limites', () => new EscenarioInversionLimites())
    this.escenarios.set('torre-valor-medio', () => new EscenarioTorreValorMedio())
    // Aquí se pueden agregar más escenarios en el futuro
    // this.escenarios.set('cristal-antiderivadas', () => new EscenarioCristalAntiderivadas())
  }

  crearEscenario(tipo) {
    const constructor = this.escenarios.get(tipo)
    if (!constructor) {
      throw new Error(`Escenario de tipo '${tipo}' no encontrado`)
    }
    
    const escenario = constructor()
    escenario.inicializar()
    return escenario
  }

  cambiarEscenario(tipo) {
    // Desactivar escenario actual si existe
    if (this.escenarioActivo) {
      this.escenarioActivo.desactivar()
    }

    // Crear y activar nuevo escenario
    this.escenarioActivo = this.crearEscenario(tipo)
    this.escenarioActivo.activar()
    
    return this.escenarioActivo
  }

  obtenerEscenarioActivo() {
    return this.escenarioActivo
  }

  obtenerEscenariosDisponibles() {
    return Array.from(this.escenarios.keys()).map(tipo => ({
      tipo,
      nombre: this.crearEscenario(tipo).nombre,
      descripcion: this.crearEscenario(tipo).descripcion
    }))
  }

  reiniciarEscenarioActivo() {
    if (this.escenarioActivo) {
      this.escenarioActivo.reiniciar()
    }
  }
}
