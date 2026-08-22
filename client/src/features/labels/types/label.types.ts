export type GetLabelsParams = {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
};

export type CreateLabelRequest = {
  name: string;
  color: string;
  description?: string;
};

export type UpdateLabelRequest = Partial<CreateLabelRequest>;
