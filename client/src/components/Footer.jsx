import React from 'react'

const Footer = ({ paginationData }) => {
    const { page = 1, totalPages = 1, onPageChange } = paginationData || {};

    const handlePrevious = () => {
        if (onPageChange && page > 1) {
            onPageChange(Math.max(page - 1, 1));
        }
    };

    const handleNext = () => {
        if (onPageChange && page < totalPages) {
            onPageChange(Math.min(page + 1, totalPages));
        }
    };

    return (
        <footer className='footer-container border-t-2 border-dashed border-slate-800 bg-gray-900 text-gray-200'>
            <div className='p-1 flex items-center justify-between gap-3'>
                <button
                    disabled={page <= 1}
                    onClick={handlePrevious}
                    className='px-4 py-2 rounded bg-gray-900 text-gray-200 disabled:opacity-50 hover:bg-gray-800'
                >Previous</button>
                <span className='text-gray-200'>Page {page} of {totalPages}</span>
                <button
                    disabled={page >= totalPages}
                    onClick={handleNext}
                    className='px-4 py-2 rounded bg-gray-900 text-gray-200 disabled:opacity-50 hover:bg-gray-800'
                >Next</button>
            </div>
        </footer>
    )
}

export default Footer;
