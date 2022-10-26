import React, { useState, useRef } from "react";
import axios from "axios";
import "./App.css";

function App() {
  //using this state to display pinball locations
  const [pinball, setPinball] = useState([]);
  //trying to make references to the input boxes
  const longitudeRef = useRef(null);
  const latitudeRef = useRef(null);

  const getNearestPinball = () => {
    //on success, set lon and lat to the coordinates from navigator.geolocation.getCurrentPosition
    const successCallback = (position) => {
      const lon = position.coords.longitude;
      const lat = position.coords.latitude;
      //api call
      axios
        .get(
          `https://pinballmap.com/api/v1/locations/closest_by_lat_lon.json?lat=${lat}&lon=${lon}`
        )
        .then((response) => {
          //set response to variable and set the state to that variable
          const pinballLoc = response.data.location.name;
          return setPinball([pinballLoc]);
        });
    };

    const errorCallback = (error) => {
      console.log(error);
    };
    //function that gets lon and lat
    navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
  };

  return (
    <div className="App">
      <input type="text" ref={longitudeRef} />
      <input type="text" ref={latitudeRef} />
      <button onClick={getNearestPinball}>Where's the pinball?!</button>
      <div>{pinball}</div>
    </div>
  );
}

export default App;
