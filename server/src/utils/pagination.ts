export interface PaginationOptions {
  page?: number;
  limit?: number;
}

export const getPagination = (options: PaginationOptions = {}) => {
  const page = Math.max(Number(options.page ?? 1), 1);
  const limit = Math.min(Math.max(Number(options.limit ?? 20), 1), 100);
  const skip = (page - 1) * limit;

  return { page, limit, skip };
};

export const buildPaginationMeta = (
  totalItems: number,
  currentPage: number,
  limit: number
) => {
  const totalPages = Math.ceil(totalItems / limit);

  return {
    totalItems,
    totalPages,
    currentPage,
    limit,
    hasNextPage: currentPage < totalPages,
    hasPreviousPage: currentPage > 1,
  };
};
