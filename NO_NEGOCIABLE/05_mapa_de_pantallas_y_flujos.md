# 05 MAPA DE PANTALLAS Y FLUJOS T-CARGO-PRO

## 1. Mapa General del Sistema
* **Login:** Autenticación obligatoria.
* **Dashboard Pro:** Panel principal con KPIs y Tabla Operativa.
* **Panel Lateral:** Formulario para "Crear Operación" (Nuevo Viaje).

## 2. Detalle por Pantalla

**Pantalla: Dashboard Pro**
* **Objetivo:** Visualización operativa y financiera de la Sociedad 1.
* **KPIs Visibles (CUP):** Ingreso Bruto Total, Utilidad Neta Sociedad, Acumulado Socio A, Acumulado Socio B.
* **Acciones:** Filtrar por fecha (Este mes / Mes pasado), edición directa de celdas y exportación a CSV.

**Pantalla: Nuevo Viaje (Panel Lateral)**
* **Objetivo:** Registrar nuevo viaje con datos manuales.
* **Campos Obligatorios:** Selector de Placa, Millas (Inicio/Fin), Precio Fuel (USD), Tasa (CUP), Monto Bruto.
* **Resultado:** Registro guardado en tabla `trips` con actualización automática del Dashboard.

## 3. Permisos por Rol
| Pantalla / Acción | Administrador (Socio) | Operador |
| ----------------- | --------------------- | -------- |
| Dashboard | Ver/Editar Todo / KPIs Socios | Ver Lista / Editar Logística |
| Crear Operación | Sí | Sí |
| Eliminar Viaje | Sí (Confirmación Doble) | No |
