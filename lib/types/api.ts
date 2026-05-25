export type ApiResponse<TData = unknown, TErrors = Record<string, string[]>> = {
  success: boolean;
  message: string;
  data: TData;
  meta: string | null;
  errors?: TErrors | null;
};

export type ApiErrorResponse = {
  message: string;
  errors: Record<string, string[]>;
};
