import { useState } from "react";
import DateAndTime from "./components/Calendar";
import OpenStreetMapSearch from "./components/OpenStreetMapSearch";
import Kundali from "./components/Kundali";
import Kinfo from "./components/Kinfo";
import Chatbot from "./components/Chatbot";
import AstrologyApiComponent from "./components/AstroAPI";
import "./App.css";
import LoginPage from "./app/login/page";

function App() {
  const [dateTime, setDateTime] = useState<any>({});
  const [location, setLocation] = useState<any>({});
  const [astroData, setAstroData] = useState<any>(null);

  const handleDateTimeChange = (selectedDateTime: any) => {
    setDateTime(selectedDateTime);
    console.log("Selected Date and Time:", selectedDateTime);
  };

  const handleLocationSelect = (selectedLocation: any) => {
    setLocation(selectedLocation);
    console.log("Selected Location:", selectedLocation);
  };

  const handleAstroDataChange = (data: any) => {
    setAstroData(data);
  };

  return (
    <div>
      <div id="mainDiv">
        {astroData ? (
          <>
            <Kundali
              startNumber={astroData.PrimaryData.Lagna.Sign}
              bhavas={astroData.BhavaDetails}
            />
            <Kinfo details={astroData} />
          </>
        ) : (
          <div>Please fetch astrology data to view the Kundali</div>
        )}
        {/*<Chatbot /> */}
        <div>
          <div>
            <DateAndTime onDateTimeChange={handleDateTimeChange} />
            <OpenStreetMapSearch onLocationSelect={handleLocationSelect} />
          </div>
          <AstrologyApiComponent
            dateTime={dateTime}
            location={location}
            onDataChange={handleAstroDataChange}
          />
        </div>
      </div>
      <Chatbot />
      <LoginPage />
    </div>
  );
}

export default App;
