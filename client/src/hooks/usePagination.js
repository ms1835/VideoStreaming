import { useState } from 'react';

export const usePagination = (initialPage = 1, initialTotalPages = 1) => {
    const [page, setPage] = useState(initialPage);
    const [totalPages, setTotalPages] = useState(initialTotalPages);

    const handlePreviousPage = () => {
        if (page > 1) {
            setPage(Math.max(page - 1, 1));
        }
    };

    const handleNextPage = () => {
        if (page < totalPages) {
            setPage(Math.min(page + 1, totalPages));
        }
    };

    return {
        page,
        totalPages,
        setPage,
        setTotalPages,
        handlePreviousPage,
        handleNextPage
    };
};
