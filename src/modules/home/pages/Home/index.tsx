import React, {Dispatch, SetStateAction, useContext, useEffect, useState} from 'react';
import styles from "./styles.module.scss";
import Map, {CircleLayer, Layer, MapLayerMouseEvent, Marker, Source} from 'react-map-gl';
import users from "../../../../assets/user--multiple.svg";
import PortalReactDOM from "react-dom";
import EventsModalComponent from "../../components/EventsModalComponent";
import signOutIcon from "../../../../assets/sign-out.svg";
import {useFetchEvents} from "../../hooks/useFetchEvents";
import {FeatureCollection} from "geojson";
import {Navigate} from "react-router";
import {AuthenticationContext} from "../../../../AuthenticationContext";
import AddEventFormOpenComponent from "../../components/AddEventFormComponent";
import ActivityComponent from "../../components/ActivityComponent";

export type Coords = {
    longitude: number;
    latitude: number;
}

export type HomeProps = {
    setAuthenticated: Dispatch<SetStateAction<boolean>>;
    [key: string]: unknown;
}

function Home({setAuthenticated}: HomeProps) {
    const {authenticated} = useContext(AuthenticationContext);


    const [eventsOpen, setEventsOpen] = useState(false);
    const [addEventFormOpen, setAddEventFormOpen] = useState(false);
    const [mapClickable, setMapClickable] = useState(false);
    const [eventCords, setEventCords] = useState<Coords|null>(null);

    const {events, setCoords, coords} = useFetchEvents(setAuthenticated);

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.watchPosition(function(position) {
                console.log("set");
                setCoords({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                });
            });
        }
    }, []);

    useEffect(() => {
        console.log("events", events);
    }, [events]);


    const signOut = () => {
        setAuthenticated(false);
    }



    if(!authenticated) {
        return <Navigate to={"/sign-in"}/>
    }

    const handleMapClick = (event: MapLayerMouseEvent) => {
        if(mapClickable){
            setEventCords({
                latitude: event.lngLat.lat, longitude: event.lngLat.lng
            });
            setMapClickable(false);
            setAddEventFormOpen(true);
        }
    }

    return (
        <div className={styles.container}>
            {PortalReactDOM.createPortal(<EventsModalComponent open={eventsOpen} setOpen={setEventsOpen}/>, document.body)}
            {PortalReactDOM.createPortal(<AddEventFormOpenComponent coords={eventCords} open={addEventFormOpen} setOpen={setAddEventFormOpen}/>, document.body)}
            {coords &&
                <Map
                    mapboxAccessToken="pk.eyJ1IjoibWk3Y2hhbCIsImEiOiJjbHBuYmxieXYwNDRqMmpvN3RlcHMxdDlsIn0.E0HeoBVKgKseuTW69dZPcg"
                    initialViewState={{
                        longitude: coords.longitude,
                        latitude: coords.latitude,
                        zoom: 14
                    }}
                    onClick={handleMapClick}
                    style={{width: "100%", height: "100%", position: "relative"}}
                    mapStyle="mapbox://styles/mapbox/streets-v9"
                >
                    {mapClickable && <h2 className={styles.hint}>Choose a point</h2>}
                    <div className={styles.menu}>
                        <div className={styles.menu_overlay}>
                            <img src={users} />
                            <button onClick={() => setEventsOpen(true)}>Requests</button>
                        </div>
                        <div className={styles.menu_overlay}>
                            <button onClick={() => setMapClickable(true)}>Add event</button>
                        </div>
                    </div>

                    <div className={styles.sign_out}>
                        <img src={signOutIcon} />
                        <button onClick={() => signOut()}>Sign out</button>
                    </div>
                    {events &&  events.map && events.map((event) => {
                        return (
                                <Marker longitude={event.longitude} latitude={event.latitude} anchor="bottom" >
                                    <ActivityComponent event={event} />
                                </Marker>
                            )
                        })}

                </Map>
            }
        </div>
    );
}

export default Home;
