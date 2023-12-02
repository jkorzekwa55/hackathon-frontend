import styles from "./styles.module.scss";
import location from "../../../../assets/location.svg";
import React, {useEffect, useState} from "react";
import {EventModel} from "../../model/EventModel";
import sunset from "../../../../assets/sunset.webp";
import PortalReactDOM from "react-dom";
import EventsModalComponent from "../EventsModalComponent";
import RequestActivityModal from "../RequestActivityModal";

export type EventComponentProps = {
    event: EventModel;
    [key: string]: unknown;
}


function ActivityComponent(props: EventComponentProps) {

    const [activityModalOpen, setActivityModalOpen] = useState(false);

    if(props == undefined) {
        return <></>;
    }


    return(
        <>
        {PortalReactDOM.createPortal(<RequestActivityModal open={activityModalOpen} setOpen={setActivityModalOpen} event={props.event}/>, document.body)}
        <div className={styles.box} onClick={() => setActivityModalOpen(true)}>
            <img src={sunset} width="100%"/>
            <div className={styles.pop_up}></div>
        </div>
        </>
    )
}

export default ActivityComponent;