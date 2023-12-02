import { HttpClientImpl } from "./HttpClientImpl";

const providers = {
    httpClient: new HttpClientImpl(),
};

export const httpClient = providers.httpClient;
