import { useState, useEffect, useRef, useContext } from "react";
import toast from "react-hot-toast";
import * as maptilerClient from "@maptiler/client";
import { MapPin } from "react-feather";
import { Button } from "@nextui-org/react";
import { SignUp as SignUpContext } from "@/provider/signup";

import * as maptilersdk from "@maptiler/sdk";
import "@maptiler/sdk/dist/maptiler-sdk.css";

export default function MapMaker({ lat, long }) {
  const { updateLocation } = useContext(SignUpContext);
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [state, setState] = useState({});
  maptilersdk.config.apiKey = process.env.NEXT_PUBLIC_GEO_API_KEY;

  const locating = (lat, lng) => {
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

  const getLocationByLatLong = async (lat, long) => {
    try {
      const location = await maptilerClient.geocoding.reverse([long, lat]);
      const { features } = location;
      let clientLocation = { lat, long };
      features.forEach((feature) => {
        switch (feature["place_type"].pop()) {
          case "address":
            clientLocation.street = feature.place_name;
            break;
          case "municipality":
            clientLocation.state = feature.text;
            break;
          case "subregion":
            clientLocation.city = feature.text;
            break;
          case "country":
            clientLocation.country = feature.text;
            clientLocation.countrycode =
              feature?.properties?.country_code?.toUpperCase() ?? "";
            break;
        }
      });
      updateLocation(clientLocation);
      locating(lat, long);
    } catch (e) {
      toast.error("Can't fetch location.");
    }
  };

  const locateMe = () => {
    if ("geolocation" in navigator) {
      // Geolocation is available
      navigator.geolocation.getCurrentPosition(
        function (position) {
          getLocationByLatLong(
            position.coords.latitude,
            position.coords.longitude
          );
        },
        function (error) {
          toast.error("Please grant location permission");
          console.log("Location permission is not granted");
        }
      );
    } else {
      // Geolocation is not available
      toast.error("Can't retrive location");
      console.log("Geolocation is not available in this browser.");
    }
  };

  useEffect(() => {
    if (map.current) return; // stops map from intializing more than once
    locating(lat, long);
  }, []);

  return (
    <div className="map-wrap h-72 w-full relative mb-[50px]">
      <div className="flex justify-between">
        <p className="flex items-center">Map</p>
        <Button
          variant="bordered"
          className="md:w-1/5 w-1/2"
          startContent={<MapPin />}
          onPress={locateMe}
        >
          Locate me
        </Button>
      </div>
      <div className="flex mt-3">
        <div ref={mapContainer} className="map !absolute w-full h-full" />
      </div>
    </div>
  );
}
