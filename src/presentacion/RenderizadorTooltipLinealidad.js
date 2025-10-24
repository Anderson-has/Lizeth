/**
 * RENDERIZADOR: RenderizadorTooltipLinealidad
 * RESPONSABILIDAD: Renderizar tooltip interactivo con cálculos en tiempo real
 * SRP: Solo maneja presentación del tooltip, no lógica de negocio
 */
export class RenderizadorTooltipLinealidad {
  constructor(container, configuracion) {
    this.container = container
    this.configuracion = configuracion
    this.tooltip = null
    this.crearTooltip()
  }

  // Crear elemento del tooltip
  crearTooltip() {
    this.tooltip = document.createElement('div')
    this.tooltip.className = 'tooltip-linealidad'
    this.tooltip.style.cssText = `
      position: absolute;
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(10px);
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      padding: 12px;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
      z-index: 1000;
      pointer-events: none;
      opacity: 0;
      transition: opacity 0.2s ease;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      min-width: 200px;
    `
    
    // Agregar al container
    this.container.appendChild(this.tooltip)
  }

  // Mostrar tooltip
  mostrarTooltip(datosHover, posicion) {
    if (!this.tooltip || !datosHover) return
    
    this.actualizarContenido(datosHover)
    this.actualizarPosicion(posicion)
    this.tooltip.style.opacity = '1'
  }

  // Ocultar tooltip
  ocultarTooltip() {
    if (this.tooltip) {
      this.tooltip.style.opacity = '0'
    }
  }

  // Actualizar contenido del tooltip
  actualizarContenido(datosHover) {
    if (!this.tooltip || !datosHover) return
    
    const { valores } = datosHover
    const { x, f, g, alphaF, betaG, combinada, alpha, beta } = valores
    
    this.tooltip.innerHTML = `
      <div style="margin-bottom: 8px;">
        <div style="font-size: 14px; font-weight: 600; color: #374151; margin-bottom: 2px;">
          x = ${x.toFixed(2)}
        </div>
      </div>
      
      <div style="display: flex; flex-direction: column; gap: 4px; font-size: 12px;">
        <!-- f(x) -->
        <div style="display: flex; align-items: center; gap: 8px;">
          <div style="width: 12px; height: 12px; background: #3b82f6; border-radius: 50%;"></div>
          <span style="color: #374151;">f(x) = ${f.toFixed(2)}</span>
        </div>
        
        <!-- g(x) -->
        <div style="display: flex; align-items: center; gap: 8px;">
          <div style="width: 12px; height: 12px; background: #10b981; border-radius: 50%;"></div>
          <span style="color: #374151;">g(x) = ${g.toFixed(2)}</span>
        </div>
        
        <!-- αf(x) -->
        <div style="display: flex; align-items: center; gap: 8px;">
          <div style="width: 12px; height: 12px; background: #8b5cf6; border-radius: 50%;"></div>
          <span style="color: #374151;">αf(x) = ${alpha} × ${f.toFixed(2)} = ${alphaF.toFixed(2)}</span>
        </div>
        
        <!-- βg(x) -->
        <div style="display: flex; align-items: center; gap: 8px;">
          <div style="width: 12px; height: 12px; background: #f59e0b; border-radius: 50%;"></div>
          <span style="color: #374151;">βg(x) = ${beta} × ${g.toFixed(2)} = ${betaG.toFixed(2)}</span>
        </div>
        
        <!-- Separador -->
        <div style="border-top: 1px solid #e5e7eb; margin: 6px 0; padding-top: 6px;">
          <div style="display: flex; align-items: center; gap: 8px; font-weight: 600;">
            <div style="width: 12px; height: 12px; background: #7c3aed; border-radius: 50%;"></div>
            <span style="color: #374151;">αf(x) + βg(x) = ${combinada.toFixed(2)}</span>
          </div>
        </div>
      </div>
    `
  }

  // Actualizar posición del tooltip
  actualizarPosicion(posicion) {
    if (!this.tooltip) return
    
    const { x, y } = posicion
    const offset = 15
    
    // Calcular posición para evitar salirse de la pantalla
    const rect = this.container.getBoundingClientRect()
    const tooltipRect = this.tooltip.getBoundingClientRect()
    
    let finalX = x + offset
    let finalY = y - offset
    
    // Ajustar si se sale por la derecha
    if (finalX + tooltipRect.width > rect.right) {
      finalX = x - tooltipRect.width - offset
    }
    
    // Ajustar si se sale por arriba
    if (finalY - tooltipRect.height < rect.top) {
      finalY = y + offset
    }
    
    this.tooltip.style.left = `${finalX}px`
    this.tooltip.style.top = `${finalY}px`
  }

  // Verificar si el tooltip está visible
  estaVisible() {
    return this.tooltip && this.tooltip.style.opacity === '1'
  }

  // Obtener elemento del tooltip
  obtenerElemento() {
    return this.tooltip
  }

  // Limpiar recursos
  limpiar() {
    if (this.tooltip && this.tooltip.parentNode) {
      this.tooltip.parentNode.removeChild(this.tooltip)
    }
    this.tooltip = null
  }
}
