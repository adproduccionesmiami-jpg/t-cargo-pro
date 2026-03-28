# 01 MAPA DEL CLIENTE - T-CARGO-PRO (SOCIEDAD 1)

## 1. Identificación del Proyecto
* **Nombre del cliente:** Alain
* **Nombre del proyecto:** T-Cargo 2.0 (Sociedad 1)
* **Fecha de inicio:** 22 de marzo de 2026
* **Responsable del proyecto:** Alain / Gemini AI
* **Versión del documento:** 2.0 (Reconstrucción desde cero)

## 2. North Star (Resultado Singular Deseado)
Lograr una plataforma de gestión financiera donde la Base de Datos (PostgreSQL) sea el único cerebro y fuente de verdad, permitiendo a los socios de la Sociedad 1 visualizar utilidades netas reales, calculadas automáticamente a partir de entradas manuales de kilometraje y costos, sin discrepancias matemáticas entre el historial y el presente.

## 3. Problema Real a Resolver
* **Problema principal:** Inconsistencia de datos y cálculos financieros volátiles que dependían del Frontend o de lógicas automáticas mal aplicadas al historial.
* **Problemas secundarios:** Recálculo erróneo de comisiones en viajes pasados; dificultad para registrar combustible en USD con tasas de cambio fluctuantes en CUP.
* **Consecuencias actuales:** Desconfianza en los KPIs del Dashboard y pérdida de tiempo auditando manualmente cada viaje.
* **Impacto económico/operativo:** Riesgo de reparto incorrecto de utilidades entre socios y falta de claridad en el costo real del combustible por viaje.

## 4. Alcance del MVP (Fase 1)
**Incluye:**
- [x] Gestión de Camiones: Selector de placa (P170184 y otros).
- [x] Registro de Viajes: Entrada de millas, precio combustible (USD), tasa (CUP) y monto bruto.
- [x] Cerebro en BD: Cálculo automático de Km (1.609), litros (rendimiento 2.27 km/L) y gasto total en CUP.
- [x] Dashboard Pro: KPIs de Ingreso Bruto, Utilidad Neta y acumulados individuales (Socio A / Socio B).

**No incluye (Explícitamente fuera de alcance):**
- [ ] Gestión de nómina compleja de choferes fuera de la comisión del 5%.
- [ ] Mantenimiento preventivo o inventario de piezas en esta fase.

## 5. Fuente de Verdad Actual
¿Dónde viven hoy los datos?
- [x] Base de datos (Supabase / PostgreSQL)
- [ ] No existe estructura formal (Estamos saneando la estructura anterior)

**Descripción:** Los datos residen en Supabase, pero requieren una reestructuración total para que la lógica de cálculo pase del código a triggers de base de datos.

## 6. Integraciones Necesarias
| Servicio | ¿Se usará? | ¿API disponible? | Estado de credenciales |
| :--- | :--- | :--- | :--- |
| Supabase | Sí | Sí | Lista (Producción) |
| Vercel | Sí | Sí | Lista (Deployment) |
| Export CSV | Sí | Sí | Pendiente de implementar |

## 7. Tipos de Usuario del Sistema
| Rol | Qué puede ver | Qué puede hacer | Restricciones |
| :--- | :--- | :--- | :--- |
| Admin (Socios) | Todo el Dashboard y registros | Crear, editar (en tabla) y borrar viajes; exportar CSV | Ninguna |
| Operador | Lista de viajes | Registrar millas y rutas | No ve utilidades de socios |

## 8. Reglas de Negocio No Negociables
* **Regla 1:** La comisión del Broker es siempre el 5% del Bruto (CUP).
* **Regla 2:** La comisión del Chofer es el 5% del Neto (Bruto - Combustible) en CUP.
* **Regla 3:** El rendimiento del camión es fijo a 2.27 km por litro para el cálculo de combustible.

## 9. Restricciones Técnicas o de Marca
* **Idioma obligatorio:** Español.
* **Estética obligatoria:** Interfaz de escritorio profesional (Dark Mode preferido), legible, con edición directa en tabla.
* **Lógica que no puede modificarse:** La conversión de millas a km es 1.60934.
* **Procesos manuales:** La tasa de cambio y el precio del litro USD deben ser introducidos manualmente por el usuario.

## 10. Criterio de Éxito Medible
* **Métrica 1:** El 100% de los viajes registrados muestran una utilidad neta que coincide con la suma manual de los socios.
* **Métrica 2:** Cero errores de "recálculo" en viajes de fechas anteriores al día en curso.
* **Métrica 3:** Tiempo de registro de un viaje nuevo menor a 1 minuto desde el panel lateral.

## 11. Estado del Documento
- [x] **LISTO PARA PASAR A DISEÑO ESTRUCTURAL**

## 12. Resumen para SaaS Factory
Sistema de gestión financiera para transporte de carga (Sociedad 1). El núcleo es una base de datos PostgreSQL que centraliza toda la aritmética: convierte millas a km, deduce litros consumidos (rendimiento 2.27) y aplica comisiones asimétricas (Broker 5% Bruto / Chofer 5% Neto). La interfaz es de escritorio, profesional y permite edición directa sobre una tabla operativa. El objetivo es transparencia total en el reparto de utilidades 50/50 entre dos socios, operando visualmente en CUP pero calculando costos de combustible basados en USD y tasas de cambio manuales.
