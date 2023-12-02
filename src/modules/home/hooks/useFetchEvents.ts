import {Coords} from "../pages/Home";
import {Dispatch, SetStateAction, useEffect, useState} from "react";
import {EventModel} from "../model/EventModel";
import {useQuery} from "react-query";
import {httpClient} from "../../../shared/infra/httpClient";
import {AxiosResponse} from "axios";
import cookiesHandler from "../../../shared/infra/cookiesHandler";
import {Config} from "../../../shared/utils/Config";

export const useFetchEvents = (setAuthenticated: Dispatch<SetStateAction<boolean>>) => {

    const [coords, setCoords] = useState<Coords>();




    const fetchData = () => {
        const headers = {
            Authorization: cookiesHandler.get(Config.token) ?? "",
        }

        let params = {}

        if(coords) {
            params = {
                ...coords
            };
        }



        return httpClient.post<EventModel[]>({url: "/event/area/20", data: coords, headers}).then((res: AxiosResponse<EventModel[]>) => {
            if(res.data) {
                return res.data;
            }
            throw res;
        }).catch((err) => {
            if(err.response && err.response.status == 403) {
                setAuthenticated(false);
            }
            throw err;
        });
    }

    // const {data, isLoading} = useQuery<EventModel[]>(['events', coords], fetchData);

    return {
        events: [],
        //isLoading,
        coords,
        setCoords
    }
}