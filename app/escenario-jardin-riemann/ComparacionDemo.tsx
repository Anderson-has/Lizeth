"use client";

import React, { useRef, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useComparacionState } from '@/src/hooks/useComparacionState';

interface ComparacionDemoProps {
    onBack?: () => void;
}

const ComparacionDemo: React.FC<ComparacionDemoProps> = ({ onBack }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { escenarioComparacion: escenarioRef, estado, actualizarEstado } = useComparacionState();

    const [limiteA, setLimiteA] = useState(estado?.limiteA ?? 0);
    const [limiteB, setLimiteB] = useState(estado?.limiteB ?? 1);
    const [funcionF, setFuncionF] = useState(estado?.funcionF ?? "x");
    const [funcionG, setFuncionG] = useState(estado?.funcionG ?? "x²");
    const [funcionesDisponibles, setFuncionesDisponibles] = useState<string[]>([]);

    useEffect(() => {
        if (escenarioRef && escenarioRef.current && canvasRef.current) {
            try {
                escenarioRef.current.configurarCanvas(canvasRef.current, document.getElementById('calculos-comparacion'));
                setFuncionesDisponibles(escenarioRef.current.obtenerDatos().gestorVisualizacion.obtenerFuncionesDisponibles());
                actualizarEstado(); // Sincronizar estado inicial
            } catch (error) {
                console.error("Error al inicializar comparación:", error);
            }
        }
    }, [escenarioRef, actualizarEstado]);

    useEffect(() => {
        if (estado) {
            setLimiteA(estado.limiteA);
            setLimiteB(estado.limiteB);
            setFuncionF(estado.funcionF);
            setFuncionG(estado.funcionG);
        }
    }, [estado]);

    const handleLimiteAChange = (value: number[]) => {
        const nuevoA = value[0];
        setLimiteA(nuevoA);
        if (escenarioRef && escenarioRef.current) {
            escenarioRef.current.actualizarLimites(nuevoA, limiteB);
            actualizarEstado();
        }
    };

    const handleLimiteBChange = (value: number[]) => {
        const nuevoB = value[0];
        setLimiteB(nuevoB);
        if (escenarioRef && escenarioRef.current) {
            escenarioRef.current.actualizarLimites(limiteA, nuevoB);
            actualizarEstado();
        }
    };

    const handleFuncionFChange = (value: string) => {
        setFuncionF(value);
        if (escenarioRef && escenarioRef.current) {
            escenarioRef.current.actualizarFunciones(value, funcionG);
            actualizarEstado();
        }
    };

    const handleFuncionGChange = (value: string) => {
        setFuncionG(value);
        if (escenarioRef && escenarioRef.current) {
            escenarioRef.current.actualizarFunciones(funcionF, value);
            actualizarEstado();
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 p-6">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-800">Propiedad de Comparación</h1>
                    {onBack && (
                        <Button onClick={onBack} variant="outline">
                            Volver al Jardín de Riemann
                        </Button>
                    )}
                </div>
                <p className="text-gray-600 mb-8">
                    Compara dos funciones y sus integrales para verificar la propiedad de comparación.
                </p>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Controles */}
                    <Card className="p-6 space-y-6">
                        <h2 className="text-xl font-semibold mb-4">Controles</h2>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Límite A: {limiteA.toFixed(1)}
                            </label>
                            <Slider
                                min={-5}
                                max={5}
                                step={0.1}
                                value={[limiteA]}
                                onValueChange={handleLimiteAChange}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Límite B: {limiteB.toFixed(1)}
                            </label>
                            <Slider
                                min={-5}
                                max={5}
                                step={0.1}
                                value={[limiteB]}
                                onValueChange={handleLimiteBChange}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Función f(x)
                            </label>
                            <Select value={funcionF} onValueChange={handleFuncionFChange}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecciona f(x)" />
                                </SelectTrigger>
                                <SelectContent>
                                    {funcionesDisponibles.map((func) => (
                                        <SelectItem key={func} value={func}>
                                            f(x) = {func}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Función g(x)
                            </label>
                            <Select value={funcionG} onValueChange={handleFuncionGChange}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecciona g(x)" />
                                </SelectTrigger>
                                <SelectContent>
                                    {funcionesDisponibles.map((func) => (
                                        <SelectItem key={func} value={func}>
                                            g(x) = {func}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Resultados */}
                        <div id="calculos-comparacion" className="mt-4"></div>

                        {/* Propiedad de Comparación */}
                        <Card className="p-4 bg-purple-50 border border-purple-200">
                            <h3 className="font-semibold text-purple-800 mb-2">Propiedad de Comparación</h3>
                            <p className="text-sm font-mono text-purple-900 mb-2">
                                Si f(x) ≤ g(x) en [a,b], entonces ∫[a→b] f(x)dx ≤ ∫[a→b] g(x)dx
                            </p>
                            <p className="text-xs text-gray-700">
                                Compara las áreas bajo las curvas para verificar la propiedad.
                            </p>
                        </Card>
                    </Card>

                    {/* Visualización */}
                    <Card className="lg:col-span-2 p-6">
                        <h2 className="text-xl font-semibold mb-4">Visualización</h2>
                        <div className="relative bg-gray-50 rounded-lg overflow-hidden">
                            <canvas
                                ref={canvasRef}
                                width={800}
                                height={500}
                                className="border border-gray-300 rounded-lg cursor-crosshair"
                                onMouseMove={(e) => {
                                    if (escenarioRef && escenarioRef.current && canvasRef.current) {
                                        // Obtener el transformador del gestor de visualización
                                        const transformador = escenarioRef.current.gestorVisualizacion?.transformador
                                        if (transformador) {
                                            escenarioRef.current.manejarHover(e, canvasRef.current, transformador)
                                        }
                                    }
                                }}
                                onMouseLeave={() => {
                                    if (escenarioRef && escenarioRef.current) {
                                        escenarioRef.current.limpiarHover()
                                    }
                                }}
                            />
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default ComparacionDemo;
