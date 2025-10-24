/**
 * ENTIDAD: ConfiguracionComparacion
 * RESPONSABILIDAD: Solo almacenar configuraciones para la propiedad de comparación
 * SRP: Solo maneja configuraciones, no realiza cálculos ni renderizado
 */
export class ConfiguracionComparacion {
    constructor() {
        this.colores = {
            funcionF: "#3B82F6",      // Azul para f(x)
            funcionG: "#EF4444",       // Rojo para g(x)
            areaF: "#3B82F680",        // Azul transparente para área f(x)
            areaG: "#EF444480",         // Rojo transparente para área g(x)
            eje: "#6B7280",            // Gris para ejes
            grid: "#E5E7EB",           // Gris claro para grid
            texto: "#374151",          // Gris oscuro para texto
            hover: "#F59E0B",          // Amarillo para hover
            tooltip: "#1F2937"         // Gris muy oscuro para tooltip
        }

        this.grafico = {
            ancho: 800,
            alto: 500,
            margen: { superior: 20, inferior: 40, izquierdo: 60, derecho: 20 },
            grosorLinea: 3,
            radioPunto: 4,
            transparenciaArea: 0.3
        }

        this.tooltip = {
            padding: 8,
            fontSize: 12,
            backgroundColor: "rgba(31, 41, 55, 0.9)",
            textColor: "#FFFFFF",
            borderColor: "#6B7280",
            borderRadius: 4
        }

        this.animacion = {
            duracion: 1000,
            easing: "ease-in-out"
        }
    }

    obtenerColores() {
        return this.colores
    }

    obtenerGrafico() {
        return this.grafico
    }

    obtenerTooltip() {
        return this.tooltip
    }

    obtenerAnimacion() {
        return this.animacion
    }

    obtenerAreaDibujo() {
        const margen = this.grafico.margen
        return {
            x: margen.izquierdo,
            y: margen.superior,
            ancho: this.grafico.ancho - margen.izquierdo - margen.derecho,
            alto: this.grafico.alto - margen.superior - margen.inferior
        }
    }
    
    obtenerColores() {
        return this.colores
    }
    
    obtenerGrafico() {
        return this.grafico
    }
}
