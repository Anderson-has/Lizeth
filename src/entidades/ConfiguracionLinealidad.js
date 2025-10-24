/**
 * ENTIDAD: ConfiguracionLinealidad
 * RESPONSABILIDAD: Almacenar configuración específica para visualización de linealidad
 * SRP: Solo maneja datos de configuración, no lógica de negocio ni presentación
 */
export class ConfiguracionLinealidad {
  constructor() {
    // Configuración de sliders
    this.sliders = {
      alpha: {
        min: -5,
        max: 5,
        paso: 0.1,
        valorInicial: 2
      },
      beta: {
        min: -5,
        max: 5,
        paso: 0.1,
        valorInicial: 1
      }
    }

    // Configuración de límites
    this.limites = {
      min: -10,
      max: 10,
      paso: 0.1
    }

    // Configuración de colores
    this.colores = {
      fFuncion: "#3b82f6",      // Azul
      gFuncion: "#10b981",      // Verde
      combinada: "#8b5cf6",     // Púrpura
      eje: "#6b7280",           // Gris
      grid: "#e5e7eb"           // Gris claro
    }

    // Configuración de gráfico
    this.grafico = {
      ancho: 600,
      alto: 400,
      margen: {
        superior: 20,
        inferior: 40,
        izquierdo: 60,
        derecho: 20
      }
    }

    // Configuración de precisión
    this.precision = {
      decimales: 3,
      tolerancia: 0.001
    }

    // Funciones disponibles
    this.funcionesDisponibles = [
      { key: "x", nombre: "x", descripcion: "Función lineal" },
      { key: "x²", nombre: "x²", descripcion: "Función cuadrática" },
      { key: "x³", nombre: "x³", descripcion: "Función cúbica" },
      { key: "sin(x)", nombre: "sin(x)", descripcion: "Función seno" },
      { key: "cos(x)", nombre: "cos(x)", descripcion: "Función coseno" },
      { key: "√x", nombre: "√x", descripcion: "Función raíz cuadrada" },
      { key: "eˣ", nombre: "eˣ", descripcion: "Función exponencial" }
    ]
  }

  // Getters
  obtenerConfiguracionSliders() {
    return this.sliders
  }

  obtenerConfiguracionLimites() {
    return this.limites
  }

  obtenerColores() {
    return this.colores
  }

  obtenerConfiguracionGrafico() {
    return this.grafico
  }

  obtenerPrecision() {
    return this.precision
  }

  obtenerFuncionesDisponibles() {
    return this.funcionesDisponibles
  }

  // Métodos de validación
  esValorSliderValido(valor, tipo) {
    const config = this.sliders[tipo]
    return valor >= config.min && valor <= config.max
  }

  esLimiteValido(limite) {
    return limite >= this.limites.min && limite <= this.limites.max
  }

  // Métodos de formateo
  formatearNumero(numero) {
    return Number(numero.toFixed(this.precision.decimales))
  }

  formatearSlider(valor, tipo) {
    const config = this.sliders[tipo]
    const paso = config.paso
    return Math.round(valor / paso) * paso
  }

  // Método requerido por TransformadorCoordenadas - ACTUALIZADO
  obtenerAreaDibujo() {
    const { ancho, alto, margen } = this.grafico
    return {
      x: margen.izquierdo,
      y: margen.superior,
      ancho: ancho - margen.izquierdo - margen.derecho,
      alto: alto - margen.superior - margen.inferior
    }
  }

  // Método requerido por TransformadorCoordenadas
  calcularEscalas(intervaloX, intervaloY) {
    const area = this.obtenerAreaDibujo()
    return {
      escalaX: area.ancho / (intervaloX.max - intervaloX.min),
      escalaY: area.alto / (intervaloY.max - intervaloY.min)
    }
  }
}
