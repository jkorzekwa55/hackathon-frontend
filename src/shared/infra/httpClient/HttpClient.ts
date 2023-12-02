import { AxiosResponse } from "axios";

/**
 * Http request frame
 * @param {string} url
 * @param {unknown} [data] data to send, preferred an object
 * @param {object} [params] uri params
 * @param {object} [headers] request headers
 */
export type HttpRequest = {
    url: string;
    data?: unknown;
    params?: { [P in string]: string };
    headers?: { [P in string]: string };
};

/**
 * Vanilla request - with method specified
 * @param {string} url
 * @param {unknown} [data] data to send, preferred an object
 * @param {object} [params] uri params
 * @param {object} [headers] request headers
 * @param {string} method http method
 */
export type VanillaHttpRequest = {
    url: string;
    data?: unknown;
    params?: { [P in string]: string };
    headers?: { [P in string]: string };
    method: string;
};

/**
 * Data (body) of sign in attempt request
 * @param {string} email used as login
 */
export type SignInAttemptData = {
    email: string;
};

/**
 * Sign in request parameters
 * @param {SignInAttemptData} data data to send
 * @param {string} [method="POST"] request method
 * @param {(response: AxiosResponse) => boolean} [checkSuccess] check and return if succeed
 */
export type SignInAttemptRequestData = {
    data: SignInAttemptData;
    method?: string;
    checkSuccess?: (response: AxiosResponse) => boolean;
};

/**
 * Request used to sign in attempt
 */
export type SignInAttemptRequest = HttpRequest & SignInAttemptRequestData;

/**
 * Data (body) of email verification request
 * @param {string} email
 * @param {string} code code from email
 */
export type SignInEmailCodeData = {
    email: string;
    code: string;
};

/**
 * Sign in response data
 * @param {string} accessToken user access token
 * @param {string} refreshToken user refresh token
 * @param {boolean} [initialized] is user initialized
 * @param {[properties: string]: unknown} [] any other properties
 */
export type SignInEmailCodeResponse = {
    accessToken: string;
    refreshToken: string;
    initialized?: boolean;
    [properties: string]: unknown;
};

/**
 * Sign in request parameters
 * @param {SignInEmailCodeData} data data to send
 * @param {string} [method="POST"] request method (can be overridden)
 * @param {(response: AxiosResponse) => boolean} [checkSuccess] check and return success
 */
export type SignInEmailCodeRequestData = {
    data: SignInEmailCodeData;
    method?: string;
    transformResponse?: (response: AxiosResponse) => SignInEmailCodeResponse;
};

/**
 * Sign in email code verification parameters
 */
export type SignInEmailCodeRequest = HttpRequest & SignInEmailCodeRequestData;

/**
 * Response for complete data request. This response type may be overridden.
 * @param {boolean} initialized is (or was) user account initialized
 * @param {[properties: string]: unknown} [] any other properties
 */
export type SignInCompleteDataResponse = {
    initialized: boolean;
    [properties: string]: unknown;
};

/**
 * Data to complete user information request.
 * @param {string} [method] http method
 * @param {(response: AxiosResponse) => SignInCompleteDataResponse} [transformReponse] transform response to get body
 * in proper type. It is used to infer if account is initialized. If this information is not provided
 * initialization state does not change
 * @param {(response: AxiosResponse) => boolean} [checkSuccess] check if data was provided. used only to return proper
 * value in success property.
 */
export type SignInCompleteDataRequestData = {
    method?: string;
    transformResponse?: (response: AxiosResponse) => SignInCompleteDataResponse;
    checkSuccess?: (response: AxiosResponse) => boolean;
};

/**
 * Request to fill user information (initialize), before user can start using app.
 */
export type SignInCompleteDataRequest = SignInCompleteDataRequestData & HttpRequest;

/**
 * Sign out request parameters
 * @param {string} [method="POST"] http method
 * @param {(response: AxiosResponse) => boolean} [checkSuccess] function to check if sign out succeed
 */
export type SignOutRequestData = {
    method?: string;
    checkSuccess?: (response: AxiosResponse) => boolean;
};

/**
 * Sign out request parameters
 */
export type SignOutRequest = SignOutRequestData & HttpRequest;

/**
 * Response frame.
 * @param {boolean} succeed was request successful.
 * @param {AxiosResponse<ResponseType>} response actual axios response.
 * @param {boolean | null} initialized is user account initialized now. null if user is not signed in.
 * @param {boolean} signedIn is user signed in now
 */
export type DirectStatusResponse<ResponseType = unknown> = {
    succeed: boolean;
    response: AxiosResponse<ResponseType>;
    initialized: boolean | null;
    signedIn: boolean;
};

/**
 * Data for refresh session request. Refresh token is automatically retrieved from cookies.
 * To add refresh token (if don't have any) make proper request to sign in and transform data correctly.
 * Token will be saved from transformed data.
 * @param {string} [method] http method
 * @param {(response: AxiosResponse) => RefreshSessionResponse} [transformReponse] transform response to get body
 * in proper type. It is used to get token if body returned in other format than default. Refresh token will be
 * **automatically** saved.
 */
