interface StatsCardProps {
  title: string;
  value: string;
  subtitle: string;
  color?: 'blue' | 'green' | 'orange' | 'yellow';
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, subtitle, color = 'blue' }) => {
  const valueColorClass = {
    blue: 'text-blue-400',
    green: 'text-emerald-400',
    orange: 'text-orange-400',
    yellow: 'text-yellow-400',
  };

  return (
    <div className="dark-card rounded-lg shadow-xl p-6">
      <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wide mb-2">{title}</h3>
      <div className="space-y-1">
        <p className={`text-3xl font-bold ${valueColorClass[color]}`}>{value}</p>
        <p className="text-sm text-slate-500">{subtitle}</p>
      </div>
    </div>
  );
};

export default StatsCard;
