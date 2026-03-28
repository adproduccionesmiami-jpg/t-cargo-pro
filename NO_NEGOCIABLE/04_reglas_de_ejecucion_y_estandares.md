# 04 REGLAS DE EJECUCIÓN Y ESTÁNDARES T-CARGO-PRO (SOCIEDAD 1)

## 2. Tecnologías Permitidas
* **Backend:** Supabase.
* **Base de Datos:** PostgreSQL (Triggers obligatorios para lógica financiera).
* **Frontend:** React / Tailwind CSS (Versión Escritorio Pro).

## 4. Idioma y Estilo del Sistema
* **Idioma:** Español obligatorio.
* **Moneda Oficial:** CUP para visualización; USD solo para costo de combustible.
* **Formato Numérico:** Separador de miles y 1 o 2 decimales para limpieza visual.

## 7. Reglas de Integridad de Datos
* **Campos Calculados:** Prohibido editarlos manualmente (Km, Litros, Utilidad). Solo se actualizan mediante el Trigger.
* **No Nulls:** Campos de Millas, Tasa y Monto Bruto son obligatorios para cualquier registro.
* **Soberanía de la BD:** Si el Frontend intenta hacer un cálculo distinto al del Trigger, prevalece siempre el resultado de la Base de Datos.

## 8. Definición de Terminado (DoD)
Una funcionalidad está terminada solo si:
- La acción ejecuta correctamente en la BD.
- No genera errores en la consola del navegador.
- Los KPIs de la Sociedad 1 (50/50) coinciden con la suma manual de los viajes.
