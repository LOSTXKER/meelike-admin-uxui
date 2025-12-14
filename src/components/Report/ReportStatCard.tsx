import React from 'react';
import { Card, CardBody } from 'reactstrap';

interface ReportStatCardProps {
    title: string;
    value: string | number;
    icon?: React.ReactNode;
    color?: string; // tailwind color class e.g., 'primary', 'success'
    trend?: {
        value: string;
        direction: 'up' | 'down';
        neutral?: boolean;
    };
    onClick?: () => void;
    isActive?: boolean;
    className?: string; // Add className prop
}

const ReportStatCard: React.FC<ReportStatCardProps> = ({
    title,
    value,
    icon,
    color = 'primary',
    trend,
    onClick,
    isActive = false,
    className = "", // Default to empty string
}) => {
    return (
        <Card
            className={`cursor-pointer transition-all duration-200 border-none shadow-sm hover:shadow-md ${isActive ? 'ring-2 ring-offset-1 ring-primary-500 transform -translate-y-1' : ''} ${className}`}
            onClick={onClick}
        >
            <CardBody className="p-4">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-gray-500 font-medium text-sm mb-1 uppercase tracking-wider">{title}</p>
                        <h4 className="text-2xl font-bold text-gray-800 mb-0">{value}</h4>
                        {trend && (
                            <div className={`flex items-center mt-2 text-xs font-medium ${trend.neutral ? 'text-gray-500' : trend.direction === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                                {trend.value}
                                <span className="ml-1">
                                    {trend.direction === 'up' ? '↑' : '↓'}
                                </span>
                            </div>
                        )}
                    </div>
                    {icon && (
                        <div className={`p-3 rounded-xl bg-${color}/10 text-${color}`}>
                            {icon}
                        </div>
                    )}
                </div>
            </CardBody>
        </Card>
    );
};

export default ReportStatCard;
