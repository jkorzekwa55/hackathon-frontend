import React, {Dispatch, SetStateAction, useContext, useEffect, useState} from 'react';
import styles from "./styles.module.scss";
import Map, {CircleLayer, Layer, Source} from 'react-map-gl';
import users from "../../../../assets/user--multiple.svg";
import PortalReactDOM from "react-dom";
import EventsModalComponent from "../../components/EventsModalComponent";
import signOutIcon from "../../../../assets/sign-out.svg";
import {useFetchEvents} from "../../hooks/useFetchEvents";
import {FeatureCollection} from "geojson";
import {Navigate} from "react-router";
import {AuthenticationContext} from "../../../../AuthenticationContext";

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


    return (
        <div className={styles.container}>
            {PortalReactDOM.createPortal(<EventsModalComponent open={eventsOpen} setOpen={setEventsOpen}/>, document.body)}
            {coords &&
                <Map
                    mapboxAccessToken="pk.eyJ1IjoibWk3Y2hhbCIsImEiOiJjbHBuYmxieXYwNDRqMmpvN3RlcHMxdDlsIn0.E0HeoBVKgKseuTW69dZPcg"
                    initialViewState={{
                        longitude: coords.longitude,
                        latitude: coords.latitude,
                        zoom: 14
                    }}
                    style={{width: "100%", height: "100%", position: "relative"}}
                    mapStyle="mapbox://styles/mapbox/streets-v9"
                >
                    <div className={styles.menu_overlay}>
                        <img src={users} />
                        <button onClick={() => setEventsOpen(true)}>Requests</button>
                    </div>
                    <div className={styles.sign_out}>
                        <img src={signOutIcon} />
                        <button onClick={() => signOut()}>Sign out</button>
                    </div>
                    {events &&  events.map && events.map((event) => {
                            const geojson: FeatureCollection = {
                                type: 'FeatureCollection',
                                features: [
                                    {type: 'Feature', geometry: {type: 'Point', coordinates: [coords?.longitude ?? 0, coords?.latitude ?? 0]}, properties: {id: 1}}
                                ]
                            };

                            const layerStyle: CircleLayer = {
                                id: 'point',
                                type: 'circle',
                                paint: {
                                    'circle-radius': 10,
                                    'circle-color': '#007cbf'
                                },
                            };

                            return (
                                <Source id="my-data" type="geojson" data={geojson}>
                                  <Layer {...layerStyle} >
                                  </Layer>
                                </Source>
                            )
                        })}

                </Map>
            }
        </div>
    );
}

export default Home;
