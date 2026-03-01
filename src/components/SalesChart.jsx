import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
    { name: 'Lun', ventas: 4000 },
    { name: 'Mar', ventas: 3000 },
    { name: 'Mié', ventas: 2000 },
    { name: 'Jue', ventas: 2780 },
    { name: 'Vie', ventas: 1890 },
    { name: 'Sáb', ventas: 2390 },
    { name: 'Dom', ventas: 3490 },
];

const SalesChart = () => {
    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-[300px]">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Ventas de la Semana</h3>
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                    data={data}
                    margin={{
                        top: 10,
                        right: 10,
                        left: 0,
                        bottom: 0,
                    }}
                >
                    <defs>
                        <linearGradient id="colorVentas" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#006644" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#006644" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                    <Tooltip
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                    />
                    <Area
                        type="monotone"
                        dataKey="ventas"
                        stroke="#006644"
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#colorVentas)"
                        animationDuration={2000}
                        animationEasing="ease-in-out"
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};

export default SalesChart;
