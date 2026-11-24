/* Datos de ejemplo (sin backend). PetSpa sigue el diseño de Figma;
   el resto son datos ficticios para completar la demo. */
const CATEGORIAS = [
  { id: 'veterinaria', nombre: 'Veterinaria', desc: 'Consultas, vacunas y cuidados médicos', icon: 'paw' },
  { id: 'peluqueria', nombre: 'Peluquería', desc: 'Baño, corte y cuidado estético', icon: 'scissors' },
  { id: 'paseo', nombre: 'Paseo', desc: 'Paseadores de confianza para tu mascota', icon: 'pin' },
  { id: 'cuidado', nombre: 'Cuidado temporal', desc: 'Guarderías y cuidadores temporales', icon: 'house' }
];

const PROVEEDORES = [
  {
    id: 'petspa', nombre: 'PetSpa', categoria: 'peluqueria', tipo: 'Peluquería canina',
    ubicacion: 'Chapinero', iniciales: 'PS',
    descripcion: 'Peluquería canina con más de diez años de experiencia.',
    servicios: [
      { nombre: 'Baño completo', precio: 30000 },
      { nombre: 'Baño + corte', precio: 45000 },
      { nombre: 'Corte de uñas', precio: 15000 },
      { nombre: 'Limpieza dental', precio: 35000 }
    ],
    resenas: [
      { estrellas: 4, texto: 'Excelente servicio', autor: 'Andres A.' },
      { estrellas: 5, texto: 'Lo recomendamos, muy profesionales.', autor: 'Felipe R.' }
    ]
  },
  {
    id: 'vetcare', nombre: 'VetCare', categoria: 'veterinaria', tipo: 'Veterinaria',
    ubicacion: 'Usaquén', iniciales: 'VC',
    descripcion: 'Clínica veterinaria con consulta general, vacunación y urgencias.',
    servicios: [
      { nombre: 'Consulta general', precio: 50000 },
      { nombre: 'Vacunación', precio: 60000 },
      { nombre: 'Desparasitación', precio: 40000 },
      { nombre: 'Control de peso', precio: 35000 }
    ],
    resenas: [
      { estrellas: 5, texto: 'Atendieron a mi gato con mucho cuidado.', autor: 'Laura M.' },
      { estrellas: 4, texto: 'Buena atención y precios claros.', autor: 'Camilo P.' }
    ]
  },
  {
    id: 'paseosfelices', nombre: 'Paseos Felices', categoria: 'paseo', tipo: 'Paseo de mascotas',
    ubicacion: 'Suba', iniciales: 'PF',
    descripcion: 'Paseadores certificados con rutas seguras y reportes de cada salida.',
    servicios: [
      { nombre: 'Paseo de 30 minutos', precio: 15000 },
      { nombre: 'Paseo de 1 hora', precio: 25000 },
      { nombre: 'Paseo grupal', precio: 18000 },
      { nombre: 'Paseo con entrenamiento', precio: 35000 }
    ],
    resenas: [
      { estrellas: 5, texto: 'Mi perro vuelve feliz y cansado.', autor: 'Daniela S.' },
      { estrellas: 5, texto: 'Puntuales y muy amables.', autor: 'Jorge T.' }
    ]
  },
  {
    id: 'guarderiapeludos', nombre: 'Guardería Peludos', categoria: 'cuidado', tipo: 'Cuidado temporal',
    ubicacion: 'Kennedy', iniciales: 'GP',
    descripcion: 'Cuidado temporal con espacio amplio y personal capacitado.',
    servicios: [
      { nombre: 'Guardería por día', precio: 40000 },
      { nombre: 'Medio día', precio: 25000 },
      { nombre: 'Fin de semana', precio: 110000 },
      { nombre: 'Hospedaje por noche', precio: 55000 }
    ],
    resenas: [
      { estrellas: 4, texto: 'Instalaciones limpias y personal atento.', autor: 'Natalia G.' },
      { estrellas: 5, texto: 'Dejé a mi perro un fin de semana y todo salió bien.', autor: 'Sergio V.' }
    ]
  }
];

const HORAS = ['08:00', '09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00'];
