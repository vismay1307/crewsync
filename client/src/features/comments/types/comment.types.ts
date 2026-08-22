export type GetCommentsParams = {
  page?: number;
  limit?: number;
};

export type CreateCommentRequest = {
  body: string;
};

export type UpdateCommentRequest = CreateCommentRequest;
