"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp, Info } from "lucide-react"

export default function ExplicacionTooltip() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Card className="mb-4 border-blue-200 bg-blue-50">
      <CardHeader 
        className="cursor-pointer" 
        onClick={() => setIsOpen(!isOpen)}
      >
        <CardTitle className="flex items-center justify-between text-blue-800">
          <div className="flex items-center gap-2">
            <Info className="w-5 h-5" />
            ¿Cómo funciona el tooltip?
          </div>
          {isOpen ? (
            <ChevronUp className="w-5 h-5" />
          ) : (
            <ChevronDown className="w-5 h-5" />
          )}
        </CardTitle>
      </CardHeader>
      
      {isOpen && (
        <CardContent className="pt-0">
          <div className="space-y-3 text-sm text-blue-700">
            <div>
              <strong>🎯 ¿Qué hace el tooltip?</strong>
              <p className="mt-1">
                Cuando mueves el mouse sobre el gráfico, el tooltip muestra los valores 
                de las funciones en ese punto exacto.
              </p>
            </div>
            
            <div>
              <strong>📊 ¿Qué calcula?</strong>
              <p className="mt-1">
                <strong>NO</strong> calcula cualquier punto del plano. Solo calcula 
                los valores de las líneas que están dibujadas en el gráfico.
              </p>
            </div>
            
            <div>
              <strong>🔢 Ejemplo:</strong>
              <p className="mt-1">
                Si el mouse está en x = 1.94, el tooltip muestra:
              </p>
              <ul className="mt-2 ml-4 space-y-1">
                <li>• <span className="text-blue-600">f(x) = 1.94</span> (línea azul)</li>
                <li>• <span className="text-green-600">g(x) = 3.76</span> (línea verde)</li>
                <li>• <span className="text-purple-600">αf(x) = 2 × 1.94 = 3.88</span></li>
                <li>• <span className="text-orange-600">βg(x) = 1 × 3.76 = 3.76</span></li>
                <li>• <span className="text-purple-800">αf(x) + βg(x) = 7.64</span></li>
              </ul>
            </div>
            
            <div>
              <strong>✨ ¿Por qué es útil?</strong>
              <p className="mt-1">
                Te ayuda a entender cómo se comportan las funciones en puntos específicos 
                y cómo se combinan para formar la combinación lineal.
              </p>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  )
}
