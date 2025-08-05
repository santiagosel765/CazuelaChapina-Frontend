import {
  tamaleTypeService,
  fillingService,
  wrapperService,
  spiceLevelService,
  beverageTypeService,
  beverageSizeService,
  sweetenerService,
  toppingService,
} from '../services/catalogServices';

export const catalogConfigs = [
  {
    key: 'tamaleTypes',
    title: 'Tipos de Tamal',
    group: 'tamales',
    service: tamaleTypeService,
    columns: [{ field: 'name', headerName: 'Nombre' }],
    fields: [{ name: 'name', label: 'Nombre', type: 'text', required: true }],
  },
  {
    key: 'fillings',
    title: 'Rellenos',
    group: 'tamales',
    service: fillingService,
    columns: [{ field: 'name', headerName: 'Nombre' }],
    fields: [{ name: 'name', label: 'Nombre', type: 'text', required: true }],
  },
  {
    key: 'wrappers',
    title: 'Envolturas',
    group: 'tamales',
    service: wrapperService,
    columns: [{ field: 'name', headerName: 'Nombre' }],
    fields: [{ name: 'name', label: 'Nombre', type: 'text', required: true }],
  },
  {
    key: 'spiceLevels',
    title: 'Picante',
    group: 'tamales',
    service: spiceLevelService,
    columns: [{ field: 'name', headerName: 'Nombre' }],
    fields: [{ name: 'name', label: 'Nombre', type: 'text', required: true }],
  },
  {
    key: 'beverageTypes',
    title: 'Tipos de Bebida',
    group: 'bebidas',
    service: beverageTypeService,
    columns: [{ field: 'name', headerName: 'Nombre' }],
    fields: [{ name: 'name', label: 'Nombre', type: 'text', required: true }],
  },
  {
    key: 'beverageSizes',
    title: 'Tamaños de Bebida',
    group: 'bebidas',
    service: beverageSizeService,
    columns: [{ field: 'name', headerName: 'Nombre' }],
    fields: [{ name: 'name', label: 'Nombre', type: 'text', required: true }],
  },
  {
    key: 'sweeteners',
    title: 'Endulzantes',
    group: 'bebidas',
    service: sweetenerService,
    columns: [{ field: 'name', headerName: 'Nombre' }],
    fields: [{ name: 'name', label: 'Nombre', type: 'text', required: true }],
  },
  {
    key: 'toppings',
    title: 'Toppings',
    group: 'bebidas',
    service: toppingService,
    columns: [{ field: 'name', headerName: 'Nombre' }],
    fields: [{ name: 'name', label: 'Nombre', type: 'text', required: true }],
  },
];

export const catalogGroups = [
  { key: 'tamales', title: '🫔 Tamales' },
  { key: 'bebidas', title: '🥤 Bebidas' },
];
