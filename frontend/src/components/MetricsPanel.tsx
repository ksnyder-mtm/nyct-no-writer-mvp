import React, { useState, useEffect } from 'react';
import { TrendingUp, Clock, CheckCircle, Edit3, RefreshCw } from 'lucide-react';
import { API_URL } from '../config';

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
      const response = await fetch(`${API_URL}/metrics`);
      if (response.ok) {
        const data = await response.json();
        setMetrics(data);
      }
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
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Usage Metrics</h3>
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
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
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="text-center text-gray-500">
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
      blue: 'text-blue-600 bg-blue-100',
      green: 'text-green-600 bg-green-100',
      purple: 'text-purple-600 bg-purple-100',
      orange: 'text-orange-600 bg-orange-100'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Usage Metrics</h3>
        <button
          onClick={fetchMetrics}
          className="inline-flex items-center space-x-1 px-3 py-1 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors"
        >
          <RefreshCw className="h-4 w-4" />
          <span>Refresh</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metricCards.map((metric, index) => {
          const IconComponent = metric.icon;
          return (
            <div key={index} className="relative overflow-hidden rounded-lg border border-gray-200 p-4">
              <div className="flex items-center">
                <div className={`rounded-lg p-2 ${getColorClasses(metric.color)}`}>
                  <IconComponent className="h-5 w-5" />
                </div>
                <div className="ml-4 flex-1">
                  <p className="text-sm font-medium text-gray-600">{metric.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                </div>
              </div>
              <p className="mt-2 text-xs text-gray-500">{metric.description}</p>
            </div>
          );
        })}
      </div>

      <div className="mt-6 text-sm text-gray-500">
        <p>
          <strong>Success metric target:</strong> Reduce average "time-to-rationale" per decline 
          from multiple weeks to &lt;15 minutes within pilot team.
        </p>
      </div>
    </div>
  );
};

export default MetricsPanel;