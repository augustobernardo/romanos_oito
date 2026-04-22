import type { FormData } from "./schema";

export type { FormData };

export type FormInstance = ReturnType<typeof import("react-hook-form").useForm<FormData>>;