export type RefreshSessionRequestData = {
    method?: string;
    transformResponse?: (response: AxiosResponse) => RefreshSessionResponse;
};

/**
 * request data to refresh session.
 */
export type RefreshSessionRequest = RefreshSessionRequestData & HttpRequest;

/**
 * Data which should be default returned by this request. Alternatively it can be determined
 * from transformResponse function
 * @param {string} accessToken user access token
 * @param {string} refreshToken user refresh token
 * @param {boolean} [initialized] is user initialized
 * @param {[properties: string]: unknown} [] optional additional properties
 */
export type RefreshSessionResponse = {
    refreshToken: string;
    accessToken: string;
    initialized?: boolean;
    [properties: string]: unknown;
};

/**
 * Authentication http client
 */
export interface HttpEmailCodeSignInClient {
    /**
     * request to attempt sign in
     * @template {unknown} ResponseType response type defined by user
     * @param {SignInAttemptData} data
     * @returns {Promise<boolean>} was request succeed
     */
    signInAttempt<ResponseType = unknown>(data: SignInAttemptRequest): Promise<DirectStatusResponse<ResponseType>>;

    /**
     * request to verify code from email
     * @template {SignInEmailCodeResponse} ResponseType response type defined by user
     * @param {SignInEmailCodeRequest} data
     * @returns {Promise<boolean>} was user signed in
     */
    signInVerifyCode<ResponseType = SignInEmailCodeResponse>(
        data: SignInEmailCodeRequest,
    ): Promise<DirectStatusResponse<ResponseType>>;

    /**
     * request to fill sign in data tin initialize account
     * @template {SignInCompleteDataResponse} ResponseType response type defined by user
     * @param {SignInCompleteDataRequest} data
     * @returns {Promise<DirectStatusResponse>} returns if data was filled
     */
    signInCompleteData?<ResponseType = SignInCompleteDataResponse>(
        data: SignInCompleteDataRequest,
    ): Promise<DirectStatusResponse<ResponseType>>;

    /**
     * request to sign out
     * @template {unknown} ResponseType response type defined by user
     * @param {SignOutRequest} data
     * @returns {Promise<boolean>} if sign out succeeded
     */
    signOut<ResponseType = unknown>(data: SignOutRequest): Promise<DirectStatusResponse<ResponseType>>;

    /**
     * checks if user is signed in
     * @returns {boolean} sign in status - true means user is signed in
     */
    isSignedIn(): boolean;

    /**
     * checks if user is initialized
     * @returns {boolean} initialized status
     */
    isInitialized(): boolean;

    /**
     * function runs on sign out event (even if it's by token expiration) and can be overridden.
     *
     * @default deletes cookies
     * @type {() => void | undefined}
     */
    onSignOut: () => void;

    /**
     * function runs after onSignOut().
     * can be overridden.
     * @default no action after sign out
     * @type {() => void | undefined}
     */
    afterSignOut: () => void;

    /**
     * sets base url and saves it to memory. base url will be used as prefix to url used in requests.
     * @param {string} url
     * @return {void}
     */
    setBaseUrl(url: string): void;

    /**
     * refresh session - get and save new access token
     *
     * @param data
     */
    refreshSession<ResponseType = RefreshSessionResponse>(
        data: RefreshSessionRequest,
    ): Promise<DirectStatusResponse<ResponseType>>;
}

/**
 * Http client with basic methods
 */
export interface HttpClient {
    /**
     * http request using GET method with custom response format
     * @template {unknown} ResponseType response type defined by user
     * @param {HttpRequest} data request parameters and body
     * @returns {ResponseType} response in custom type
     */
    get<ResponseType = unknown>(data: HttpRequest): Promise<AxiosResponse<ResponseType>>;

    /**
     * http request using POST method with custom response format
     * @template {unknown} ResponseType response type defined by user
     * @param {HttpRequest} data request parameters and body
     * @returns {ResponseType} response in custom type
     */
    post<ResponseType = unknown>(data: HttpRequest): Promise<AxiosResponse<ResponseType>>;

    /**
     * http request using PUT method with custom response format
     * @template {unknown} ResponseType response type defined by user
     * @param {HttpRequest} data request parameters and body
     * @returns {ResponseType} response in custom type
     */
    put<ResponseType = unknown>(data: HttpRequest): Promise<AxiosResponse<ResponseType>>;

    /**
     * http request using DELETE method with custom response format
     * @template {unknown} ResponseType response type defined by user
     * @param {HttpRequest} data request parameters and body
     * @returns {ResponseType} response in custom type
     */
    delete<ResponseType = unknown>(data: HttpRequest): Promise<AxiosResponse<ResponseType>>;

    /**
     * http request using any method with custom response format
     * @template {unknown} ResponseType response type defined by user
     * @param {VanillaHttpRequest} data request parameters and body (method included)
     * @returns {ResponseType} response in custom type
     */
    request<ResponseType = unknown>(data: VanillaHttpRequest): Promise<AxiosResponse<ResponseType>>;
}

/**
 * Http authentication client, which makes requests and manages session
 */
export type HttpAuthClient = HttpClient & HttpEmailCodeSignInClient;
