const allowedSortFields = new Set([
  "createdAt",
  "updatedAt",
  "title",
  "name",
  "priority",
  "dueDate",
  "startDate",
]);

export const getSort = (
  sortBy = "createdAt",
  sortOrder: "asc" | "desc" = "desc"
): Record<string, SortOrder> => {
  const field = allowedSortFields.has(sortBy) ? sortBy : "createdAt";
  const direction: SortOrder = sortOrder === "asc" ? 1 : -1;

  return { [field]: direction };
};
import { SortOrder } from "mongoose";
