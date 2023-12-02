import { HttpClient, HttpRequest, VanillaHttpRequest } from "./HttpClient";
import axios, { AxiosInstance, AxiosResponse } from "axios";

export class HttpClientImpl implements HttpClient {
    private readonly _axiosInstance: AxiosInstance;

    constructor() {
        this._axiosInstance = axios.create({
        });
    }

    get<ResponseType = unknown>({
        url,
        params = undefined,
        headers = undefined,
        data = {},
    }: HttpRequest): Promise<AxiosResponse<ResponseType>> {
        console.log(data);
        return this.request({
            method: "GET",
            url: url,
            params,
            headers,
            data
        });
    }

    post<ResponseType = unknown>({
        url,
        params = undefined,
        headers = undefined,
        data = {}
    }: HttpRequest): Promise<AxiosResponse<ResponseType>> {
        return this.request({
            method: "POST",
            url: url,
            params,
            headers,
            data
        });
    }

    put<ResponseType = unknown>({
        url,
        params = undefined,
        headers = undefined,
        data = {}
    }: HttpRequest): Promise<AxiosResponse<ResponseType>> {
        return this.request({
            method: "PUT",
            url: url,
            params,
            headers,
            data
        });
    }

    delete<ResponseType = unknown>({
        url,
        params = undefined,
        headers = undefined,
        data = {}
    }: HttpRequest): Promise<AxiosResponse<ResponseType>> {
        return this.request({
            method: "DELETE",
            url: url,
            params,
            headers,
            data
        });
    }

    request<ResponseType = unknown>({
        url,
        params = undefined,
        data = {},
        headers = undefined,
        method = "GET",
    }: VanillaHttpRequest): Promise<AxiosResponse<ResponseType>> {
        console.log("data fina", data);
        return this._axiosInstance({
            method,
            url: "/api" + url,
            params,
            data,
            headers,
            withCredentials: false,
        });
    }
}
