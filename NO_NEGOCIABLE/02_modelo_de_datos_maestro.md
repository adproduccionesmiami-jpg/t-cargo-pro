# 02 MODELO DE DATOS MAESTRO - T-CARGO-PRO (SOCIEDAD 1)

## 1. Principio Rector
Este modelo es la Única Fuente de Verdad. La lógica financiera reside en el motor de la base de datos (PostgreSQL/Supabase). El Frontend es "tonto": solo envía datos y renderiza resultados. Si un cálculo no está definido aquí, no existe.

## 2. Entidades Principales (Tablas del Sistema)
| Nombre de la Tabla | Propósito | Nivel |
| --- | --- | --- |
| vehicles | Almacena las placas autorizadas para el selector. | Soporte |
| trips | Registro principal de operaciones y finanzas. | Principal |
| profiles | Gestión de acceso para los Socios de la Sociedad 1. | Soporte |

## 3. Definición Técnica de Cada Tabla

**Tabla: vehicles**
Descripción: Catálogo de camiones para el selector del formulario.

| Campo | Tipo | Obligatorio | Único | Editable | Descripción |
|-------|------|-------------|-------|----------|-------------|
| id | UUID | Sí | Sí | No | ID interno |
| plate | TEXT | Sí | Sí | Sí | Placa (Ej: P170184) |

**Tabla: trips (El Corazón del Sistema)**
Descripción: Contiene los datos manuales y los campos donde el "Cerebro" escribirá los resultados.

| Campo | Tipo | Obligatorio | Editable | Descripción |
|-------|------|-------------|----------|-------------|
| id | UUID | Sí | No | ID único del viaje |
| plate_id | UUID (FK) | Sí | Sí | Relación con vehicles |
| trip_date | DATE | Sí | Sí | Fecha del viaje |
| origin / destination | TEXT | Sí | Sí | Ruta del viaje |
| mileage_start | NUMERIC | Sí | Sí | Millas iniciales |
| mileage_end | NUMERIC | Sí | Sí | Millas finales |
| fuel_price_usd | NUMERIC | Sí | Sí | Precio Litro en USD (Ej: 2.70) |
| exchange_rate | NUMERIC | Sí | Sí | Tasa USD-CUP (Ej: 515) |
| amount_bruto_cup | NUMERIC | Sí | Sí | Pago total del cliente en CUP |
| notes | TEXT | No | Sí | Comentarios del viaje |
| status | TEXT | Sí | Sí | Estado del viaje |
| km_total | NUMERIC | No | No (BD) | Cálculo: (End-Start) * 1.609 |
| fuel_liters | NUMERIC | No | No (BD) | Cálculo: Km / 2.27 |
| fuel_cost_cup | NUMERIC | No | No (BD) | Cálculo: Liters * (Price_USD * Rate) |
| broker_fee_cup | NUMERIC | No | No (BD) | 5% del Bruto |
| driver_fee_cup | NUMERIC | No | No (BD) | 5% del (Bruto - Combustible) |
| net_profit_cup | NUMERIC | No | No (BD) | Bruto - Combustible - Broker - Driver |

## 4. Enumeraciones Oficiales del Sistema
**Estados permitidos (status):**
- Programado
- En Curso
- Completado

**Roles permitidos:**
- Socio (Acceso total a KPIs)
- Operador (Solo lectura/escritura de viajes, sin ver utilidad de socios)

## 5. Reglas de Integridad Globales
- **Formato Numérico:** Todos los montos en CUP con máximo 2 decimales.
- **Consumo Fijo:** El factor de rendimiento es 2.27 km/L inamovible en el Trigger.
- **Conversión:** Factor de millas a km es 1.60934.
- **Edición:** Al editar millas o tasa en la tabla, se dispara el recálculo automático de toda la fila.

## 6. Campos Calculados (El "Cerebro" en PostgreSQL)
| Campo | Tabla | Fórmula Lógica (Trigger BEFORE INSERT OR UPDATE) |
| --- | --- | --- |
| km_total | trips | (mileage_end - mileage_start) * 1.60934 |
| fuel_liters | trips | km_total / 2.27 |
| fuel_cost | trips | fuel_liters * (fuel_price_usd * exchange_rate) |
| broker_fee | trips | amount_bruto_cup * 0.05 |
| driver_fee | trips | (amount_bruto_cup - fuel_cost) * 0.05 |
| profit | trips | amount_bruto_cup - fuel_cost - broker_fee - driver_fee |

## 9. Migración de Datos
* **Origen:** Datos actuales en la tabla `trips` de la Sociedad 1.
* **Estrategia:** Limpieza de columnas viejas y ejecución de un Backfill masivo para que el nuevo Trigger calcule los valores estáticos de los viajes reales que quedaron.

## 10. Estado del Documento
- [x] **APROBADO**

## 11. Resumen Técnico para SaaS Factory
Esquema optimizado para Supabase centrado en una tabla `trips` altamente automatizada vía Triggers. Se requiere la creación de una función en PL/pgSQL que gestione la aritmética financiera asimétrica (5% Bruto vs 5% Neto) y la lógica de combustible (2.27 km/L). El Frontend debe conectar mediante una suscripción en tiempo real o refresco tras actualización para reflejar los cálculos del backend inmediatamente.
