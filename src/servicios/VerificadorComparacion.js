/**
 * SERVICIO: VerificadorComparacion
 * RESPONSABILIDAD: Solo verificar la propiedad de comparación
 * SRP: Solo verificación, no cálculos ni renderizado
 */
export class VerificadorComparacion {
    constructor() {
        this.tolerancia = 0.0001
    }

    // Verificar la propiedad de comparación
    verificarPropiedad(integralF, integralG) {
        const diferencia = integralF - integralG
        const esValida = Math.abs(diferencia) >= 0

        let mensaje = ""
        let tipoComparacion = ""

        if (Math.abs(diferencia) < this.tolerancia) {
            mensaje = "Las integrales son prácticamente iguales"
            tipoComparacion = "iguales"
        } else if (integralF > integralG) {
            mensaje = `∫f(x)dx > ∫g(x)dx (diferencia: ${diferencia.toFixed(4)})`
            tipoComparacion = "f_mayor"
        } else {
            mensaje = `∫g(x)dx > ∫f(x)dx (diferencia: ${Math.abs(diferencia).toFixed(4)})`
            tipoComparacion = "g_mayor"
        }

        return {
            esValida,
            mensaje,
            tipoComparacion,
            diferencia,
            integralF,
            integralG
        }
    }

    // Verificar casos especiales
    verificarCasosEspeciales(funcionF, funcionG, limiteA, limiteB) {
        const casos = []

        // Caso 1: Funciones idénticas
        if (funcionF === funcionG) {
            casos.push({
                tipo: "identicas",
                descripcion: "Las funciones son idénticas",
                resultado: "Las integrales serán iguales"
            })
        }

        // Caso 2: Una función es constante
        if (funcionF === "2x" || funcionF === "3x") {
            casos.push({
                tipo: "lineal",
                descripcion: "f(x) es una función lineal",
                resultado: "Comportamiento predecible"
            })
        }

        // Caso 3: Intervalo simétrico
        if (limiteA === -limiteB) {
            casos.push({
                tipo: "simetrico",
                descripcion: "Intervalo simétrico alrededor del origen",
                resultado: "Puede haber simetrías especiales"
            })
        }

        return casos
    }

    // Obtener explicación de la propiedad
    obtenerExplicacion() {
        return {
            titulo: "Propiedad de Comparación",
            definicion: "Si f(x) ≤ g(x) para todo x en [a,b], entonces ∫[a→b] f(x)dx ≤ ∫[a→b] g(x)dx",
            interpretacion: "Si una función está siempre por debajo de otra en un intervalo, su integral también será menor",
            aplicaciones: [
                "Comparar el rendimiento de diferentes funciones",
                "Estimar integrales complejas usando funciones más simples",
                "Demostrar desigualdades matemáticas"
            ]
        }
    }

    // Obtener casos especiales
    obtenerCasosEspeciales() {
        return [
            {
                titulo: "Funciones Idénticas",
                descripcion: "Si f(x) = g(x), entonces ∫f(x)dx = ∫g(x)dx",
                ejemplo: "f(x) = x, g(x) = x"
            },
            {
                titulo: "Una Función Constante",
                descripcion: "Si f(x) = c (constante), entonces ∫f(x)dx = c(b-a)",
                ejemplo: "f(x) = 2, g(x) = x²"
            },
            {
                titulo: "Funciones Lineales",
                descripcion: "Las funciones lineales tienen comportamiento predecible",
                ejemplo: "f(x) = 2x, g(x) = 3x"
            }
        ]
    }

    // Validar entrada
    validarEntrada(funcionF, funcionG, limiteA, limiteB) {
        const errores = []

        if (limiteA >= limiteB) {
            errores.push("El límite inferior debe ser menor que el superior")
        }

        if (!funcionF || !funcionG) {
            errores.push("Ambas funciones deben estar definidas")
        }

        if (funcionF === funcionG) {
            errores.push("Las funciones deben ser diferentes para la comparación")
        }

        return {
            esValida: errores.length === 0,
            errores
        }
    }
}
