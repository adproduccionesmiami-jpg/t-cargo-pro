# 03 MATRIZ DE EVENTOS A DATOS - T-CARGO-PRO (SOCIEDAD 1)

## 1. Principio Rector
Toda acción visible en la interfaz de escritorio debe afectar una tabla específica, modificar campos definidos y, sobre todo, disparar los cálculos automáticos en la base de datos (Km, Combustible, Comisiones).

## 2. Matriz Global de Eventos (Operaciones Pro)
*(Pendiente de desglose detallado o estructurado en documento AD-8)*

## 3. Tipos de Operación Permitidos
* **INSERT:** Crear nuevos viajes.
* **UPDATE PARCIAL:** Edición directa en tabla para corregir datos manuales.
* **DELETE:** Eliminar registros (Solo Administrador).
* **SELECT:** Consulta de datos para el Dashboard y exportación CSV.

## 4. Eventos Críticos (Alta Sensibilidad)
*(Pendiente de desglose detallado o estructurado en documento AD-8)*

## 5. Eventos que Disparan Recálculos (El Cerebro)
*(Pendiente de desglose detallado o estructurado en documento AD-8)*

## 6. Restricciones de Seguridad por Evento
* **Solo Administrador (Socios):** Pueden eliminar registros y editar campos financieros históricos.
* **Edición Protegida:** No se permite alterar manualmente los campos calculados por la BD (`fuel_liters`, `net_profit`, etc.); solo se modifican alterando sus valores de origen.

## 7. Resumen Técnico para SaaS Factory
Este documento elimina cualquier ambigüedad en la capa lógica. Define que el sistema debe reaccionar a cambios en las "Millas" o la "Tasa" recalculando en cascada toda la salud financiera del viaje. Se prohíbe la modificación manual de resultados finales; el usuario solo interactúa con datos de entrada.
