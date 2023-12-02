import styles from "./styles.module.scss";
import location from "../../../../assets/location.svg";
import React, {useEffect} from "react";
import {EventModel} from "../../model/EventModel";
import {EventResponseModel} from "../../model/EventResponseModel";

export type EventComponentProps = {
    eventResponse: EventResponseModel;
    [key: string]: unknown;
}



function EventComponent(props: EventComponentProps) {


    if(props == undefined) {
        return <></>;
    }

    const date = new Date(props.eventResponse.event.plannedOn);

    return(
        <div className={styles.inner_box}>
            <p className={styles.date}>{date.toLocaleDateString()}, {date.toLocaleTimeString()}</p>
            <p className={styles.fname}><a href={props.eventResponse.sender.socialMediaLink}>{props.eventResponse.sender.name}</a></p>
            <p className={styles.message}>{props.eventResponse.message}</p>
            <p className={styles.location}><span><img src={location} alt="location icon"/></span><span>Radius Gallery, Santa Cruz, CA</span></p>
        </div>
    )
}

export default EventComponent;