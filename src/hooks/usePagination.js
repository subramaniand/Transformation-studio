/**
 * usePagination hook - Handle pagination logic
 */
import { useState, useMemo } from 'react';

export function usePagination(items = [], itemsPerPage = 10) {
  const [currentPage, setCurrentPage] = useState(1);

  const paginationData = useMemo(() => {
    const totalPages = Math.ceil(items.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentItems = items.slice(startIndex, endIndex);

    return {
      currentPage,
      totalPages,
      startIndex,
      endIndex,
      currentItems,
      hasPreviousPage: currentPage > 1,
      hasNextPage: currentPage < totalPages,
    };
  }, [items, currentPage, itemsPerPage]);

  const goToPage = (page) => {
    const totalPages = Math.ceil(items.length / itemsPerPage);
    const pageNumber = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(pageNumber);
  };

  const nextPage = () => {
    goToPage(currentPage + 1);
  };

  const previousPage = () => {
    goToPage(currentPage - 1);
  };

  return {
    ...paginationData,
    goToPage,
    nextPage,
    previousPage,
    setItemsPerPage,
  };
}

export default usePagination;
