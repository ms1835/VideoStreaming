import React from 'react';

const Pagination = ({ page, totalPages, onPreviousPage, onNextPage }) => {
    if (totalPages <= 1) return null;

    return (
        <div className='mt-4 flex items-center justify-between gap-4 bg-slate-900 py-2 border-t border-gray-700'>
            <button
                disabled={page <= 1}
                onClick={onPreviousPage}
                className='px-4 py-2 rounded bg-emerald-500 text-gray-200 disabled:opacity-50 disabled:bg-gray-700 hover:bg-emerald-600'
            >
                Previous
            </button>
            <span className='text-gray-200'>Page {page} of {totalPages}</span>
            <button
                disabled={page >= totalPages}
                onClick={onNextPage}
                className='px-4 py-2 rounded bg-emerald-500 text-gray-200 disabled:opacity-50 disabled:bg-gray-700 hover:bg-emerald-600'
            >
                Next
            </button>
        </div>
    );
};

export default Pagination;
