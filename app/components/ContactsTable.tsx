'use client';
import React, { useState, useMemo } from 'react';
import { Connection } from '../../lib/data';

interface ContactsTableProps {
  connections: Connection[];
}

type SortKey = keyof Connection | '';
type SortDirection = 'asc' | 'desc';

const ContactsTable: React.FC<ContactsTableProps> = ({ connections }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);
  const [sortKey, setSortKey] = useState<SortKey>('connected_on');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const sortedConnections = useMemo(() => {
    if (!sortKey) return connections;

    return [...connections].sort((a, b) => {
      const aValue = a[sortKey as keyof Connection];
      const bValue = b[sortKey as keyof Connection];

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [connections, sortKey, sortDirection]);

  const totalPages = Math.ceil(sortedConnections.length / itemsPerPage);
  const currentConnections = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedConnections.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedConnections, currentPage, itemsPerPage]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  const getSortIndicator = (key: SortKey) => {
    if (sortKey !== key) return '';
    return sortDirection === 'asc' ? '↑' : '↓';
  };

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="min-w-full dark-table">
          <thead>
            <tr className="border-b border-slate-600">
              <th
                className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider cursor-pointer hover:text-slate-200 transition-colors"
                onClick={() => handleSort('first_name')}
              >
                Name {getSortIndicator('first_name')}
              </th>
              <th
                className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider cursor-pointer hover:text-slate-200 transition-colors"
                onClick={() => handleSort('company')}
              >
                Company {getSortIndicator('company')}
              </th>
              <th
                className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider cursor-pointer hover:text-slate-200 transition-colors"
                onClick={() => handleSort('position')}
              >
                Position {getSortIndicator('position')}
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                Email
              </th>
              <th
                className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider cursor-pointer hover:text-slate-200 transition-colors"
                onClick={() => handleSort('connected_on')}
              >
                Connected On<span className="ml-2 text-blue-400">{getSortIndicator('connected_on')}</span>
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                LinkedIn
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                Notes
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-600">
            {currentConnections.map((connection, index) => (
              <tr key={index} className="hover:bg-slate-700/30 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-slate-200">
                    {connection.first_name} {connection.last_name}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-slate-300">{connection.company}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-slate-300">{connection.position}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-slate-300">{connection.email_address}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-slate-300">
                    {new Date(connection.connected_on).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <a
                    href={connection.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 text-sm transition-colors"
                  >
                    View Profile
                  </a>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button className="text-sm text-slate-400 hover:text-slate-300 transition-colors">
                    Add Note
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {connections.length > itemsPerPage && (
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-slate-400">
            Showing {((currentPage - 1) * itemsPerPage) + 1} to{' '}
            {Math.min(currentPage * itemsPerPage, connections.length)} of{' '}
            {connections.length} results
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 text-sm bg-slate-700 text-slate-200 rounded hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            <span className="px-3 py-1 text-sm text-slate-300">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 text-sm bg-slate-700 text-slate-200 rounded hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactsTable;
