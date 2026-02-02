import React from 'react';

export default function Table({ headers, children, className = '' }) {
    return (
        <div className={`overflow-x-auto rounded-xl border border-gray-100 ${className}`}>
            <table className="min-w-full divide-y divide-gray-200 bg-white">
                <thead className="bg-gray-50">
                    <tr>
                        {headers.map((header, index) => (
                            <th
                                key={index}
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                            >
                                {header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                    {children}
                </tbody>
            </table>
        </div>
    );
}

export const TableRow = ({ children, className = '' }) => (
    <tr className={`hover:bg-gray-50 transition-colors ${className}`}>
        {children}
    </tr>
);

export const TableCell = ({ children, className = '' }) => (
    <td className={`px-6 py-4 whitespace-nowrap text-sm text-gray-700 ${className}`}>
        {children}
    </td>
);
