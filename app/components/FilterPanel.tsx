'use client';
import React from 'react';
import { Location } from '../../lib/data';

interface FilterPanelProps {
  locations: Location[];
  startDate: string;
  setStartDate: (date: string) => void;
  endDate: string;
  setEndDate: (date: string) => void;
  selectedLocation: string;
  setSelectedLocation: (location: string) => void;
  onClearFilters: () => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  locations,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  selectedLocation,
  setSelectedLocation,
  onClearFilters,
}) => {
  return (
    <div className="dark-card rounded-lg shadow-xl p-6">
      <h3 className="text-lg font-semibold text-slate-200 mb-6">Filter Panel</h3>
      
      <div className="mb-6">
        <label className="block text-sm font-medium text-slate-300 mb-3">Date Range</label>
        <div className="space-y-3">
          <input
            type="date"
            className="dark-input w-full px-3 py-2 rounded-lg text-slate-100 focus:outline-none transition-all"
            placeholder="Start date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <input
            type="date"
            className="dark-input w-full px-3 py-2 rounded-lg text-slate-100 focus:outline-none transition-all"
            placeholder="End date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-slate-300 mb-3">Location</label>
        <select
          className="dark-input w-full px-3 py-2 rounded-lg text-slate-100 focus:outline-none transition-all"
          value={selectedLocation}
          onChange={(e) => setSelectedLocation(e.target.value)}
        >
          <option value="">All Locations</option>
          {locations.map((loc) => (
            <option key={`${loc.city}-${loc.state}`} value={loc.city}>
              {loc.city}, {loc.state}
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={onClearFilters}
        className="w-full px-4 py-2 bg-slate-700 text-slate-200 rounded-lg hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 focus:ring-offset-slate-800 transition-all"
      >
        Clear Filters
      </button>
    </div>
  );
};

export default FilterPanel;
