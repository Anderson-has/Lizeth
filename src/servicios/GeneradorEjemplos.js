/**
 * SERVICIO: GeneradorEjemplos
 * RESPONSABILIDAD: Generar ejemplos prácticos para cada teoría
 * SRP: Solo genera ejemplos, no almacena datos ni maneja presentación
 */
import { FuncionMatematica } from "../entidades/FuncionMatematica.js"

export class GeneradorEjemplos {
  constructor() {
    this.funcionesEjemplo = this.inicializarFuncionesEjemplo()
  }

  inicializarFuncionesEjemplo() {
    return {
      cuadratica: new FuncionMatematica("cuadratica", { a: 1, b: 0, c: 0 }),
      lineal: new FuncionMatematica("lineal", { a: 2, b: 1 }),
      cubica: new FuncionMatematica("cubica", { a: 1, b: 0, c: 0, d: 0 })
    }
  }

  generarEjemploRiemann() {
    return {
      titulo: "Ejemplo: Suma de Riemann para f(x) = x²",
      funcion: "f(x) = x²",
      intervalo: { inicio: 0, fin: 2 },
      particiones: 4,
      tipoAproximacion: "izquierda",
      pasos: [
        "Dividir [0,2] en 4 subintervalos: [0,0.5], [0.5,1], [1,1.5], [1.5,2]",
        "Calcular Δx = (2-0)/4 = 0.5",
        "Evaluar f(x) en puntos izquierdos: f(0), f(0.5), f(1), f(1.5)",
        "Calcular áreas: f(0)×0.5 + f(0.5)×0.5 + f(1)×0.5 + f(1.5)×0.5",
        "Sumar: 0×0.5 + 0.25×0.5 + 1×0.5 + 2.25×0.5 = 1.75"
      ],
      resultado: "S₄ = 1.75 (aproximación del área real = 8/3 ≈ 2.67)"
    }
  }

  generarEjemploAditividad() {
    return {
      titulo: "Ejemplo: Propiedad de Aditividad",
      funcion: "f(x) = x²",
      intervalo: { inicio: 0, fin: 3 },
      puntoIntermedio: 1,
      calculos: {
        integralCompleta: "∫[0,3] x² dx = [x³/3]₀³ = 9",
        integral1: "∫[0,1] x² dx = [x³/3]₀¹ = 1/3",
        integral2: "∫[1,3] x² dx = [x³/3]₁³ = 9 - 1/3 = 26/3"
      },
      verificacion: "1/3 + 26/3 = 27/3 = 9 ✓"
    }
  }

  generarEjemploComparacion() {
    return {
      titulo: "Ejemplo: Propiedad de Comparación",
      funcion1: "f(x) = x",
      funcion2: "g(x) = x²",
      intervalo: { inicio: 1, fin: 2 },
      verificacion: "Como x ≤ x² en [1,2], entonces ∫[1,2] x dx ≤ ∫[1,2] x² dx",
      calculos: {
        integral1: "∫[1,2] x dx = [x²/2]₁² = 2 - 1/2 = 3/2",
        integral2: "∫[1,2] x² dx = [x³/3]₁² = 8/3 - 1/3 = 7/3"
      },
      resultado: "3/2 = 1.5 ≤ 7/3 ≈ 2.33 ✓"
    }
  }

  generarEjemploInversionLimites() {
    return {
      titulo: "Ejemplo: Inversión de Límites",
      funcion: "f(x) = x²",
      intervaloOriginal: { inicio: 0, fin: 2 },
      intervaloInvertido: { inicio: 2, fin: 0 },
      calculos: {
        integralOriginal: "∫[0,2] x² dx = [x³/3]₀² = 8/3",
        integralInvertida: "∫[2,0] x² dx = [x³/3]₂⁰ = 0 - 8/3 = -8/3"
      },
      verificacion: "8/3 = -(-8/3) ✓"
    }
  }

  generarEjemploLinealidad() {
    return {
      titulo: "Ejemplo: Propiedad de Linealidad",
      funcion1: "f(x) = x²",
      funcion2: "g(x) = x",
      constante1: 2,
      constante2: 3,
      intervalo: { inicio: 0, fin: 1 },
      calculos: {
        ladoIzquierdo: "∫[0,1] [2x² + 3x] dx = [2x³/3 + 3x²/2]₀¹ = 2/3 + 3/2 = 13/6",
        ladoDerecho: "2∫[0,1] x² dx + 3∫[0,1] x dx = 2(1/3) + 3(1/2) = 2/3 + 3/2 = 13/6"
      },
      verificacion: "13/6 = 13/6 ✓"
    }
  }

  obtenerTodosLosEjemplos() {
    return {
      riemann: this.generarEjemploRiemann(),
      aditividad: this.generarEjemploAditividad(),
      comparacion: this.generarEjemploComparacion(),
      inversionLimites: this.generarEjemploInversionLimites(),
      linealidad: this.generarEjemploLinealidad()
    }
  }
}
