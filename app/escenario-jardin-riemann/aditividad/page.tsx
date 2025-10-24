"use client"

import { AditividadDemo } from "../AditividadDemo"

export default function AditividadPage() {
  return <AditividadDemo onBack={() => window.history.back()} />
}
