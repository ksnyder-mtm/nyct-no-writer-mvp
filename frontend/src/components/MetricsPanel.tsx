import React, { useState, useEffect } from 'react';
import { TrendingUp, Clock, CheckCircle, Edit3, RefreshCw } from 'lucide-react';

interface Metrics {
  avg_generation_time_ms: number;
  declines_cleared_this_week: number;
  total_processed: number;
  manual_edits_ratio: number;
}

const MetricsPanel: React.FC = () => {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    setLoading(true);
    try {
      // Simulate API call delay for realistic experience
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Use mock metrics for demo (no backend needed)
      setMetrics({
        avg_generation_time_ms: 3500,
        declines_cleared_this_week: 47,
        total_processed: 234,
        manual_edits_ratio: 0.23
      });
    } catch (error) {
      console.error('Failed to fetch metrics:', error);
      // Fallback metrics for demo
      setMetrics({
        avg_generation_time_ms: 3500,
        declines_cleared_this_week: 47,
        total_processed: 234,
        manual_edits_ratio: 0.23
      });
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (ms: number) => {
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(1)}s`;
  };

  const formatPercentage = (ratio: number) => {
    return `${(ratio * 100).toFixed(1)}%`;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-card border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-navy-500">Usage Metrics</h3>
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-500"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-16 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="bg-white rounded-lg shadow-card border border-gray-200 p-6">
        <div className="text-center text-gray-600">
          Failed to load metrics
        </div>
      </div>
    );
  }

  const metricCards = [
    {
      title: 'Avg Generation Time',
      value: formatTime(metrics.avg_generation_time_ms),
      icon: Clock,
      description: 'Time to generate rationale',
      color: 'blue'
    },
    {
      title: 'Cleared This Week',
      value: metrics.declines_cleared_this_week.toString(),
      icon: CheckCircle,
      description: 'Proposals processed',
      color: 'green'
    },
    {
      title: 'Total Processed',
      value: metrics.total_processed.toString(),
      icon: TrendingUp,
      description: 'All-time count',
      color: 'purple'
    },
    {
      title: 'Manual Edit Rate',
      value: formatPercentage(metrics.manual_edits_ratio),
      icon: Edit3,
      description: 'Outputs requiring edits',
      color: 'orange'
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'text-primary-700 bg-primary-100',
      green: 'text-success-700 bg-success-100',
      purple: 'text-primary-800 bg-primary-200',
      orange: 'text-accent-700 bg-accent-100'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <div className="bg-white rounded-lg shadow-card border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-r from-primary-100 to-accent-100 p-2 rounded-lg">
            <TrendingUp className="h-5 w-5 text-primary-600" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-navy-500">📊 Usage Analytics</h3>
            <p className="text-sm text-gray-600">Performance insights and trends</p>
          </div>
        </div>
        <button
          onClick={fetchMetrics}
          className="inline-flex items-center space-x-2 px-4 py-2 text-sm font-medium text-navy-500 hover:text-navy-600 bg-softblue-100 hover:bg-softblue-200 rounded-md transition-all duration-200"
        >
          <RefreshCw className="h-4 w-4" />
          <span>Refresh Data</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metricCards.map((metric, index) => {
          const IconComponent = metric.icon;
          return (
            <div key={index} className="relative overflow-hidden rounded-lg border border-gray-200 p-6 bg-white hover:shadow-elevated transition-all duration-300 group">
              <div className="flex items-start justify-between mb-4">
                <div className={`rounded-xl p-3 ${getColorClasses(metric.color)} group-hover:scale-110 transition-transform duration-300`}>
                  <IconComponent className="h-6 w-6" />
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-navy-500 mb-1">{metric.value}</p>
                  <p className="text-xs font-medium text-gray-600">{metric.title}</p>
                </div>
              </div>
              <div className="border-t border-gray-100 pt-3">
                <p className="text-xs text-gray-600 leading-relaxed">{metric.description}</p>
              </div>
              
              {/* Subtle background pattern */}
              <div className="absolute top-0 right-0 -mr-4 -mt-4 w-24 h-24 opacity-5">
                <IconComponent className="w-full h-full" />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 bg-gradient-to-r from-primary-50/50 to-accent-50/50 border border-primary-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <div className="bg-primary-100 p-2 rounded-lg flex-shrink-0">
            <div className="w-4 h-4 bg-primary-500 rounded-full"></div>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-navy-500 mb-1">🎯 Success Target</h4>
            <p className="text-xs text-gray-600 leading-relaxed">
              Reduce average time-to-rationale per decline from multiple weeks to under 15 minutes within the pilot team, while maintaining quality and consistency in communication.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MetricsPanel;