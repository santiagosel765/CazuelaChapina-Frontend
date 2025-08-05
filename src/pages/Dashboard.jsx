import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import {
  CurrencyDollarIcon,
  FireIcon,
  ClockIcon,
  ChartPieIcon,
  BanknotesIcon,
  TrashIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon
} from '@heroicons/react/24/outline';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  ComposedChart,
  Area,
  Line
} from 'recharts';
import { getDashboardSummary } from '../services/dashboardService';
import { useAuth } from '../contexts/AuthContext';

// Paleta de colores profesional
const COLORS = {
  primary: '#2c3e50',
  success: '#27ae60',
  danger: '#e74c3c',
  warning: '#f39c12',
  info: '#3498db',
  neutral: '#bdc3c7'
};

const Dashboard = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const { hasPermission } = useAuth();

  /* if (!hasPermission('dashboard.view')) {
    return <Navigate to="/faq" replace />;
  } */

  const today = new Date();
  const formatDate = (date) => date.toLocaleDateString('en-CA');
  const [startDate, setStartDate] = useState(
    formatDate(new Date(today.getFullYear(), today.getMonth(), 1))
  );
  const [endDate, setEndDate] = useState(formatDate(today));

  const fetchSummary = () => {
    setLoading(true);
    getDashboardSummary(startDate, endDate, 1)
      .then(setSummary)
      .catch(() => setSummary(null))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchSummary();
  };

  // Preparación de datos para visualizaciones
  const salesData = [
    { name: 'Hoy', total: summary?.sales?.day || 0 },
    { name: 'Mes', total: summary?.sales?.month || 0 }
  ];

  const tamalesData = summary?.topTamales?.map((t) => ({
    name: t.name,
    quantity: t.quantity,
    percent: Math.round((t.quantity / (summary.sales?.month || 1)) * 100)
  })) || [];

  const beveragesData = [
    { 
      period: 'Mañana', 
      beverage: summary?.popularBeverages?.morning?.name || 'Ninguna', 
      quantity: summary?.popularBeverages?.morning?.quantity || 0 
    },
    { 
      period: 'Tarde', 
      beverage: summary?.popularBeverages?.afternoon?.name || 'Ninguna', 
      quantity: summary?.popularBeverages?.afternoon?.quantity || 0 
    },
    { 
      period: 'Noche', 
      beverage: summary?.popularBeverages?.night?.name || 'Ninguna', 
      quantity: summary?.popularBeverages?.night?.quantity || 0 
    }
  ];

  const spiceData = [
    { 
      name: 'Picante', 
      value: summary?.spiceLevel?.spicy || 0, 
      color: COLORS.danger 
    },
    { 
      name: 'No picante', 
      value: summary?.spiceLevel?.nonSpicy || 0, 
      color: COLORS.success 
    }
  ];

  const profitData = [
    { 
      category: 'Tamales', 
      profit: summary?.profit?.tamales || 0,
      color: COLORS.info
    },
    { 
      category: 'Bebidas', 
      profit: summary?.profit?.beverages || 0,
      color: COLORS.warning
    },
    { 
      category: 'Combos', 
      profit: summary?.profit?.combos || 0,
      color: COLORS.primary
    }
  ];

  const waste = summary?.waste || { quantity: 0, cost: 0 };
  const wastePercentage = Math.min(100, Math.round((waste.cost / (summary?.sales?.month || 1)) * 100));

  const DashboardCard = ({ title, icon: Icon, children, className = '' }) => (
    <div className={`bg-white p-5 rounded-lg shadow-md h-full flex flex-col ${className}`}>
      <div className="flex items-center mb-4 pb-2 border-b">
        {Icon && <Icon className="w-6 h-6 mr-2 text-gray-600" />}
        <h2 className="font-semibold text-lg text-gray-800">{title}</h2>
      </div>
      <div className="flex-grow">
        {children}
      </div>
    </div>
  );

  const KPI = ({ title, value, trend, description, color = COLORS.primary }) => (
    <div className="bg-gray-50 p-4 rounded-lg mb-4">
      <h3 className="text-sm font-medium text-gray-500 mb-1">{title}</h3>
      <div className="flex items-baseline">
        <p className={`text-2xl font-bold ${color === COLORS.danger ? 'text-red-600' : ''}`}>
          Q{typeof value === 'number' ? value.toFixed(2) : value}
        </p>
        {trend !== undefined && (
          <span className={`ml-2 text-sm flex items-center ${
            trend >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {trend >= 0 ? (
              <ArrowTrendingUpIcon className="w-4 h-4 mr-1" />
            ) : (
              <ArrowTrendingDownIcon className="w-4 h-4 mr-1" />
            )}
            {Math.abs(trend)}%
          </span>
        )}
      </div>
      {description && <p className="mt-1 text-xs text-gray-500">{description}</p>}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Dashboard Estratégico</h1>
          <p className="text-sm text-gray-600">
            Resumen ejecutivo de desempeño operativo
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="flex flex-wrap gap-3 items-end">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Fecha inicio</label>
            <input
              type="date"
              className="border rounded-md p-2 text-sm"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Fecha fin</label>
            <input
              type="date"
              className="border rounded-md p-2 text-sm"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 transition"
          >
            Actualizar
          </button>
        </form>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : !summary ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-600">No hay datos disponibles para este rango de fechas</p>
          <button 
            onClick={fetchSummary}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 transition"
          >
            Reintentar
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Columna 1: Ventas y KPIs */}
          <div className="md:col-span-2 lg:col-span-1 space-y-6">
            <DashboardCard title="Desempeño de Ventas" icon={CurrencyDollarIcon}>
              <KPI 
                title="Ventas Hoy" 
                value={summary.sales.day || 0} 
                trend={-5.2} 
                description="Comparado con ayer"
                color={summary.sales.day > 0 ? COLORS.primary : COLORS.danger}
              />
              <KPI 
                title="Ventas Mensuales" 
                value={summary.sales.month || 0} 
                trend={4.2} 
                description="Meta: Q450.00"
              />
              
              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Tendencia de ventas</h3>
                <ResponsiveContainer width="100%" height={150}>
                  <ComposedChart data={[
                    { day: 'Lun', sales: 120 },
                    { day: 'Mar', sales: 95 },
                    { day: 'Mié', sales: 80 },
                    { day: 'Jue', sales: 150 },
                    { day: 'Vie', sales: 200 },
                    { day: 'Sáb', sales: 180 },
                    { day: 'Dom', sales: summary.sales.day || 0 }
                  ]}>
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="sales" fill="#e3f2fd" stroke="#3498db" />
                    <Line type="monotone" dataKey="sales" stroke="#3498db" strokeWidth={2} dot={{ r: 4 }} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </DashboardCard>

            <DashboardCard title="Eficiencia Operativa" icon={TrashIcon}>
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-500 mb-1">Desperdicio</h3>
                <p className="text-2xl font-bold text-red-600">Q{waste.cost.toFixed(2)}</p>
                <p className="text-sm text-gray-600">{waste.quantity} unidades desperdiciadas</p>
              </div>
              
              <div>
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Eficiencia</span>
                  <span>{wastePercentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className={`h-2.5 rounded-full ${
                      wastePercentage < 5 ? 'bg-green-600' : 
                      wastePercentage < 10 ? 'bg-yellow-500' : 'bg-red-600'
                    }`} 
                    style={{ width: `${wastePercentage}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  {wastePercentage < 5 
                    ? 'Excelente control de inventario' 
                    : wastePercentage < 10 
                      ? 'Necesita mejorar' 
                      : 'Acción correctiva requerida'}
                </p>
              </div>
            </DashboardCard>
          </div>

          {/* Columna 2: Productos */}
          <div className="md:col-span-2 lg:col-span-2 space-y-6">
            <DashboardCard title="Tamales más vendidos" icon={FireIcon} className="h-full">
              {tamalesData.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No hay datos de ventas de tamales</p>
              ) : (
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart 
                      layout="vertical"
                      data={tamalesData}
                      margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
                    >
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" width={100} />
                      <Tooltip 
                        formatter={(value) => [`${value} unidades`, 'Ventas']}
                        labelFormatter={(name) => `Tamal: ${name}`}
                      />
                      <Legend />
                      <Bar 
                        dataKey="quantity" 
                        name="Unidades vendidas" 
                        fill={COLORS.info}
                        radius={[0, 4, 4, 0]}
                      >
                        {tamalesData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS.info} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </DashboardCard>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <DashboardCard title="Preferencia de Picante" icon={FireIcon}>
                {spiceData.reduce((sum, item) => sum + item.value, 0) === 0 ? (
                  <p className="text-gray-500 text-center py-8">Sin datos disponibles</p>
                ) : (
                  <div className="h-56">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={spiceData}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={70}
                          innerRadius={40}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {spiceData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`${value} unidades`, '']} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </DashboardCard>

              <DashboardCard title="Bebidas por Horario" icon={ClockIcon}>
                <div className="space-y-4 mt-2">
                  {beveragesData.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                      <span className="font-medium text-gray-700">{item.period}</span>
                      <div className="text-right">
                        <p className="font-semibold">{item.beverage}</p>
                        <p className="text-sm text-gray-600">{item.quantity} unidades</p>
                      </div>
                    </div>
                  ))}
                </div>
              </DashboardCard>
            </div>
          </div>

          {/* Columna 3: Rentabilidad */}
          <div className="md:col-span-2 lg:col-span-1 space-y-6">
            <DashboardCard title="Rentabilidad por Línea" icon={BanknotesIcon}>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={profitData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                    layout="vertical"
                  >
                    <XAxis type="number" />
                    <YAxis dataKey="category" type="category" width={80} />
                    <Tooltip formatter={(value) => [`Q${value.toFixed(2)}`, 'Ganancia']} />
                    <Bar dataKey="profit" name="Ganancia">
                      {profitData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              
              <div className="mt-4 grid grid-cols-1 gap-2">
                {profitData.map((item, index) => (
                  <div key={index} className="flex justify-between">
                    <span className="text-gray-600">{item.category}</span>
                    <span className="font-medium">Q{item.profit.toFixed(2)}</span>
                  </div>
                ))}
                <div className="pt-2 mt-2 border-t">
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>
                      Q{profitData.reduce((sum, item) => sum + item.profit, 0).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </DashboardCard>

            <DashboardCard title="Resumen Ejecutivo">
              <div className="space-y-3">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Producto estrella</h3>
                  <p className="font-semibold">
                    {tamalesData[0]?.name || 'Sin datos'}
                  </p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Horario pico</h3>
                  <p className="font-semibold">
                    {beveragesData.reduce((peak, current) => 
                      current.quantity > peak.quantity ? current : peak, 
                      {period: '', quantity: 0}
                    ).period || 'Noche'}
                  </p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Línea más rentable</h3>
                  <p className="font-semibold">
                    {profitData.reduce((max, current) => 
                      current.profit > max.profit ? current : max
                    ).category || 'Bebidas'}
                  </p>
                </div>
              </div>
            </DashboardCard>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;