# 07 LISTA DE VERIFICACIÓN DE CALIDAD (T-Cargo Sociedad 1)

## 1. Principio Rector
Nada se entrega al cliente ni se despliega en producción sin pasar esta verificación completa. Si un solo punto falla, el sistema de la Sociedad 1 no está aprobado para su uso operativo.

## 2. Validación del Modelo de Datos Maestro
- [ ] **Coincidencia de Tablas:** Todas las tablas (`vehicles`, `trips`) coinciden exactamente con el modelo maestro definido.
- [ ] **Integridad de Campos:** No existen campos adicionales no documentados ni faltan columnas críticas para el cálculo.
- [ ] **Restricción de Nulidad:** Los campos de Millas (Inicio/Fin), Tasa de Cambio y Monto Bruto no permiten valores nulos.
- [ ] **Protección del Cerebro:** Los campos calculados por la BD (`km_total`, `fuel_liters`, `fuel_cost_cup`, `broker_fee`, `driver_fee`, `net_profit_cup`) no son editables manualmente.

## 3. Validación de Eventos y Lógica (Cerebro en BD)
- [ ] **Cálculos de Combustible:** Se verifica que la BD use el rendimiento fijo de 2.27 km/L y la conversión de 1.60934 para millas a kilómetros.
- [ ] **Comisiones Asimétricas:** Se confirma que el Broker reciba el 5% del Bruto y el Chofer el 5% del Neto post-combustible.
- [ ] **Edición Directa en Tabla:** La modificación de una celda (Millas o Tasa) dispara correctamente el recálculo en cascada de toda la fila.
- [ ] **Eliminación Protegida:** Toda acción de borrado de un viaje solicita confirmación doble obligatoria.

## 4. Validación de Permisos por Rol
- [ ] **Visibilidad de Socios:** Solo el rol Administrador puede ver los KPIs de utilidad acumulada individual de cada socio.
- [ ] **Restricción de Operador:** El operador puede registrar viajes pero tiene bloqueada la edición de campos financieros históricos o la eliminación de registros.
- [ ] **Seguridad Backend:** Se ha verificado que las restricciones de rol se apliquen en el servidor (Supabase RLS) y no solo en la interfaz.

## 5. Validación de Flujo y UX (Escritorio Pro)
- [ ] **Panel de Control:** El Dashboard muestra correctamente los 4 KPIs principales en CUP con separador de miles y 1-2 decimales.
- [ ] **Filtros Temporales:** Los filtros de "Este Mes" y "Mes Pasado" actualizan los totales de la sociedad de forma instantánea.
- [ ] **Responsive:** La interfaz es funcional y legible principalmente en resolución de escritorio, manteniendo coherencia en tablet.
- [ ] **Exportación:** El botón de exportar genera un archivo CSV con la data exacta que se visualiza en la tabla filtrada.

## 6. Validación de Seguridad y Marca
- [ ] **Datos Sensibles:** No se exponen credenciales ni logs con información privada en el frontend.
- [ ] **Consistencia Visual:** Los colores (Dark Mode / Profesional) y tipografías respetan los lineamientos de la Sociedad 1.

## 7. Prueba de Escenarios Reales
* **Escenario 1 (Creación):** Ingresar un viaje de 100 millas con combustible a 2.70 USD y tasa 515.
  * **Resultado esperado:** La BD debe reflejar ~160.93 km y el gasto de combustible exacto en CUP.
* **Escenario 2 (Edición):** Cambiar la Tasa de Cambio de un viaje guardado.
  * **Resultado esperado:** La utilidad neta del socio debe actualizarse automáticamente en el Dashboard.

## 8. Resultado Final de Calidad
- [ ] **APROBADO**
- [ ] **REQUIERE CORRECCIÓN**
- [ ] **RECHAZADO**

> **Justificación:** ______________________________________________________
