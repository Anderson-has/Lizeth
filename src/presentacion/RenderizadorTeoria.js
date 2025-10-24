/**
 * RENDERIZADOR: RenderizadorTeoria
 * RESPONSABILIDAD: Renderizar contenido teórico en el DOM
 * SRP: Solo maneja la presentación visual de teoría, no almacena datos ni realiza cálculos
 */
export class RenderizadorTeoria {
  constructor(contenedor) {
    this.contenedor = contenedor
  }

  renderizarTeoria(teoria) {
    if (!teoria || !this.contenedor) return

    const html = this.generarHTMLTeoria(teoria)
    this.contenedor.innerHTML = html
  }

  generarHTMLTeoria(teoria) {
    return `
      <div class="teoria-container">
        <h2 class="text-2xl font-bold mb-4 text-green-800">${teoria.titulo}</h2>
        
        <div class="mb-6">
          <h3 class="text-lg font-semibold mb-2 text-gray-800">Definición</h3>
          <p class="text-gray-700 mb-4">${teoria.definicion}</p>
        </div>

        <div class="mb-6">
          <h3 class="text-lg font-semibold mb-2 text-gray-800">Fórmula</h3>
          <div class="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <code class="text-lg font-mono text-blue-800">${teoria.formula}</code>
          </div>
        </div>

        ${teoria.simbolos ? this.renderizarSimbolos(teoria.simbolos) : ''}
        ${teoria.condiciones ? this.renderizarCondiciones(teoria.condiciones) : ''}
        ${teoria.interpretacionGeometrica ? this.renderizarInterpretacion(teoria.interpretacionGeometrica) : ''}
        ${teoria.aplicaciones ? this.renderizarAplicaciones(teoria.aplicaciones) : ''}
        ${teoria.ejemplo ? this.renderizarEjemplo(teoria.ejemplo) : ''}
        ${teoria.ventajas ? this.renderizarVentajas(teoria.ventajas) : ''}
        ${teoria.limitaciones ? this.renderizarLimitaciones(teoria.limitaciones) : ''}
      </div>
    `
  }

  renderizarSimbolos(simbolos) {
    const simbolosHTML = Object.entries(simbolos)
      .map(([simbolo, descripcion]) => 
        `<div class="flex justify-between py-1 border-b border-gray-200">
          <code class="font-mono text-blue-600">${simbolo}</code>
          <span class="text-gray-700">${descripcion}</span>
        </div>`
      ).join('')

    return `
      <div class="mb-6">
        <h3 class="text-lg font-semibold mb-2 text-gray-800">Símbolos</h3>
        <div class="bg-gray-50 p-4 rounded-lg">
          ${simbolosHTML}
        </div>
      </div>
    `
  }

  renderizarCondiciones(condiciones) {
    const condicionesHTML = condiciones
      .map(condicion => `<li class="text-gray-700 mb-1">• ${condicion}</li>`)
      .join('')

    return `
      <div class="mb-6">
        <h3 class="text-lg font-semibold mb-2 text-gray-800">Condiciones</h3>
        <ul class="list-none">
          ${condicionesHTML}
        </ul>
      </div>
    `
  }

  renderizarInterpretacion(interpretacion) {
    return `
      <div class="mb-6">
        <h3 class="text-lg font-semibold mb-2 text-gray-800">Interpretación Geométrica</h3>
        <p class="text-gray-700 bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          ${interpretacion}
        </p>
      </div>
    `
  }

  renderizarAplicaciones(aplicaciones) {
    const aplicacionesHTML = aplicaciones
      .map(aplicacion => `<li class="text-gray-700 mb-1">• ${aplicacion}</li>`)
      .join('')

    return `
      <div class="mb-6">
        <h3 class="text-lg font-semibold mb-2 text-gray-800">Aplicaciones</h3>
        <ul class="list-none">
          ${aplicacionesHTML}
        </ul>
      </div>
    `
  }

