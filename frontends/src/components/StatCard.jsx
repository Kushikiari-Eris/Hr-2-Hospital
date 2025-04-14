import React from 'react';
import { 
  BookOpenIcon, ClipboardListIcon, UsersIcon, 
  ChartBarIcon, AcademicCapIcon, CogIcon 
} from '@heroicons/react/outline';
import { ArrowUpIcon, ArrowDownIcon, MinusIcon } from '@heroicons/react/solid';

const iconComponents = {
  'book': BookOpenIcon,
  'clipboard-list': ClipboardListIcon,
  'users': UsersIcon,
  'chart': ChartBarIcon,
  'academic': AcademicCapIcon,
  'settings': CogIcon
};

const trendComponents = {
  'up': ArrowUpIcon,
  'down': ArrowDownIcon,
  'neutral': MinusIcon
};

const colorClasses = {
  blue: {
    bg: 'bg-blue-50',
    text: 'text-blue-600',
    icon: 'text-blue-500',
    iconBg: 'bg-blue-100'
  },
  green: {
    bg: 'bg-green-50',
    text: 'text-green-600',
    icon: 'text-green-500',
    iconBg: 'bg-green-100'
  },
  purple: {
    bg: 'bg-purple-50',
    text: 'text-purple-600',
    icon: 'text-purple-500',
    iconBg: 'bg-purple-100'
  },
  amber: {
    bg: 'bg-amber-50',
    text: 'text-amber-600',
    icon: 'text-amber-500',
    iconBg: 'bg-amber-100'
  },
  red: {
    bg: 'bg-red-50',
    text: 'text-red-600',
    icon: 'text-red-500',
    iconBg: 'bg-red-100'
  }
};

const StatCard = ({ title, value, icon, trend, color = 'blue', onClick }) => {
  const IconComponent = iconComponents[icon] || BookOpenIcon;
  const TrendIcon = trendComponents[trend] || MinusIcon;
  const colors = colorClasses[color];
  
  return (
    <div 
      className={`${colors.bg} rounded-lg p-6 border shadow-sm cursor-pointer hover:shadow-md transition-shadow`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className={`text-3xl font-bold ${colors.text} mt-1`}>{value}</p>
        </div>
        <div className={`p-3 rounded-full ${colors.iconBg}`}>
          <IconComponent className={`h-6 w-6 ${colors.icon}`} />
        </div>
      </div>
      
      <div className="mt-4 flex items-center">
        <TrendIcon className={`h-4 w-4 ${trend === 'down' ? 'text-red-500' : trend === 'up' ? 'text-green-500' : 'text-gray-500'} mr-1`} />
        <span className={`text-xs font-medium ${trend === 'down' ? 'text-red-500' : trend === 'up' ? 'text-green-500' : 'text-gray-500'}`}>
          {trend === 'up' ? 'Increasing' : trend === 'down' ? 'Decreasing' : 'Stable'}
        </span>
      </div>
    </div>
  );
};

export default StatCard;