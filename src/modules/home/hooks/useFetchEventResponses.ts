import {EventModel} from "../model/EventModel";
import {useQuery} from "react-query";
import {httpClient} from "../../../shared/infra/httpClient";
import {AxiosResponse} from "axios";
import cookiesHandler from "../../../shared/infra/cookiesHandler";
import {Config} from "../../../shared/utils/Config";
import {EventResponseModel} from "../model/EventResponseModel";

export const useFetchEventResponses = () => {

    const fetchData = () => {
        const headers = {
            Authorization: cookiesHandler.get(Config.token) ?? "",
        }



        return httpClient.get<EventResponseModel[]>({url: "/user/notifications", headers}).then((res: AxiosResponse<EventResponseModel[]>) => {
            if(res.data) {
                return res.data;
            }
            throw res;
        });
    }

    const {data, isLoading} = useQuery<EventResponseModel[]>(['notifications'], fetchData);

    return {
        events: data,
        isLoading,
    }
}