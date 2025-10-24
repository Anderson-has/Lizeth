/**
 * ENTIDAD: TeoriaTorreValorMedio
 * RESPONSABILIDAD: Almacenar información teórica del Teorema del Valor Medio
 * SRP: Solo almacena datos teóricos, no realiza cálculos ni renderizado
 */
export class TeoriaTorreValorMedio {
  constructor() {
    this.titulo = "Teorema del Valor Medio"
    this.definicion = "El Teorema del Valor Medio establece que si una función es continua en un intervalo cerrado [a, b] y derivable en el intervalo abierto (a, b), entonces existe al menos un punto c en (a, b) donde la derivada de la función es igual a la pendiente de la recta secante que une los puntos (a, f(a)) y (b, f(b))."
    
    this.formula = "f'(c) = (f(b) - f(a)) / (b - a)"
    
    this.simbolos = {
      "f(x)": "Función continua y derivable",
      "a, b": "Extremos del intervalo [a, b]",
      "c": "Punto donde se cumple el teorema",
      "f'(c)": "Derivada de f en el punto c",
      "(f(b) - f(a)) / (b - a)": "Pendiente de la recta secante"
    }
    
    this.condiciones = [
      "f debe ser continua en [a, b]",
      "f debe ser derivable en (a, b)",
      "El punto c está en el interior del intervalo (a, b)"
    ]
    
    this.interpretacionGeometrica = "Geométricamente, el teorema garantiza que existe al menos un punto c donde la recta tangente a la curva es paralela a la recta secante que une los puntos (a, f(a)) y (b, f(b)). Esto significa que en algún momento del intervalo, la función tiene la misma 'velocidad de cambio' que su promedio en todo el intervalo."
    
    this.aplicaciones = [
      "Análisis de velocidad promedio en física",
      "Optimización en economía",
      "Análisis de crecimiento poblacional",
      "Estudios de eficiencia en ingeniería",
      "Análisis de tendencias en estadística"
    ]
    
    this.ejemplo = {
      funcion: "f(x) = x²",
      intervalo: { inicio: -2, fin: 2 },
      resultado: "c = 0 (punto medio del intervalo)"
    }
    
    this.ventajas = [
      "Proporciona información sobre el comportamiento de la función",
      "Útil para demostrar la existencia de puntos especiales",
      "Base para otros teoremas importantes del cálculo",
      "Aplicable a una amplia gama de funciones"
    ]
    
    this.limitaciones = [
      "Requiere continuidad en el intervalo cerrado",
      "Requiere derivabilidad en el intervalo abierto",
      "No garantiza la unicidad del punto c",
      "No proporciona un método directo para encontrar c"
    ]
    
    this.historia = "El Teorema del Valor Medio fue formulado por el matemático francés Augustin-Louis Cauchy en el siglo XIX, aunque sus raíces se remontan a trabajos anteriores de Lagrange y otros matemáticos del siglo XVIII."
    
    this.conexiones = [
      "Teorema de Rolle (caso especial cuando f(a) = f(b))",
      "Teorema del Valor Medio Generalizado",
      "Teorema de Taylor",
      "Regla de L'Hôpital"
    ]
    
    this.demostracion = {
      titulo: "Demostración del Teorema del Valor Medio",
      pasos: [
        "Definir la función auxiliar g(x) = f(x) - f(a) - [(f(b) - f(a))/(b - a)](x - a)",
        "Verificar que g(a) = g(b) = 0",
        "Aplicar el Teorema de Rolle a g(x) en [a, b]",
        "Concluir que existe c ∈ (a, b) tal que g'(c) = 0",
        "Desarrollar g'(c) = 0 para obtener f'(c) = (f(b) - f(a))/(b - a)"
      ]
    }
    
    this.visualizacion = {
      descripcion: "La visualización incluye una torre que representa la función y un plano cartesiano interactivo donde puedes colocar tu estimación del punto c.",
      elementos: [
        "Torre del Valor Medio: Histograma visual de la función",
        "Plano Cartesiano: Gráfica interactiva para estimar c",
        "Línea de altura promedio: Representa el valor medio",
        "Puntos a y b: Extremos del intervalo",
        "Recta secante: Línea que une (a, f(a)) y (b, f(b))"
      ]
    }
  }
  
  obtenerInformacionCompleta() {
    return {
      titulo: this.titulo,
      definicion: this.definicion,
      formula: this.formula,
      simbolos: this.simbolos,
      condiciones: this.condiciones,
      interpretacionGeometrica: this.interpretacionGeometrica,
      aplicaciones: this.aplicaciones,
      ejemplo: this.ejemplo,
      ventajas: this.ventajas,
      limitaciones: this.limitaciones,
      historia: this.historia,
      conexiones: this.conexiones,
      demostracion: this.demostracion,
      visualizacion: this.visualizacion
    }
  }
}


