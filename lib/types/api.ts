export type ApiStatus = "success" | "error" | "fail";

export type ApiResponse<TData = unknown, TErrors = Record<string, string[]>> = {
  status: ApiStatus;
  message: string;
  data: TData;
  meta: Record<string, unknown> | null;
  errors: TErrors | null;
};
