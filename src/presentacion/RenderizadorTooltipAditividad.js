/**
 * RenderizadorTooltipAditividad - Renderizador que muestra tooltips en el gráfico de aditividad
 * RESPONSABILIDAD ÚNICA: Solo renderizado de tooltips
 */
export class RenderizadorTooltipAditividad {
    constructor(configuracion) {
        this.configuracion = configuracion
        this.tooltipConfig = configuracion.obtenerConfiguracionTooltip()
    }
    
    // Renderizar tooltip
    renderizar(container, puntoHover, funcion) {
        if (!puntoHover) {
            this.ocultarTooltip(container)
            return
        }
        
        const informacionIntervalo = this.obtenerInformacionIntervalo(puntoHover.intervalo)
        
        container.innerHTML = `
            <div class="absolute bg-gray-800 text-white text-xs rounded-lg p-3 shadow-lg pointer-events-none z-50"
                 style="left: ${puntoHover.coordenadasCanvas.x + 10}px; top: ${puntoHover.coordenadasCanvas.y - 10}px; min-width: 200px;">
                <div class="space-y-1">
                    <div class="flex items-center">
                        <div class="w-2 h-2 rounded-full mr-2" style="background-color: ${informacionIntervalo.color};"></div>
                        <span class="font-medium">x = ${puntoHover.x.toFixed(2)}</span>
                    </div>
                    <div class="text-gray-300">
                        <span class="font-mono">f(x) = ${puntoHover.valorFuncion.toFixed(3)}</span>
                    </div>
                    <div class="text-gray-400 text-xs">
                        <span class="font-medium">Intervalo:</span> ${informacionIntervalo.nombre}
                    </div>
                    <div class="text-gray-400 text-xs">
                        ${informacionIntervalo.descripcion}
                    </div>
                </div>
            </div>
        `
        
        container.style.display = 'block'
    }
    
    // Ocultar tooltip
    ocultarTooltip(container) {
        container.style.display = 'none'
        container.innerHTML = ''
    }
    
    // Obtener información del intervalo
    obtenerInformacionIntervalo(intervalo) {
        const informacion = {
            "fuera": {
                nombre: "Fuera del intervalo",
                color: "#6b7280",
                descripcion: "Punto fuera del rango de integración"
            },
            "ab": {
                nombre: "[a, b]",
                color: "#3b82f6",
                descripcion: "Primer subintervalo (área azul)"
            },
            "bc": {
                nombre: "[b, c]",
                color: "#10b981",
                descripcion: "Segundo subintervalo (área verde)"
            }
        }
        
        return informacion[intervalo] || informacion["fuera"]
    }
    
    // Actualizar posición del tooltip
    actualizarPosicion(container, puntoHover) {
        if (!puntoHover) return
        
        const tooltip = container.querySelector('div')
        if (tooltip) {
            tooltip.style.left = `${puntoHover.coordenadasCanvas.x + 10}px`
            tooltip.style.top = `${puntoHover.coordenadasCanvas.y - 10}px`
        }
    }
}

