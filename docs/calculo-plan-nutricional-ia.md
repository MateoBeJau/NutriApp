# Cálculo del Plan Nutricional con IA

## Proceso de Generación

### 1. **Datos de Entrada**
La IA recibe la siguiente información del paciente:

#### Datos Básicos
- Nombre y apellido
- Edad
- Sexo (M/F)
- Altura (cm)

#### Perfil Médico
- **Gustos alimentarios**: Alimentos que prefiere
- **Disgustos**: Alimentos que no le gustan
- **Alergias**: Alimentos a los que es alérgico
- **Enfermedades**: Condiciones médicas (diabetes, hipertensión, etc.)
- **Medicamentos**: Fármacos que toma
- **Restricciones dietéticas**: Limitaciones alimentarias
- **Objetivos**: Meta principal (bajar de peso, ganar masa muscular, etc.)

#### Mediciones
- **Peso actual** (kg)
- **IMC** (calculado automáticamente)
- **Historial de peso**: Últimas 10 mediciones

### 2. **Cálculo de Objetivos Nutricionales**

La IA calcula los objetivos basándose en:

#### Cálculo de Calorías
- **Fórmula base**: TMB (Tasa Metabólica Basal) usando la ecuación de Mifflin-St Jeor
- **Factor de actividad**: Sedentario (1.2), ligero (1.375), moderado (1.55), intenso (1.725)
- **Ajuste por objetivo**:
  - Pérdida de peso: -500 a -1000 calorías/día
  - Mantenimiento: sin ajuste
  - Ganancia de peso: +300 a +500 calorías/día

#### Distribución de Macronutrientes
- **Proteínas**: 15-25% del total calórico (1.2-2.2g/kg peso)
- **Carbohidratos**: 45-65% del total calórico
- **Grasas**: 20-35% del total calórico

#### Ajustes por Condiciones Médicas
- **Diabetes**: Control de carbohidratos, índice glucémico bajo
- **Hipertensión**: Reducción de sodio
- **Dislipidemia**: Control de grasas saturadas
- **Obesidad**: Déficit calórico moderado

### 3. **Generación de Comidas**

#### Estructura del Plan
- **6 comidas diarias**:
  1. Desayuno (25% calorías)
  2. Media mañana (10% calorías)
  3. Almuerzo (30% calorías)
  4. Merienda (10% calorías)
  5. Cena (20% calorías)
  6. Colación nocturna (5% calorías)

#### Selección de Alimentos
- **Considera preferencias**: Prioriza alimentos que le gustan
- **Evita disgustos**: Excluye alimentos que no le gustan
- **Respeta alergias**: Elimina alérgenos
- **Adapta a restricciones**: Ajusta a restricciones dietéticas

#### Información Nutricional
- **Cantidades precisas**: En gramos o unidades
- **Valores por 100g**: Calorías, proteínas, carbohidratos, grasas
- **Instrucciones de preparación**: Cómo cocinar cada alimento
- **Cálculo automático**: Totales nutricionales por comida

### 4. **Validación y Ajustes**

#### Verificaciones Automáticas
- ✅ Total calórico coincide con objetivo
- ✅ Distribución de macronutrientes es correcta
- ✅ No hay alérgenos en los alimentos
- ✅ Cantidades son realistas
- ✅ Preparaciones son factibles

#### Consideraciones Especiales
- **Hidratación**: Recomendaciones de agua
- **Suplementos**: Si es necesario
- **Frecuencia de comidas**: Cada 2-3 horas
- **Horarios**: Adaptados al estilo de vida

## Ejemplo de Cálculo

### Paciente: Diego Maradona
- **Edad**: 32 años
- **Sexo**: Masculino
- **Altura**: 168 cm
- **Peso**: 90 kg
- **IMC**: 31.8 (obesidad grado I)
- **Objetivo**: Bajar de peso

### Cálculo de Calorías
1. **TMB**: 1798 calorías (Mifflin-St Jeor)
2. **Factor actividad**: 1.375 (ligero)
3. **Gasto energético**: 2472 calorías
4. **Déficit para pérdida**: -500 calorías
5. **Objetivo final**: 1972 calorías → **2200 calorías** (ajustado)

### Distribución de Macronutrientes
- **Proteínas**: 110g (20% = 440 cal)
- **Carbohidratos**: 275g (50% = 1100 cal)
- **Grasas**: 70g (30% = 630 cal)
- **Total**: 2170 calorías

### Adaptaciones por Condiciones
- **Diabetes**: Carbohidratos de bajo índice glucémico
- **Alergia a mariscos**: Evitados completamente
- **Disgusto por verduras**: Alternativas incluidas
- **Preferencia por carnes**: Priorizadas en el plan

## Personalización por el Nutricionista

El nutricionista puede ajustar:
- **Objetivos calóricos**: Aumentar o disminuir
- **Distribución de macronutrientes**: Cambiar porcentajes
- **Alimentos específicos**: Reemplazar o modificar cantidades
- **Horarios de comidas**: Ajustar según preferencias
- **Preparaciones**: Cambiar métodos de cocción
- **Frecuencia**: Modificar número de comidas

## Validación Final

Antes de aprobar el plan, verificar:
- ✅ Objetivos nutricionales son realistas
- ✅ Alimentos son accesibles para el paciente
- ✅ Preparaciones son factibles
- ✅ No hay conflictos con medicamentos
- ✅ Plan es sostenible a largo plazo
