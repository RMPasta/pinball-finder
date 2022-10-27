import React, { useState, useRef } from "react";
import axios from "axios";
import "./App.css";
import { v4 as uuidv4 } from "uuid";

function App() {
  //using this state to store and display pinball locations
  const [pinball, setPinball] = useState([]);
  //make references to the input boxes
  const longitudeRef = useRef(null);
  const latitudeRef = useRef(null);

  //this one auto finds lat and lon and searches 50 mile radius
  const getNearestPinball = () => {
    //on success, set lon and lat to the coordinates from navigator.geolocation.getCurrentPosition
    const successCallback = (position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      latitudeRef.current.value = position.coords.latitude;
      longitudeRef.current.value = position.coords.longitude;
      //api call
      axios
        .get(
          `https://pinballmap.com/api/v1/locations/closest_by_lat_lon.json?lat=${lat}&lon=${lon}&send_all_within_distance=true`
        )
        .then((response) => {
          //set response to variable and set the state to that variable
          setPinball(response.data.locations);
        });
    };
    const errorCallback = (error) => {
      console.log(error);
    };
    //function that gets lon and lat
    navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
  };

  //the idea is to have the inputs for lat and lon go to the api call on the click of a button
  //or if they dont enter anything it will ask for their location and if agreed will grab results
  //right now only the button works and only for one result

  const handleFind = () => {
    //grabbing input from text inputs and assigning them to variables
    const lat = latitudeRef.current.value;
    const lon = longitudeRef.current.value;
    //api call
    axios
      .get(
        `https://pinballmap.com/api/v1/locations/closest_by_lat_lon.json?lat=${lat}&lon=${lon}&send_all_within_distance=true`
      )
      .then((response) => {
        //set response to variable and set the state to that variable
        setPinball(response.data.locations);
      });
  };

  return (
    <div className="App">
      <label>
        Latitude:
        <input type="text" ref={latitudeRef} />
      </label>
      <label>
        Longitude:
        <input type="text" ref={longitudeRef} />
      </label>
      <button onClick={handleFind}>Find!</button>
      <div className="button-wrapper">
        <button onClick={getNearestPinball}>Auto Find Near Me</button>
      </div>
      <ul>
        {pinball.map((locations) => (
          <li key={uuidv4()}>
            <strong>{locations.name}</strong> /// {locations.street},{" "}
            {locations.city}, {locations.state}, ///{" "}
            <strong>{locations.num_machines} Machine(s)</strong>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
