'use client';

import React, { useState, useMemo } from 'react';
import { EmploymentMilestone, getEmploymentMilestonesByDateRange } from '../../lib/data';

interface MyTimelineProps {
  employmentMilestones: EmploymentMilestone[];
}

const MyTimeline: React.FC<MyTimelineProps> = ({ employmentMilestones }) => {
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  const filteredMilestones = useMemo(() => {
    return getEmploymentMilestonesByDateRange(employmentMilestones, startDate, endDate);
  }, [employmentMilestones, startDate, endDate]);

  const handleClearFilters = () => {
    setStartDate('');
    setEndDate('');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short' 
    });
  };

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <h1 className="text-3xl font-bold text-slate-100 mb-8">Build Your Personal Timeline</h1>
        
        {/* Filter Panel */}
        <div className="mb-8">
          <div className="dark-card rounded-lg shadow-xl p-6">
            <h3 className="text-lg font-semibold text-slate-200 mb-6">Filter Timeline</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Start Date</label>
                <input
                  type="date"
                  className="dark-input w-full px-3 py-2 rounded-lg text-slate-100 focus:outline-none transition-all"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">End Date</label>
                <input
                  type="date"
                  className="dark-input w-full px-3 py-2 rounded-lg text-slate-100 focus:outline-none transition-all"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
              <div className="flex items-end">
                <button
                  onClick={handleClearFilters}
                  className="w-full px-4 py-2 bg-slate-700 text-slate-200 rounded-lg hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 focus:ring-offset-slate-800 transition-all"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Employment Milestones Table */}
        <div className="dark-card rounded-lg shadow-xl">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-slate-200 mb-4">Employment Milestones</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-700">
                <thead className="bg-slate-800">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                      Company
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                      Position
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                      Start Date
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                      End Date
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                      Duration
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-slate-900 divide-y divide-slate-700">
                  {filteredMilestones.map((milestone, index) => {
                    const startDate = new Date(milestone.start_date);
                    const endDate = milestone.end_date && milestone.end_date.trim() !== '' ? new Date(milestone.end_date) : new Date();
                    const durationMs = endDate.getTime() - startDate.getTime();
                    const durationMonths = Math.round(durationMs / (1000 * 60 * 60 * 24 * 30.44));
                    
                    return (
                      <tr key={index} className="hover:bg-slate-700 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-100">
                          {milestone.company}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                          {milestone.position}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                          {milestone.city}, {milestone.state}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                          {formatDate(milestone.start_date)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                          {milestone.end_date && milestone.end_date.trim() !== '' ? formatDate(milestone.end_date) : 'Present'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                          {milestone.end_date && milestone.end_date.trim() !== '' ? `${durationMonths} months` : 'Ongoing'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {filteredMilestones.length === 0 && (
              <div className="text-center py-8">
                <p className="text-slate-400">No employment milestones found for the selected date range.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyTimeline;
