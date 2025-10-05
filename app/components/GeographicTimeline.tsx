"use client";

import React, { useState, useMemo } from "react";
import { Location } from "../../lib/data";
import GeoMap from "./GeoMap";

interface GeographicTimelineProps {
  locations: Location[];
}

const GeographicTimeline: React.FC<GeographicTimelineProps> = ({
  locations,
}) => {
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  const filteredLocations = useMemo(() => {
    let filtered = locations;

    if (startDate) {
      const start = new Date(startDate);
      filtered = filtered.filter(
        (location) => new Date(location.start_date) >= start
      );
    }

    if (endDate) {
      const end = new Date(endDate);
      filtered = filtered.filter(
        (location) => new Date(location.start_date) <= end
      );
    }

    return filtered.sort(
      (a, b) =>
        new Date(a.start_date).getTime() - new Date(b.start_date).getTime()
    );
  }, [locations, startDate, endDate]);

  const handleClearFilters = () => {
    setStartDate("");
    setEndDate("");
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const calculateDuration = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : new Date();
    const durationMs = end.getTime() - start.getTime();
    const durationMonths = Math.round(
      durationMs / (1000 * 60 * 60 * 24 * 30.44)
    );
    const years = Math.floor(durationMonths / 12);
    const months = durationMonths % 12;

    if (years > 0 && months > 0) {
      return `${years} year${years > 1 ? "s" : ""} ${months} month${
        months > 1 ? "s" : ""
      }`;
    } else if (years > 0) {
      return `${years} year${years > 1 ? "s" : ""}`;
    } else {
      return `${months} month${months > 1 ? "s" : ""}`;
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <h1 className="text-3xl font-bold text-slate-100 mb-8">
          Geographic Timeline
        </h1>

        {/* Map synced with filtered locations */}
        <div className="mb-8">
          <GeoMap
            points={filteredLocations
              .filter(
                (l) =>
                  typeof (l as any).lat === "number" &&
                  typeof (l as any).lng === "number"
              )
              .map((l) => ({
                city: l.city,
                state: l.state,
                start_date: l.start_date,
                end_date: l.end_date || null,
                lat: (l as any).lat,
                lng: (l as any).lng,
              }))}
          />
        </div>

        {/* Filter Panel */}
        <div className="mb-8">
          <div className="dark-card rounded-lg shadow-xl p-6">
            <h3 className="text-lg font-semibold text-slate-200 mb-6">
              Filter Timeline
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Start Date
                </label>
                <input
                  type="date"
                  className="dark-input w-full px-3 py-2 rounded-lg text-slate-100 focus:outline-none transition-all"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  End Date
                </label>
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

        {/* Geographic Timeline Table */}
        <div className="dark-card rounded-lg shadow-xl">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-slate-200 mb-4">
              Locations Lived
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-700">
                <thead className="bg-slate-800">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                      City, State
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
                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-slate-900 divide-y divide-slate-700">
                  {filteredLocations.map((location, index) => {
                    const isCurrent =
                      !location.end_date || location.end_date.trim() === "";
                    const duration = calculateDuration(
                      location.start_date,
                      location.end_date || ""
                    );

                    return (
                      <tr
                        key={index}
                        className="hover:bg-slate-700 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-100">
                          {location.city}, {location.state}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                          {formatDate(location.start_date)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                          {isCurrent
                            ? "Present"
                            : formatDate(location.end_date)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                          {duration}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              isCurrent
                                ? "bg-green-100 text-green-800"
                                : "bg-slate-100 text-slate-800"
                            }`}
                          >
                            {isCurrent ? "Current" : "Past"}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {filteredLocations.length === 0 && (
              <div className="text-center py-8">
                <p className="text-slate-400">
                  No locations found for the selected date range.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Summary Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="dark-card rounded-lg shadow-xl p-6">
            <h3 className="text-sm font-medium text-slate-300 uppercase tracking-wide mb-2">
              Total Locations
            </h3>
            <p className="text-3xl font-bold text-blue-400">
              {filteredLocations.length}
            </p>
            <p className="text-sm text-slate-500">Cities lived in</p>
          </div>
          <div className="dark-card rounded-lg shadow-xl p-6">
            <h3 className="text-sm font-medium text-slate-300 uppercase tracking-wide mb-2">
              Current Location
            </h3>
            <p className="text-lg font-bold text-emerald-400">
              {filteredLocations.find(
                (loc) => !loc.end_date || loc.end_date.trim() === ""
              )?.city || "N/A"}
            </p>
            <p className="text-sm text-slate-500">Present residence</p>
          </div>
          <div className="dark-card rounded-lg shadow-xl p-6">
            <h3 className="text-sm font-medium text-slate-300 uppercase tracking-wide mb-2">
              Longest Stay
            </h3>
            <p className="text-lg font-bold text-orange-400">
              {filteredLocations.length > 0
                ? filteredLocations.reduce((longest, current) => {
                    const currentDuration =
                      new Date(current.end_date || new Date()).getTime() -
                      new Date(current.start_date).getTime();
                    const longestDuration =
                      new Date(longest.end_date || new Date()).getTime() -
                      new Date(longest.start_date).getTime();
                    return currentDuration > longestDuration
                      ? current
                      : longest;
                  }).city
                : "N/A"}
            </p>
            <p className="text-sm text-slate-500">Most time spent</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeographicTimeline;
