import { PrismaClient } from '../src/generated/prisma';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed de alimentos...');
  
  // Eliminar todos los alimentos existentes
  await prisma.alimento.deleteMany();
  console.log('🗑️ Alimentos existentes eliminados');

  // Insertar alimentos básicos organizados por categoría
  await prisma.alimento.createMany({
    data: [
      // ========== FRUTAS ==========
      {
        nombre: 'Manzana',
        categoria: 'Frutas',
        caloriasPor100g: 52,
        proteinasPor100g: 0.3,
        carbohidratosPor100g: 14,
        grasasPor100g: 0.2,
        fibraPor100g: 2.4,
        alergenos: '',
        restricciones: 'vegano,vegetariano,sin_gluten,sin_lactosa',
        caracteristicas: 'bajo_sodio',
        aptoParaDiabetes: true,
        aptoParaHipertension: true,
        esGenerico: true,
        activo: true
      },
      {
        nombre: 'Banana',
        categoria: 'Frutas',
        caloriasPor100g: 89,
        proteinasPor100g: 1.1,
        carbohidratosPor100g: 23,
        grasasPor100g: 0.3,
        fibraPor100g: 2.6,
        alergenos: '',
        restricciones: 'vegano,vegetariano,sin_gluten,sin_lactosa',
        caracteristicas: '',
        aptoParaDiabetes: false,
        aptoParaHipertension: true,
        esGenerico: true,
        activo: true
      },
      {
        nombre: 'Naranja',
        categoria: 'Frutas',
        caloriasPor100g: 47,
        proteinasPor100g: 0.9,
        carbohidratosPor100g: 12,
        grasasPor100g: 0.1,
        fibraPor100g: 2.4,
        alergenos: '',
        restricciones: 'vegano,vegetariano,sin_gluten,sin_lactosa',
        caracteristicas: 'bajo_sodio',
        aptoParaDiabetes: true,
        aptoParaHipertension: true,
        esGenerico: true,
        activo: true
      },
      {
        nombre: 'Frutillas',
        categoria: 'Frutas',
        caloriasPor100g: 32,
        proteinasPor100g: 0.7,
        carbohidratosPor100g: 8,
        grasasPor100g: 0.3,
        fibraPor100g: 2,
        alergenos: '',
        restricciones: 'vegano,vegetariano,sin_gluten,sin_lactosa',
        caracteristicas: 'bajo_sodio',
        aptoParaDiabetes: true,
        aptoParaHipertension: true,
        esGenerico: true,
        activo: true
      },
      {
        nombre: 'Pera',
        categoria: 'Frutas',
        caloriasPor100g: 57,
        proteinasPor100g: 0.4,
        carbohidratosPor100g: 15,
        grasasPor100g: 0.1,
        fibraPor100g: 3.1,
        alergenos: '',
        restricciones: 'vegano,vegetariano,sin_gluten,sin_lactosa',
        caracteristicas: 'bajo_sodio',
        aptoParaDiabetes: true,
        aptoParaHipertension: true,
        esGenerico: true,
        activo: true
      },

      // ========== VEGETALES ==========
      {
        nombre: 'Tomate',
        categoria: 'Vegetales',
        caloriasPor100g: 18,
        proteinasPor100g: 0.9,
        carbohidratosPor100g: 3.9,
        grasasPor100g: 0.2,
        fibraPor100g: 1.2,
        alergenos: '',
        restricciones: 'vegano,vegetariano,sin_gluten,sin_lactosa',
        caracteristicas: 'bajo_sodio',
        aptoParaDiabetes: true,
        aptoParaHipertension: true,
        esGenerico: true,
        activo: true
      },
      {
        nombre: 'Zanahoria',
        categoria: 'Vegetales',
        caloriasPor100g: 41,
        proteinasPor100g: 0.9,
        carbohidratosPor100g: 10,
        grasasPor100g: 0.2,
        fibraPor100g: 2.8,
        alergenos: '',
        restricciones: 'vegano,vegetariano,sin_gluten,sin_lactosa',
        caracteristicas: 'bajo_sodio',
        aptoParaDiabetes: true,
        aptoParaHipertension: true,
        esGenerico: true,
        activo: true
      },
      {
        nombre: 'Brócoli',
        categoria: 'Vegetales',
        caloriasPor100g: 34,
        proteinasPor100g: 2.8,
        carbohidratosPor100g: 7,
        grasasPor100g: 0.4,
        fibraPor100g: 2.6,
        alergenos: '',
        restricciones: 'vegano,vegetariano,sin_gluten,sin_lactosa',
        caracteristicas: 'bajo_sodio,alto_proteina',
        aptoParaDiabetes: true,
        aptoParaHipertension: true,
        esGenerico: true,
        activo: true
      },
      {
        nombre: 'Espinaca',
        categoria: 'Vegetales',
        caloriasPor100g: 23,
        proteinasPor100g: 2.9,
        carbohidratosPor100g: 3.6,
        grasasPor100g: 0.4,
        fibraPor100g: 2.2,
        alergenos: '',
        restricciones: 'vegano,vegetariano,sin_gluten,sin_lactosa',
        caracteristicas: 'bajo_sodio,alto_proteina',
        aptoParaDiabetes: true,
        aptoParaHipertension: true,
        esGenerico: true,
        activo: true
      },
      {
        nombre: 'Lechuga',
        categoria: 'Vegetales',
        caloriasPor100g: 15,
        proteinasPor100g: 1.4,
        carbohidratosPor100g: 2.9,
        grasasPor100g: 0.2,
        fibraPor100g: 1.3,
        alergenos: '',
        restricciones: 'vegano,vegetariano,sin_gluten,sin_lactosa',
        caracteristicas: 'bajo_sodio',
        aptoParaDiabetes: true,
        aptoParaHipertension: true,
        esGenerico: true,
        activo: true
      },

      // ========== CARNES ==========
      {
        nombre: 'Pollo',
        categoria: 'Carnes',
        caloriasPor100g: 165,
        proteinasPor100g: 31,
        carbohidratosPor100g: 0,
        grasasPor100g: 3.6,
        fibraPor100g: 0,
        alergenos: '',
        restricciones: 'sin_gluten,sin_lactosa',
        caracteristicas: 'alto_proteina',
        aptoParaDiabetes: true,
        aptoParaHipertension: true,
        esGenerico: true,
        activo: true
      },
      {
        nombre: 'Carne vacuna magra',
        categoria: 'Carnes',
        caloriasPor100g: 250,
        proteinasPor100g: 26,
        carbohidratosPor100g: 0,
        grasasPor100g: 15,
        fibraPor100g: 0,
        alergenos: '',
        restricciones: 'sin_gluten,sin_lactosa',
        caracteristicas: 'alto_proteina',
        aptoParaDiabetes: true,
        aptoParaHipertension: false,
        esGenerico: true,
        activo: true
      },
      {
        nombre: 'Cerdo magro',
        categoria: 'Carnes',
        caloriasPor100g: 242,
        proteinasPor100g: 27,
        carbohidratosPor100g: 0,
        grasasPor100g: 14,
        fibraPor100g: 0,
        alergenos: '',
        restricciones: 'sin_gluten,sin_lactosa',
        caracteristicas: 'alto_proteina',
        aptoParaDiabetes: true,
        aptoParaHipertension: false,
        esGenerico: true,
        activo: true
      },

      // ========== PESCADOS ==========
      {
        nombre: 'Salmón',
        categoria: 'Pescados',
        caloriasPor100g: 208,
        proteinasPor100g: 25,
        carbohidratosPor100g: 0,
        grasasPor100g: 12,
        fibraPor100g: 0,
        alergenos: 'pescado',
        restricciones: 'sin_gluten,sin_lactosa',
        caracteristicas: 'alto_proteina',
        aptoParaDiabetes: true,
        aptoParaHipertension: true,
        esGenerico: true,
        activo: true
      },
      {
        nombre: 'Atún en agua',
        categoria: 'Pescados',
        caloriasPor100g: 116,
        proteinasPor100g: 26,
        carbohidratosPor100g: 0,
        grasasPor100g: 0.8,
        fibraPor100g: 0,
        alergenos: 'pescado',
        restricciones: 'sin_gluten,sin_lactosa',
        caracteristicas: 'alto_proteina',
        aptoParaDiabetes: true,
        aptoParaHipertension: true,
        esGenerico: true,
        activo: true
      },
      {
        nombre: 'Merluza',
        categoria: 'Pescados',
        caloriasPor100g: 90,
        proteinasPor100g: 18,
        carbohidratosPor100g: 0,
        grasasPor100g: 1.4,
        fibraPor100g: 0,
        alergenos: 'pescado',
        restricciones: 'sin_gluten,sin_lactosa',
        caracteristicas: 'alto_proteina',
        aptoParaDiabetes: true,
        aptoParaHipertension: true,
        esGenerico: true,
        activo: true
      },

      // ========== LÁCTEOS ==========
      {
        nombre: 'Leche descremada',
        categoria: 'Lácteos',
        caloriasPor100g: 35,
        proteinasPor100g: 3.4,
        carbohidratosPor100g: 5,
        grasasPor100g: 0.1,
        fibraPor100g: 0,
        alergenos: 'lactosa',
        restricciones: 'vegetariano,sin_gluten',
        caracteristicas: '',
        aptoParaDiabetes: true,
        aptoParaHipertension: true,
        esGenerico: true,
        activo: true
      },
      {
        nombre: 'Yogur natural sin azúcar',
        categoria: 'Lácteos',
        caloriasPor100g: 59,
        proteinasPor100g: 10,
        carbohidratosPor100g: 3.6,
        grasasPor100g: 0.4,
        fibraPor100g: 0,
        alergenos: 'lactosa',
        restricciones: 'vegetariano,sin_gluten',
        caracteristicas: 'alto_proteina',
        aptoParaDiabetes: true,
        aptoParaHipertension: true,
        esGenerico: true,
        activo: true
      },
      {
        nombre: 'Queso fresco',
        categoria: 'Lácteos',
        caloriasPor100g: 98,
        proteinasPor100g: 11,
        carbohidratosPor100g: 4,
        grasasPor100g: 4,
        fibraPor100g: 0,
        alergenos: 'lactosa',
        restricciones: 'vegetariano,sin_gluten',
        caracteristicas: 'alto_proteina',
        aptoParaDiabetes: true,
        aptoParaHipertension: true,
        esGenerico: true,
        activo: true
      },
      {
        nombre: 'Queso duro',
        categoria: 'Lácteos',
        caloriasPor100g: 402,
        proteinasPor100g: 25,
        carbohidratosPor100g: 1.3,
        grasasPor100g: 33,
        fibraPor100g: 0,
        alergenos: 'lactosa',
        restricciones: 'vegetariano,sin_gluten',
        caracteristicas: 'alto_proteina',
        aptoParaDiabetes: true,
        aptoParaHipertension: false,
        esGenerico: true,
        activo: true
      },

      // ========== CEREALES ==========
      {
        nombre: 'Arroz integral',
        categoria: 'Cereales',
        caloriasPor100g: 111,
        proteinasPor100g: 2.6,
        carbohidratosPor100g: 23,
        grasasPor100g: 0.9,
        fibraPor100g: 1.8,
        alergenos: '',
        restricciones: 'vegano,vegetariano,sin_gluten,sin_lactosa',
        caracteristicas: '',
        aptoParaDiabetes: true,
        aptoParaHipertension: true,
        esGenerico: true,
        activo: true
      },
      {
        nombre: 'Arroz blanco',
        categoria: 'Cereales',
        caloriasPor100g: 130,
        proteinasPor100g: 2.7,
        carbohidratosPor100g: 28,
        grasasPor100g: 0.3,
        fibraPor100g: 0.4,
        alergenos: '',
        restricciones: 'vegano,vegetariano,sin_gluten,sin_lactosa',
        caracteristicas: '',
        aptoParaDiabetes: false,
        aptoParaHipertension: true,
        esGenerico: true,
        activo: true
      },
      {
        nombre: 'Avena',
        categoria: 'Cereales',
        caloriasPor100g: 389,
        proteinasPor100g: 17,
        carbohidratosPor100g: 66,
        grasasPor100g: 7,
        fibraPor100g: 10,
        alergenos: 'gluten',
        restricciones: 'vegano,vegetariano',
        caracteristicas: 'alto_proteina',
        aptoParaDiabetes: true,
        aptoParaHipertension: true,
        esGenerico: true,
        activo: true
      },
      {
        nombre: 'Pan integral',
        categoria: 'Cereales',
        caloriasPor100g: 247,
        proteinasPor100g: 8.8,
        carbohidratosPor100g: 41,
        grasasPor100g: 3.4,
        fibraPor100g: 6.9,
        alergenos: 'gluten',
        restricciones: 'vegetariano',
        caracteristicas: '',
        aptoParaDiabetes: false,
        aptoParaHipertension: true,
        esGenerico: true,
        activo: true
      },
      {
        nombre: 'Quinoa',
        categoria: 'Cereales',
        caloriasPor100g: 368,
        proteinasPor100g: 14,
        carbohidratosPor100g: 64,
        grasasPor100g: 6,
        fibraPor100g: 7,
        alergenos: '',
        restricciones: 'vegano,vegetariano,sin_gluten,sin_lactosa',
        caracteristicas: 'alto_proteina',
        aptoParaDiabetes: true,
        aptoParaHipertension: true,
        esGenerico: true,
        activo: true
      },

      // ========== LEGUMBRES ==========
      {
        nombre: 'Lentejas',
        categoria: 'Legumbres',
        caloriasPor100g: 116,
        proteinasPor100g: 9,
        carbohidratosPor100g: 20,
        grasasPor100g: 0.4,
        fibraPor100g: 7.9,
        alergenos: '',
        restricciones: 'vegano,vegetariano,sin_gluten,sin_lactosa',
        caracteristicas: 'alto_proteina',
        aptoParaDiabetes: true,
        aptoParaHipertension: true,
        esGenerico: true,
        activo: true
      },
      {
        nombre: 'Garbanzos',
        categoria: 'Legumbres',
        caloriasPor100g: 164,
        proteinasPor100g: 8,
        carbohidratosPor100g: 27,
        grasasPor100g: 2.6,
        fibraPor100g: 8,
        alergenos: '',
        restricciones: 'vegano,vegetariano,sin_gluten,sin_lactosa',
        caracteristicas: 'alto_proteina',
        aptoParaDiabetes: true,
        aptoParaHipertension: true,
        esGenerico: true,
        activo: true
      },
      {
        nombre: 'Porotos negros',
        categoria: 'Legumbres',
        caloriasPor100g: 132,
        proteinasPor100g: 9,
        carbohidratosPor100g: 23,
        grasasPor100g: 0.5,
        fibraPor100g: 8.7,
        alergenos: '',
        restricciones: 'vegano,vegetariano,sin_gluten,sin_lactosa',
        caracteristicas: 'alto_proteina',
        aptoParaDiabetes: true,
        aptoParaHipertension: true,
        esGenerico: true,
        activo: true
      },
      {
        nombre: 'Arvejas',
        categoria: 'Legumbres',
        caloriasPor100g: 81,
        proteinasPor100g: 5,
        carbohidratosPor100g: 14,
        grasasPor100g: 0.4,
        fibraPor100g: 5,
        alergenos: '',
        restricciones: 'vegano,vegetariano,sin_gluten,sin_lactosa',
        caracteristicas: 'alto_proteina',
        aptoParaDiabetes: true,
        aptoParaHipertension: true,
        esGenerico: true,
        activo: true
      },

      // ========== HUEVOS ==========
      {
        nombre: 'Huevo entero',
        categoria: 'Huevos',
        caloriasPor100g: 155,
        proteinasPor100g: 13,
        carbohidratosPor100g: 1.1,
        grasasPor100g: 11,
        fibraPor100g: 0,
        alergenos: 'huevo',
        restricciones: 'vegetariano,sin_gluten,sin_lactosa',
        caracteristicas: 'alto_proteina',
        aptoParaDiabetes: true,
        aptoParaHipertension: true,
        esGenerico: true,
        activo: true
      },
      {
        nombre: 'Clara de huevo',
        categoria: 'Huevos',
        caloriasPor100g: 52,
        proteinasPor100g: 11,
        carbohidratosPor100g: 0.7,
        grasasPor100g: 0.2,
        fibraPor100g: 0,
        alergenos: 'huevo',
        restricciones: 'vegetariano,sin_gluten,sin_lactosa',
        caracteristicas: 'alto_proteina',
        aptoParaDiabetes: true,
        aptoParaHipertension: true,
        esGenerico: true,
        activo: true
      },

      // ========== ACEITES Y GRASAS ==========
      {
        nombre: 'Aceite de oliva',
        categoria: 'Aceites',
        caloriasPor100g: 884,
        proteinasPor100g: 0,
        carbohidratosPor100g: 0,
        grasasPor100g: 100,
        fibraPor100g: 0,
        alergenos: '',
        restricciones: 'vegano,vegetariano,sin_gluten,sin_lactosa',
        caracteristicas: '',
        aptoParaDiabetes: true,
        aptoParaHipertension: true,
        esGenerico: true,
        activo: true
      },
      {
        nombre: 'Palta',
        categoria: 'Aceites',
        caloriasPor100g: 160,
        proteinasPor100g: 2,
        carbohidratosPor100g: 9,
        grasasPor100g: 15,
        fibraPor100g: 7,
        alergenos: '',
        restricciones: 'vegano,vegetariano,sin_gluten,sin_lactosa',
        caracteristicas: '',
        aptoParaDiabetes: true,
        aptoParaHipertension: true,
        esGenerico: true,
        activo: true
      },
      {
        nombre: 'Nueces',
        categoria: 'Aceites',
        caloriasPor100g: 654,
        proteinasPor100g: 15,
        carbohidratosPor100g: 14,
        grasasPor100g: 65,
        fibraPor100g: 7,
        alergenos: 'nueces',
        restricciones: 'vegano,vegetariano,sin_gluten,sin_lactosa',
        caracteristicas: 'alto_proteina',
        aptoParaDiabetes: true,
        aptoParaHipertension: true,
        esGenerico: true,
        activo: true
      },

      // ========== OTROS ==========
      {
        nombre: 'Tofu',
        categoria: 'Otros',
        caloriasPor100g: 76,
        proteinasPor100g: 8,
        carbohidratosPor100g: 1.9,
        grasasPor100g: 4.8,
        fibraPor100g: 0.3,
        alergenos: 'soja',
        restricciones: 'vegano,vegetariano,sin_gluten,sin_lactosa',
        caracteristicas: 'alto_proteina',
        aptoParaDiabetes: true,
        aptoParaHipertension: true,
        esGenerico: true,
        activo: true
      },
      {
        nombre: 'Miel',
        categoria: 'Otros',
        caloriasPor100g: 304,
        proteinasPor100g: 0.3,
        carbohidratosPor100g: 82,
        grasasPor100g: 0,
        fibraPor100g: 0.2,
        alergenos: '',
        restricciones: 'vegetariano,sin_gluten,sin_lactosa',
        caracteristicas: '',
        aptoParaDiabetes: false,
        aptoParaHipertension: true,
        esGenerico: true,
        activo: true
      }
    ]
  });

  console.log('✅ Seed completado! Se cargaron 40+ alimentos organizados por categorías:');
  console.log('   🍎 Frutas: Manzana, Banana, Naranja, Frutillas, Pera');
  console.log('   🥕 Vegetales: Tomate, Zanahoria, Brócoli, Espinaca, Lechuga');
  console.log('   🥩 Carnes: Pollo, Carne vacuna, Cerdo');
  console.log('   🐟 Pescados: Salmón, Atún, Merluza');
  console.log('   🥛 Lácteos: Leche, Yogur, Quesos');
  console.log('   🌾 Cereales: Arroz, Avena, Pan integral, Quinoa');
  console.log('   🫘 Legumbres: Lentejas, Garbanzos, Porotos, Arvejas');
  console.log('   🥚 Huevos: Entero y claras');
  console.log('   🫒 Aceites: Oliva, Palta, Nueces');
  console.log('   🌱 Otros: Tofu, Miel');
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });