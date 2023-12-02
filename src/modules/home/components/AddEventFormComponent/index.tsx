import React, {Dispatch, SetStateAction, useState} from 'react';
import styles from "./styles.module.scss";
import user from "../../../../assets/user.svg";
import calendar from "../../../../assets/calendar.svg";
import save from "../../../../assets/save.svg";
import arrowRight from "../../../../assets/arrow_right.svg";
import {useNavigate} from "react-router";
import {Coords} from "../../pages/Home";
import * as yup from "yup";
import {useMutation} from "react-query";
import {EventResponseSendModel} from "../../model/EventResponseSendModel";
import cookiesHandler from "../../../../shared/infra/cookiesHandler";
import {Config} from "../../../../shared/utils/Config";
import {httpClient} from "../../../../shared/infra/httpClient";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import {EventPostModel} from "../../model/EventPostModel";

export type AddEventFormComponentProps = {
    open: boolean;
    coords: Coords | null;
    setOpen: Dispatch<SetStateAction<boolean>>;
    [key: string]: unknown;
}

function AddEventFormOpenComponent({open, setOpen, coords}: AddEventFormComponentProps){

    const [errorMessage, setErrorMessage] = useState<string>("");

    const navigate = useNavigate();

    const schema = yup.object().shape({
        name: yup.string().max(64).required(),
        longitude: yup.number().required(),
        latitude: yup.number().required(),
        image: yup.object(),
        plannedOn: yup.string().required(),
        description: yup.string().required()
    });

    const { mutate } = useMutation({
        mutationFn: async (values: EventPostModel) => {
            const headers = {
                Authorization: cookiesHandler.get(Config.token) ?? "",
            }

            values.plannedOn = new Date().toISOString();

            return await httpClient.post({
                url: "/event",
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
    } = useForm<EventPostModel>({
        resolver: yupResolver(schema)
    });

    if(!open || coords == null) {
        return <></>;
    }

    return(
        <div className={styles.container}>
            <div className={styles.innerContainer}>
                <form className={styles.form} onSubmit={handleSubmit((values) => mutate(values))}>
                    <h2 className={styles.tytul}>Fill event data</h2>
                    <div className={styles.inputContainer}>
                        <div className={styles.div_icon}>
                            <img src={user} className={styles.img} alt={"person image"}/>
                            <input type={"text"}
                                   placeholder={"Name"}
                                   className={styles.input}
                                   {...register("name")}/>
                        </div>
                        <div className={styles.div_icon}>
                            <img src={calendar}
                                 className={styles.img} alt={"calendar image"}/>
                            <input type={"text"} placeholder={"Description"}
                                   className={styles.input} {...register("description")}/>
                        </div>
                        <div className={styles.div_icon}>
                            <img src={calendar}
                                 className={styles.img} alt={"calendar image"}/>
                            <input type={"text"} placeholder={"Date"}
                                   className={styles.input} {...register("plannedOn")}/>
                            <input type={"hidden"} value={coords?.latitude}
                                   {...register("latitude")}/>
                            <input type={"hidden"} value={coords?.longitude}
                                   {...register("longitude")}/>
                        </div>

                    </div>
                    <div className={styles.submitContainer}>
                        <input type="submit" value="CONTINUE" className={styles.submit} />
                        <div className={styles.arrow_holder}>
                            <img src={arrowRight} className={styles.img2} alt="Arr Icon" />
                        </div>
                    </div>
                </form>
                <button className={styles.close_button} onClick={() => setOpen(false)}>Close</button>
            </div>


        </div>
    );
}
export default AddEventFormOpenComponent;