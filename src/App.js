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
          `https://pinballmap.com/api/v1/locations/closest_by_lat_lon.json?lat=${lat}&lon=${lon}&send_all_within_distance=true`
        )
        .then((response) => {
          //set response to variable and set the state to that variable
          //added in street, city etc and now it wont complete call due to multiple responses
          //so im trying to map over every location in response and display them...
          response.data.locations.map((location) => {
            const pinballPlace = response.data.location.name;
            const pinballStreet = response.data.location.street;
            const pinballCity = response.data.location.city;
            const pinballState = response.data.location.state;
            const pinballZip = response.data.location.zip;
            const pinballPhone = response.data.location.phone;
            const newLocation = [
              pinballPlace,
              ", ",
              pinballStreet,
              ", ",
              pinballCity,
              ", ",
              pinballState,
              ", ",
              pinballZip,
              ", ",
              pinballPhone,
            ];
            return setPinball([...pinball, newLocation]);
          });
        });
    };

    const errorCallback = (error) => {
      console.log(error);
    };
    //function that gets lon and lat
    navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
  };
  //the idea is to have the inputs for lon and lan go to the api call on the click of a button
  //or if they dont enter anything it will ask for their location and if agreed will grab results
  //right now only the button works and only for one result
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
