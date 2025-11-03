import React from 'react'
import {GoogleMap, LoadScript,Marker} from '@react-google-maps/api';
const Maps = () => {
    const containerStyle = {
        width: '100%x',
        height: '400px'
      };
      const center = {
        lat: -0.5730989,
        lng: 37.32785
      };
  return (
    <LoadScript googleMapsApiKey="AIzaSyBXkV0P3dvGJblRVjGNzKTH4k2ivBcTDhw">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={15}
      > 
        <Marker position={center} />
      </GoogleMap>
    </LoadScript>
  )
}

export default Maps