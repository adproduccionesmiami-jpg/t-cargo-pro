# 06 MATRIZ DE RIESGOS Y CONTROLES T-CARGO-PRO

## 1. Riesgos Identificados
* **R1 (Técnico):** Eliminación accidental o inconsistencia en cálculos financieros. **Severidad: Crítica.**
* **R2 (Seguridad):** Acceso de operadores a utilidades privadas de los socios. **Severidad: Alta.**

## 2. Controles Críticos (Bloquean Proyecto)
* Falta de validación de roles en el backend para acciones de "Eliminar".
* Campos financieros editables sin control del Trigger.
* Desalineación con la regla de rendimiento fijo (2.27 km/L).

## 3. Semáforo Global
**ESTADO:** 🟢 **VERDE** (Aplica estrictamente solo si se implementan los Triggers y Row Level Security / RLS en la Base de Datos).
