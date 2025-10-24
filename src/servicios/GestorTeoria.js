/**
 * SERVICIO: GestorTeoria
 * RESPONSABILIDAD: Gestionar la presentación y organización de contenido teórico
 * SRP: Solo maneja la lógica de presentación de teoría, no almacena datos ni realiza cálculos
 */
import { TeoriaRiemann } from "../entidades/TeoriaRiemann.js"
import { TeoriaAditividad } from "../entidades/TeoriaAditividad.js"
import { TeoriaComparacion } from "../entidades/TeoriaComparacion.js"
import { TeoriaInversionLimites } from "../entidades/TeoriaInversionLimites.js"
import { TeoriaLinealidad } from "../entidades/TeoriaLinealidad.js"
import { TeoriaTorreValorMedio } from "../entidades/TeoriaTorreValorMedio.js"

export class GestorTeoria {
  constructor() {
    this.teorias = this.inicializarTeorias()
  }

  inicializarTeorias() {
    return {
      riemann: new TeoriaRiemann(),
      aditividad: new TeoriaAditividad(),
      comparacion: new TeoriaComparacion(),
      inversionLimites: new TeoriaInversionLimites(),
      linealidad: new TeoriaLinealidad(),
      torreValorMedio: new TeoriaTorreValorMedio()
    }
  }

  obtenerTeoria(tipo) {
    return this.teorias[tipo] || null
  }

  obtenerTodasLasTeorias() {
    return this.teorias
  }

  obtenerTeoriasPorCategoria(categoria) {
    const categorias = {
      "propiedades": ["aditividad", "comparacion", "inversionLimites", "linealidad"],
      "fundamentos": ["riemann"],
      "teoremas": ["torreValorMedio"]
    }
    
    const tipos = categorias[categoria] || []
    return tipos.map(tipo => this.teorias[tipo]).filter(Boolean)
  }

  generarResumenTeorico() {
    return {
      totalTeorias: Object.keys(this.teorias).length,
      categorias: ["propiedades", "fundamentos", "teoremas"],
      temas: Object.values(this.teorias).map(teoria => teoria.titulo)
    }
  }
}
