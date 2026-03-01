import React from 'react';
import CountUp from 'react-countup';
import { TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const KPICard = ({ title, value, prefix = "", suffix = "", trend, icon: Icon, color = "green" }) => {
    const isPositive = trend >= 0;

    const colorClasses = {
        green: "bg-brand-green-light/10 text-brand-green-dark",
        blue: "bg-blue-50 text-blue-600",
        orange: "bg-orange-50 text-orange-600"
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
                <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
                <h3 className="text-2xl font-bold text-gray-900">
                    <CountUp
                        end={value}
                        prefix={prefix}
                        suffix={suffix}
                        duration={2.5}
                        separator=","
                        decimals={value % 1 !== 0 ? 2 : 0}
                    />
                </h3>

                {trend !== undefined && (
                    <div className={`flex items-center mt-2 text-xs font-medium ${isPositive ? 'text-green-600' : 'text-red-500'}`}>
                        {isPositive ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
                        <span>{Math.abs(trend)}% vs mes anterior</span>
                    </div>
                )}
            </div>

            <div className={`p-4 rounded-xl ${colorClasses[color] || colorClasses.green}`}>
                <Icon className="w-6 h-6" />
            </div>
        </div>
    );
};

export default KPICard;
