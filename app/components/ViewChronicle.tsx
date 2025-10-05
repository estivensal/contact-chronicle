'use client';

import React, { useState, useMemo } from 'react';
import { Connection, Location, ConnectionStats, MonthlyData, getConnectionsByLocation, getConnectionStats, getMonthlyConnectionData } from '../../lib/data';
import StatsCard from './StatsCard';
import MonthlyChart from './MonthlyChart';
import FilterPanel from './FilterPanel';
import ContactsTable from './ContactsTable';

interface ViewChronicleProps {
  connections: Connection[];
  locations: Location[];
  stats: ConnectionStats;
  monthlyData: MonthlyData[];
}

const ViewChronicle: React.FC<ViewChronicleProps> = ({ connections, locations, stats, monthlyData }) => {
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredConnections = useMemo(() => {
    let filtered = connections;

    if (startDate) {
      const start = new Date(startDate);
      filtered = filtered.filter(conn => new Date(conn.connected_on) >= start);
    }
    if (endDate) {
      const end = new Date(endDate);
      filtered = filtered.filter(conn => new Date(conn.connected_on) <= end);
    }
    if (selectedLocation) {
      filtered = getConnectionsByLocation(filtered, locations, selectedLocation);
    }

    if (searchQuery) {
      const lowerCaseQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (conn) =>
          conn.first_name.toLowerCase().includes(lowerCaseQuery) ||
          conn.last_name.toLowerCase().includes(lowerCaseQuery) ||
          conn.company.toLowerCase().includes(lowerCaseQuery) ||
          conn.position.toLowerCase().includes(lowerCaseQuery) ||
          conn.email_address.toLowerCase().includes(lowerCaseQuery)
      );
    }
    return filtered;
  }, [connections, startDate, endDate, selectedLocation, searchQuery, locations]);

  // Calculate stats from filtered data
  const filteredStats = useMemo(() => {
    return getConnectionStats(filteredConnections);
  }, [filteredConnections]);

  // Generate chart data from filtered connections
  const chartData = useMemo(() => {
    return getMonthlyConnectionData(filteredConnections);
  }, [filteredConnections]);

  const handleClearFilters = () => {
    setStartDate('');
    setEndDate('');
    setSelectedLocation('');
    setSearchQuery('');
  };

  // Determine chart title based on filters
  const getChartTitle = () => {
    if (startDate && endDate) {
      const start = new Date(startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      const end = new Date(endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      return `Contacts Added by Month (${start} - ${end})`;
    } else if (startDate) {
      const start = new Date(startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      return `Contacts Added by Month (From ${start})`;
    } else if (endDate) {
      const end = new Date(endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      return `Contacts Added by Month (Until ${end})`;
    } else if (selectedLocation) {
      return `Contacts Added by Month (${selectedLocation})`;
    }
    return 'Contacts Added by Month (5 Years)';
  };

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <h1 className="text-3xl font-bold text-slate-100 mb-8">View Chronicle</h1>
        
        {/* Connections Dashboard */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-slate-200 mb-4">Connections Dashboard</h2>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <StatsCard 
              title="Total Contacts" 
              value={filteredConnections.length.toLocaleString()} 
              subtitle="All time"
              color="blue" 
            />
            <StatsCard 
              title="Avg / Month" 
              value={filteredStats.avgMonthly.toString()} 
              subtitle="Connections per month"
              color="green" 
            />
            <StatsCard 
              title="Peak Month" 
              value={filteredStats.peakMonth} 
              subtitle={`${filteredStats.peakCount} connections`}
              color="orange" 
            />
            <StatsCard 
              title="High-Activity Months" 
              value={`${filteredStats.activityPercentage}%`} 
              subtitle="Monthly activity"
              color="yellow" 
            />
          </div>

          {/* Chart and Filter Panel - Side by Side */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-8">
            {/* Chart - Takes 3/4 width on the LEFT */}
            <div className="lg:col-span-3">
              <div className="dark-card rounded-lg shadow-xl p-6">
                <h3 className="text-lg font-semibold text-slate-200 mb-4">{getChartTitle()}</h3>
                <MonthlyChart monthlyData={chartData} />
              </div>
            </div>

            {/* Filter Panel - Takes 1/4 width on the RIGHT */}
            <div className="lg:col-span-1">
              <FilterPanel
                locations={locations}
                startDate={startDate}
                setStartDate={setStartDate}
                endDate={endDate}
                setEndDate={setEndDate}
                selectedLocation={selectedLocation}
                setSelectedLocation={setSelectedLocation}
                onClearFilters={handleClearFilters}
              />
            </div>
          </div>
        </div>

        {/* Full Width Table */}
        <div className="dark-card rounded-lg shadow-xl">
          <div className="p-6 border-b border-slate-600">
            <h3 className="text-lg font-semibold text-slate-200">Exportable Table of Contacts With Ability to Search or Append Notes</h3>
          </div>
          <div className="p-6">
            <div className="mb-6">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search contacts by name, company, position, or email..."
                  className="dark-input w-full px-4 py-3 pl-12 rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none transition-all"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                  </svg>
                </div>
              </div>
              <p className="text-sm text-slate-400 mt-3">Showing {filteredConnections.length} of {connections.length} contacts</p>
            </div>
            <ContactsTable connections={filteredConnections} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewChronicle;
