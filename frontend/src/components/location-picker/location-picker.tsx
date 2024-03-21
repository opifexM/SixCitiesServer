import {Icon, Marker} from 'leaflet';
import {useEffect, useRef} from 'react';

import {MARKER_URL, UI_CONFIG} from '../../const';
import useMap from '../../hooks/useMap';

import type {City, Location} from '../../types/types';

type LocationPickerProps = {
  city: City;
  onChange: ({ lat, lng }: { lat: number; lng: number }) => void;
  location: Location;
};

const customIcon = new Icon({
  iconUrl: MARKER_URL.DEFAULT,
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

const LocationPicker = ({ city, onChange, location }: LocationPickerProps) => {
  const mapRef = useRef<HTMLElement | null>(null);
  const map = useMap(mapRef, city);

  useEffect(() => {
    let marker: Marker;
    if (map) {
      map.setView(
        {
          lat: location.latitude,
          lng: location.longitude,
        },
        UI_CONFIG.ZOOM
      );

      marker = new Marker(
        {
          lat: location.latitude,
          lng: location.longitude,
        },
        {
          draggable: true,
          icon: customIcon,
        }
      );

      marker.on('moveend', (evt) => {
        onChange(evt.target.getLatLng());
      });

      marker.addTo(map);
    }

    return () => {
      if (map) {
        map.removeLayer(marker);
      }
    };
  }, [map, location, onChange]);

  return <section className="location-picker__map" ref={mapRef}></section>;
};

export default LocationPicker;
