// This file is auto-generated by @hey-api/openapi-ts

/**
 * HTTPValidationError
 */
export type HttpValidationError = {
  /**
   * Detail
   */
  detail?: ValidationError[];
};

/**
 * JobRead
 */
export type JobRead = {
  /**
   * Link
   */
  link: string;
  /**
   * Title
   */
  title: string;
  /**
   * Location
   */
  location: string;
  /**
   * Company
   */
  company: string;
  /**
   * Description
   */
  description?: string | null;
  /**
   * Employment Type
   */
  employment_type?: string | null;
  /**
   * Seniority Level
   */
  seniority_level?: string | null;
  /**
   * Job Function
   */
  job_function?: string | null;
  /**
   * Industries
   */
  industries?: string | null;
};

/**
 * ValidationError
 */
export type ValidationError = {
  /**
   * Location
   */
  loc: Array<string | number>;
  /**
   * Message
   */
  msg: string;
  /**
   * Error Type
   */
  type: string;
};

export type UtilsHealthcheckData = {
  body?: never;
  path?: never;
  query?: never;
  url: "/api/healthcheck/";
};

export type UtilsHealthcheckResponses = {
  /**
   * Response Utils-Healthcheck
   * Successful Response
   */
  200: boolean;
};

export type UtilsHealthcheckResponse =
  UtilsHealthcheckResponses[keyof UtilsHealthcheckResponses];

export type JobsGetJobsData = {
  body?: never;
  path?: never;
  query?: {
    /**
     * Page
     */
    page?: number;
    /**
     * Limit
     */
    limit?: number;
    /**
     * Search
     */
    search?: string;
  };
  url: "/api/jobs";
};

export type JobsGetJobsErrors = {
  /**
   * Validation Error
   */
  422: HttpValidationError;
};

export type JobsGetJobsError = JobsGetJobsErrors[keyof JobsGetJobsErrors];

export type JobsGetJobsResponses = {
  /**
   * Response Jobs-Get Jobs
   * Successful Response
   */
  200: JobRead[];
};

export type JobsGetJobsResponse =
  JobsGetJobsResponses[keyof JobsGetJobsResponses];

export type JobsGetJobsAdvancedData = {
  body?: never;
  path?: never;
  query?: {
    /**
     * Page
     */
    page?: number;
    /**
     * Limit
     */
    limit?: number;
    /**
     * Title
     */
    title?: string[];
    /**
     * Company
     */
    company?: string[];
    /**
     * Location
     */
    location?: string[];
    /**
     * Description
     */
    description?: string[];
  };
  url: "/api/jobs/advanced";
};

export type JobsGetJobsAdvancedErrors = {
  /**
   * Validation Error
   */
  422: HttpValidationError;
};

export type JobsGetJobsAdvancedError =
  JobsGetJobsAdvancedErrors[keyof JobsGetJobsAdvancedErrors];

export type JobsGetJobsAdvancedResponses = {
  /**
   * Response Jobs-Get Jobs Advanced
   * Successful Response
   */
  200: JobRead[];
};

export type JobsGetJobsAdvancedResponse =
  JobsGetJobsAdvancedResponses[keyof JobsGetJobsAdvancedResponses];

export type ClientOptions = {
  baseUrl: `${string}://${string}` | (string & {});
};
