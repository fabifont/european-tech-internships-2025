import type {
  ArrayStyle,
  ObjectStyle,
  SerializerOptions,
} from "./pathSerializer";

export type QuerySerializer = (query: Record<string, unknown>) => string;

export type BodySerializer = (body: any) => any;

export interface QuerySerializerOptions {
  allowReserved?: boolean;
  array?: SerializerOptions<ArrayStyle>;
  object?: SerializerOptions<ObjectStyle>;
}

const serializeFormDataPair = (data: FormData, key: string, value: unknown) => {
  if (typeof value === "string" || value instanceof Blob) {
    data.append(key, value);
  } else {
    data.append(key, JSON.stringify(value));
  }
};

const serializeUrlSearchParamsPair = (
  data: URLSearchParams,
  key: string,
  value: unknown,
) => {
  if (typeof value === "string") {
    data.append(key, value);
  } else {
    data.append(key, JSON.stringify(value));
  }
};

export const formDataBodySerializer = {
  bodySerializer: <T extends Record<string, any> | Record<string, any>[]>(
    body: T,
  ) => {
    const data = new FormData();

    Object.entries(body).forEach(([key, value]) => {
      if (value === undefined || value === null) {
        return;
      }
      if (Array.isArray(value)) {
        value.forEach((v) => serializeFormDataPair(data, key, v));
      } else {
        serializeFormDataPair(data, key, value);
      }
    });

    return data;
  },
};

export const jsonBodySerializer = {
  bodySerializer: <T>(body: T) =>
    JSON.stringify(body, (_key, value) =>
      typeof value === "bigint" ? value.toString() : value,
    ),
};

export const urlSearchParamsBodySerializer = {
  bodySerializer: <T extends Record<string, any> | Record<string, any>[]>(
    body: T,
  ) => {
    const data = new URLSearchParams();

    Object.entries(body).forEach(([key, value]) => {
      if (value === undefined || value === null) {
        return;
      }
      if (Array.isArray(value)) {
        value.forEach((v) => serializeUrlSearchParamsPair(data, key, v));
      } else {
        serializeUrlSearchParamsPair(data, key, value);
      }
    });

    return data.toString();
  },
};