  renderizarEjemplo(ejemplo) {
    return `
      <div class="mb-6">
        <h3 class="text-lg font-semibold mb-2 text-gray-800">Ejemplo</h3>
        <div class="bg-green-50 p-4 rounded-lg border border-green-200">
          <p class="text-gray-700 mb-2"><strong>Función:</strong> ${ejemplo.funcion || ejemplo.funcion1}</p>
          <p class="text-gray-700 mb-2"><strong>Intervalo:</strong> [${ejemplo.intervalo.inicio}, ${ejemplo.intervalo.fin}]</p>
          <p class="text-gray-700 mb-2"><strong>Resultado:</strong> ${ejemplo.resultado}</p>
        </div>
      </div>
    `
  }

  renderizarVentajas(ventajas) {
    const ventajasHTML = ventajas
      .map(ventaja => `<li class="text-green-700 mb-1">✓ ${ventaja}</li>`)
      .join('')

    return `
      <div class="mb-6">
        <h3 class="text-lg font-semibold mb-2 text-gray-800">Ventajas</h3>
        <ul class="list-none">
          ${ventajasHTML}
        </ul>
      </div>
    `
  }

  renderizarLimitaciones(limitaciones) {
    const limitacionesHTML = limitaciones
      .map(limitacion => `<li class="text-red-700 mb-1">⚠ ${limitacion}</li>`)
      .join('')

    return `
      <div class="mb-6">
        <h3 class="text-lg font-semibold mb-2 text-gray-800">Limitaciones</h3>
        <ul class="list-none">
          ${limitacionesHTML}
        </ul>
      </div>
    `
  }

  renderizarEjemploCompleto(ejemplo) {
    if (!ejemplo) return ''

    return `
      <div class="ejemplo-container bg-white p-6 rounded-lg border border-gray-200">
        <h3 class="text-xl font-bold mb-4 text-blue-800">${ejemplo.titulo}</h3>
        
        ${ejemplo.funcion ? `<p class="mb-2"><strong>Función:</strong> ${ejemplo.funcion}</p>` : ''}
        ${ejemplo.intervalo ? `<p class="mb-2"><strong>Intervalo:</strong> [${ejemplo.intervalo.inicio}, ${ejemplo.intervalo.fin}]</p>` : ''}
        ${ejemplo.particiones ? `<p class="mb-2"><strong>Particiones:</strong> ${ejemplo.particiones}</p>` : ''}
        ${ejemplo.tipoAproximacion ? `<p class="mb-2"><strong>Tipo:</strong> ${ejemplo.tipoAproximacion}</p>` : ''}
        
        ${ejemplo.pasos ? this.renderizarPasos(ejemplo.pasos) : ''}
        ${ejemplo.calculos ? this.renderizarCalculos(ejemplo.calculos) : ''}
        ${ejemplo.verificacion ? `<p class="mt-4 text-green-700 font-semibold">${ejemplo.verificacion}</p>` : ''}
        ${ejemplo.resultado ? `<p class="mt-2 text-blue-700 font-semibold">${ejemplo.resultado}</p>` : ''}
      </div>
    `
  }

  renderizarPasos(pasos) {
    const pasosHTML = pasos
      .map((paso, index) => `<li class="text-gray-700 mb-2">${index + 1}. ${paso}</li>`)
      .join('')

    return `
      <div class="mt-4">
        <h4 class="font-semibold mb-2 text-gray-800">Pasos:</h4>
        <ol class="list-decimal list-inside">
          ${pasosHTML}
        </ol>
      </div>
    `
  }

  renderizarCalculos(calculos) {
    const calculosHTML = Object.entries(calculos)
      .map(([nombre, valor]) => 
        `<div class="flex justify-between py-1 border-b border-gray-200">
          <span class="text-gray-700">${nombre}:</span>
          <code class="font-mono text-blue-600">${valor}</code>
        </div>`
      ).join('')

    return `
      <div class="mt-4">
        <h4 class="font-semibold mb-2 text-gray-800">Cálculos:</h4>
        <div class="bg-gray-50 p-4 rounded-lg">
          ${calculosHTML}
        </div>
      </div>
    `
  }
}
