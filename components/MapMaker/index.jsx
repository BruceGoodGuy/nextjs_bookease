import {
  Fragment,
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
  useRef,
} from "react";

import * as maptilersdk from "@maptiler/sdk";
import "@maptiler/sdk/dist/maptiler-sdk.css";
import "./map.css";

const MapMaker = forwardRef((props, ref) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  maptilersdk.config.apiKey = "5aUGF2JkmjHiSkeCWcik";
  useImperativeHandle(ref, () => ({
    locateMe(lat, lng) {
      locating(lat, lng);
    },
  }));

  const locating = (lat = "36.147247", lng = "-115.156029") => {
    map.current = new maptilersdk.Map({
      container: mapContainer.current,
      style: maptilersdk.MapStyle.STREETS,
      center: [lng, lat],
      zoom: 14,
    });

    new maptilersdk.Marker({ color: "#FF0000" })
      .setLngLat([lng, lat])
      .addTo(map.current);
  };

  useEffect(() => {
    if (map.current) return; // stops map from intializing more than once
    locating(props.lat, props.long);
  }, []);

  return (
    <div className="map-wrap h-72 w-full relative">
      <div ref={mapContainer} className="map" />
    </div>
  );
});

MapMaker.displayName = "MapMakerComponent";

export default MapMaker;
