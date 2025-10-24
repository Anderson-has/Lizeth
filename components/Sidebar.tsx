"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, TrendingUp, Award, Sparkles } from "lucide-react"

export function Sidebar() {
  const pathname = usePathname()

  const menuItems = [
    {
      id: "inicio",
      titulo: "Inicio",
      descripcion: "Dashboard principal",
      ruta: "/",
      icono: Home,
    },
    {
      id: "jardin-riemann",
      titulo: "Jardín de Riemann",
      descripcion: "Integrales de Riemann y propiedades",
      ruta: "/escenario-jardin-riemann",
      icono: Sparkles,
    },
    {
      id: "puente-teorema",
      titulo: "Puente del Teorema Fundamental",
      descripcion: "Primer y segundo teorema fundamental del cálculo",
      ruta: "/escenario-puente-teorema",
      icono: TrendingUp,
    },
    {
      id: "torre-valor-medio",
      titulo: "Torre del Valor Medio",
      descripcion: "Teorema del valor medio para integrales",
      ruta: "/escenario-torre-valor-medio",
      icono: Award,
    },
  ]

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen p-4 flex flex-col">
      {/* Logo */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-lg flex items-center justify-center">
            <span className="text-white text-xl font-bold">∫</span>
          </div>
          <div>
            <h2 className="font-bold text-gray-800">IntegraLearn</h2>
            <p className="text-xs text-gray-500">Estudiante</p>
          </div>
        </div>
      </div>

      {/* Perfil */}
      <div className="mb-6 p-3 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
            E
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-800">Estudiante</p>
            <p className="text-xs text-gray-500">Matemáticas II</p>
          </div>
        </div>
      </div>

      {/* Menú de navegación */}
      <div className="flex-1">
        <h3 className="text-xs font-semibold text-gray-500 uppercase mb-3">Escenarios de Aprendizaje</h3>
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icono = item.icono
            const isActive = pathname === item.ruta
            return (
              <Link
                key={item.id}
                href={item.ruta}
                className={`flex items-start gap-3 p-3 rounded-lg transition-colors ${
                  isActive ? "bg-blue-50 border-2 border-blue-500" : "hover:bg-gray-50"
                }`}
              >
                <Icono className={`w-5 h-5 mt-0.5 ${isActive ? "text-blue-600" : "text-gray-600"}`} />
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium ${isActive ? "text-blue-600" : "text-gray-800"}`}>{item.titulo}</p>
                  <p className="text-xs text-gray-500 line-clamp-2">{item.descripcion}</p>
                </div>
              </Link>
            )
          })}
        </nav>
      </div>
    </aside>
  )
}
