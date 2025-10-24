"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Sparkles, CheckCircle2, XCircle, BookOpen } from "lucide-react"
import Link from "next/link"
import { FuncionMatematica } from "@/src/entidades/FuncionMatematica"
import { Antiderivada } from "@/src/entidades/Antiderivada"
import { CalculadoraAntiderivadas } from "@/src/servicios/CalculadoraAntiderivadas"

export default function EscenarioCristalAntiderivadas() {
  const [calculadora] = useState(() => new CalculadoraAntiderivadas())
  const [funcionSeleccionada, setFuncionSeleccionada] = useState<string>("x^2")
  const [antiderivada, setAntiderivada] = useState<Antiderivada | null>(null)
  const [resultado, setResultado] = useState<any>(null)
  const [constante, setConstante] = useState(0)

  // Funciones predefinidas para practicar
  const funcionesPractica = [
    { expresion: "x^2", evaluar: (x: number) => x * x, nombre: "x²" },
    { expresion: "x^3", evaluar: (x: number) => x * x * x, nombre: "x³" },
    { expresion: "x^4", evaluar: (x: number) => Math.pow(x, 4), nombre: "x⁴" },
    { expresion: "sin(x)", evaluar: (x: number) => Math.sin(x), nombre: "sin(x)" },
    { expresion: "cos(x)", evaluar: (x: number) => Math.cos(x), nombre: "cos(x)" },
    { expresion: "e^x", evaluar: (x: number) => Math.exp(x), nombre: "eˣ" },
    { expresion: "1/x", evaluar: (x: number) => 1 / x, nombre: "1/x" },
  ]

  const calcularAntiderivada = () => {
    const funcionData = funcionesPractica.find((f) => f.expresion === funcionSeleccionada)
    if (!funcionData) return

    const funcion = new FuncionMatematica(funcionData.expresion, funcionData.evaluar)
    const anti = new Antiderivada(funcion, null as any, constante)

    // Calcular antiderivada
    const funcionAntiderivada = calculadora.calcularAntiderivada(anti)

    // Verificar
    const verificacion = calculadora.verificarAntiderivada(anti, funcionAntiderivada)

    setAntiderivada(anti)
    setResultado({
      funcionAntiderivada,
      verificacion,
      pasos: anti.pasos,
      regla: anti.reglaUtilizada,
    })
  }

  const calcularIntegralDefinida = () => {
    if (!resultado || !antiderivada) return

    const a = 0
    const b = 2
    const integral = calculadora.calcularIntegralDefinida(antiderivada, a, b, resultado.funcionAntiderivada)

    setResultado({
      ...resultado,
      integralDefinida: integral,
      limites: { a, b },
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-blue-50 p-6">
      <div className="max-width mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver
              </Button>
            </Link>
            <h1 className="text-4xl font-bold text-cyan-900 mt-2">Cristal de Antiderivadas</h1>
            <p className="text-gray-600 mt-2">Descubre las antiderivadas y verifica tu trabajo</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Panel de cálculo */}
          <Card>
            <CardHeader>
              <CardTitle>Calcular Antiderivada</CardTitle>
              <CardDescription>Selecciona una función y encuentra su antiderivada</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Selección de función */}
              <div>
                <label className="text-sm font-medium mb-2 block">Función f(x)</label>
                <div className="grid grid-cols-3 gap-2">
                  {funcionesPractica.map((f) => (
                    <Button
                      key={f.expresion}
                      variant={funcionSeleccionada === f.expresion ? "default" : "outline"}
                      onClick={() => setFuncionSeleccionada(f.expresion)}
                      className="h-12"
                    >
                      {f.nombre}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Constante de integración */}
              <div>
                <label className="text-sm font-medium mb-2 block">Constante de integración (C)</label>
                <Input
                  type="number"
                  value={constante}
                  onChange={(e) => setConstante(Number.parseFloat(e.target.value) || 0)}
                  placeholder="0"
                />
              </div>

              <Button onClick={calcularAntiderivada} className="w-full" size="lg">
                <Sparkles className="mr-2 h-5 w-5" />
                Calcular Antiderivada
              </Button>

              {/* Mostrar función seleccionada */}
              <div className="bg-cyan-50 p-4 rounded-lg">
                <p className="text-sm font-medium text-cyan-900 mb-1">Función a integrar:</p>
                <p className="text-2xl font-bold text-cyan-700">
                  ∫ {funcionesPractica.find((f) => f.expresion === funcionSeleccionada)?.nombre} dx
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Panel de reglas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Reglas de Integración
              </CardTitle>
              <CardDescription>Fórmulas básicas para calcular antiderivadas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="font-medium text-blue-900">Regla de la Potencia</p>
                  <p className="text-sm text-blue-700 mt-1">∫ xⁿ dx = xⁿ⁺¹/(n+1) + C (n ≠ -1)</p>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg">
                  <p className="font-medium text-purple-900">Regla Exponencial</p>
                  <p className="text-sm text-purple-700 mt-1">∫ eˣ dx = eˣ + C</p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <p className="font-medium text-green-900">Regla Trigonométrica</p>
                  <p className="text-sm text-green-700 mt-1">∫ sin(x) dx = -cos(x) + C</p>
                  <p className="text-sm text-green-700 mt-1">∫ cos(x) dx = sin(x) + C</p>
                </div>
                <div className="p-3 bg-amber-50 rounded-lg">
                  <p className="font-medium text-amber-900">Regla Logarítmica</p>
                  <p className="text-sm text-amber-700 mt-1">∫ 1/x dx = ln|x| + C</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Resultados */}
        {resultado && (
          <Card className={resultado.verificacion?.esVerificada ? "border-green-500" : "border-red-500"}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {resultado.verificacion?.esVerificada ? (
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-500" />
                )}
                Resultado
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Antiderivada */}
              <div className="bg-gradient-to-r from-cyan-50 to-blue-50 p-6 rounded-lg">
                <p className="text-sm font-medium text-gray-600 mb-2">Antiderivada F(x):</p>
                <p className="text-3xl font-bold text-cyan-700">
                  {resultado.funcionAntiderivada?.expresion}
                  {constante !== 0 && ` + ${constante}`}
                </p>
              </div>

              {/* Regla utilizada */}
              {resultado.regla && (
                <div>
                  <Badge variant="secondary" className="text-sm">
                    Regla utilizada: {resultado.regla}
                  </Badge>
                </div>
              )}

              {/* Pasos */}
              {resultado.pasos && resultado.pasos.length > 0 && (
                <div>
                  <p className="text-sm font-medium mb-2">Pasos de integración:</p>
                  <div className="space-y-2">
                    {resultado.pasos.map((paso: any, index: number) => (
                      <div key={index} className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600">{paso.descripcion}</p>
                        <p className="text-sm font-mono mt-1">{paso.expresion}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Verificación */}
              <div className="border-t pt-4">
                <p className="text-sm font-medium mb-2">Verificación (derivando F(x)):</p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-600">Error promedio</p>
                    <p className="text-lg font-bold">{resultado.verificacion?.errorPromedio?.toFixed(6)}</p>
                  </div>
                  <div>
                    <Badge variant={resultado.verificacion?.esVerificada ? "default" : "destructive"}>
                      {resultado.verificacion?.esVerificada ? "Verificado ✓" : "Error en verificación"}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Calcular integral definida */}
              {!resultado.integralDefinida && (
                <Button onClick={calcularIntegralDefinida} variant="outline" className="w-full bg-transparent">
                  Calcular ∫[0,2] f(x)dx usando esta antiderivada
                </Button>
              )}

              {/* Resultado de integral definida */}
              {resultado.integralDefinida !== undefined && (
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm font-medium text-green-900 mb-2">Integral Definida:</p>
                  <p className="text-xl font-bold text-green-700">
                    ∫[{resultado.limites.a},{resultado.limites.b}] f(x)dx = {resultado.integralDefinida.toFixed(4)}
                  </p>
                  <p className="text-sm text-green-600 mt-2">
                    Calculado usando: F({resultado.limites.b}) - F({resultado.limites.a})
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
