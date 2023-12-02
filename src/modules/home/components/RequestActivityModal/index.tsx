import React, {Dispatch, SetStateAction, useContext, useEffect, useState} from 'react';
import styles from "./styles.module.scss";
import EventComponent from "../EventComponent";
import {useFetchEventResponses} from "../../hooks/useFetchEventResponses";
import {EventModel} from "../../model/EventModel";
import sunset from "../../../../assets/sunset.webp";
import {AuthenticationContext} from "../../../../AuthenticationContext";
import {Navigate, useNavigate} from "react-router";
import * as yup from "yup";
import {useMutation} from "react-query";
import {SignInAttemptModel} from "../../../sign-in/model/SignInAttemptModel";
import {httpClient} from "../../../../shared/infra/httpClient";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import {EventResponseSendModel} from "../../model/EventResponseSendModel";
import cookiesHandler from "../../../../shared/infra/cookiesHandler";
import {Config} from "../../../../shared/utils/Config";

export type RequestActivityModalProps = {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
    event: EventModel;
    [key: string]: unknown;
}

function RequestActivityModal({open, setOpen, event}: RequestActivityModalProps){


    const [errorMessage, setErrorMessage] = useState<string>("");

    const navigate = useNavigate();

    const schema = yup.object().shape({
        message: yup.string().max(1024).required(),
        eventId: yup.number().required()
    });

    const { mutate } = useMutation({
        mutationFn: async (values: EventResponseSendModel) => {
            const headers = {
                Authorization: cookiesHandler.get(Config.token) ?? "",
            }

            return await httpClient.post({
                url: "/notification/send",
                data: values,
                headers
            });
        },
        onSuccess: (res) => {

            if(res.status == 200) {
                setOpen(false);
                reset();
            } else {
                setErrorMessage("Bad response. Try again.");
            }
        },
        onError: (error: any) => {
            if(error.response) {
                if(error.response.status === 401) {
                    setErrorMessage("Wrong credentials");
                } else if (error.response.status >= 500) {
                    setErrorMessage("Server side error, try again.");
                } else {
                    setErrorMessage("Unknown error.");
                }
            } else {
                setErrorMessage("Network connection error");
            }
        }
    });

    const {
        handleSubmit,
        register,
        formState: {errors},
        reset
    } = useForm<EventResponseSendModel>({
        resolver: yupResolver(schema)
    });


    if(!open) {
        return <></>;
    }

    const date = new Date(event.plannedOn);

    return(
        <div className={styles.container}>
            <div className={styles.box}>
                <img src={sunset} width="100%"/>
                <p>Watching sunset and finishing</p>
                <p>{event.creator.name}</p>
                <p>{event.creator.birthYear}</p>
                <p className={styles.date}>{date.toLocaleDateString()}, {date.toLocaleTimeString()}</p>
                <form onSubmit={handleSubmit((values) => mutate(values))}>
                    {errorMessage !== "" && <label className={styles.error}>{errorMessage}</label>}
                    {errors.message && <label className={styles.error}>{errors.message.message}</label>}
                    <textarea {...register("message")}></textarea>
                    <input type="hidden" value={event.id} {...register("eventId")}/>
                    <div className={styles.button_flex}>
                        <button onClick={() => setOpen(false)}>Close</button>
                        <button type={"submit"}>Send</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
export default RequestActivityModal;