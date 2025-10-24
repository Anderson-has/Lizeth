/**
 * ConfiguracionInversionLimites - Configuración específica para visualización de inversión de límites
 * RESPONSABILIDAD ÚNICA: Solo manejar configuración de visualización
 */
export class ConfiguracionInversionLimites {
    constructor() {
        // Configuración de colores
        this.colores = {
            funcion: '#3b82f6',           // Azul para la función
            areaNormal: 'rgba(59, 130, 246, 0.3)',    // Azul transparente para área normal
            areaInvertida: 'rgba(239, 68, 68, 0.3)',  // Rojo transparente para área invertida
            eje: '#374151',               // Gris para ejes
            hover: '#f59e0b',             // Amarillo para hover
            texto: '#1f2937',             // Gris oscuro para texto
            fondo: '#ffffff'              // Blanco para fondo
        }
        
        // Configuración del gráfico
        this.grafico = {
            ancho: 800,
            alto: 400,
            margen: {
                izquierdo: 60,
                derecho: 20,
                superior: 20,
                inferior: 60
            }
        }
        
        // Configuración de líneas
        this.lineas = {
            grosorFuncion: 2,
            grosorEje: 1,
            grosorHover: 3
        }
        
        // Configuración de opacidades
        this.opacidades = {
            areaNormal: 0.3,
            areaInvertida: 0.3,
            hover: 0.8
        }
        
        // Configuración de tooltip
        this.tooltip = {
            backgroundColor: 'rgba(31, 41, 55, 0.95)',
            textColor: '#f9fafb',
            borderColor: '#374151',
            fontSize: '11px',
            padding: 12
        }
    }
    
    // Obtener colores
    obtenerColores() {
        return this.colores
    }
    
    // Obtener configuración del gráfico
    obtenerGrafico() {
        return this.grafico
    }
    
    // Obtener configuración de líneas
    obtenerLineas() {
        return this.lineas
    }
    
    // Obtener opacidades
    obtenerOpacidades() {
        return this.opacidades
    }
    
    // Obtener configuración de tooltip
    obtenerTooltip() {
        return this.tooltip
    }
    
    // Obtener área de dibujo (requerido por TransformadorCoordenadas)
    obtenerAreaDibujo() {
        const { ancho, alto, margen } = this.grafico
        return {
            x: margen.izquierdo,
            y: margen.superior,
            ancho: ancho - margen.izquierdo - margen.derecho,
            alto: alto - margen.superior - margen.inferior
        }
    }
    
    // Obtener escalas (requerido por TransformadorCoordenadas)
    obtenerEscalas() {
        return {
            x: 1,
            y: 1
        }
    }
}
