import { useState, useEffect } from "react";

interface AstrologyApiProps {
  dateTime: {
    day?: number;
    month?: number;
    year?: number;
    hour?: number;
    min?: number;
  };
  location: { lat?: number; lon?: number };
  onDataChange: (data: any) => void;
}

const AstrologyApiComponent = ({
  dateTime,
  location,
  onDataChange,
}: AstrologyApiProps) => {
  const [response, setResponse] = useState<any>(null);
  const [secondaryResponse, setSecondaryResponse] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const getSanskritNames = () => ({
    Sun: "Surya",
    Moon: "Chandra",
    Mars: "Mangala",
    Mercury: "Budha",
    Jupiter: "Guru",
    Venus: "Shukra",
    Saturn: "Shani",
    Rahu: "Rahu",
    Ketu: "Ketu",
  });

  const getSanskritSigns = () => ({
    Aries: "Mesha",
    Taurus: "Vrishabha",
    Gemini: "Mithuna",
    Cancer: "Karka",
    Leo: "Simha",
    Virgo: "Kanya",
    Libra: "Tula",
    Scorpio: "Vrischika",
    Sagittarius: "Dhanu",
    Capricorn: "Makara",
    Aquarius: "Kumbha",
    Pisces: "Meena",
  });

  const getRashiSwani = () => ({
    Mesha: "Mangala",
    Vrishabha: "Shukra",
    Mithuna: "Budha",
    Karka: "Chandra",
    Simha: "Surya",
    Kanya: "Budha",
    Tula: "Shukra",
    Vrischika: "Mangala",
    Dhanu: "Guru",
    Makara: "Shani",
    Kumbha: "Shani",
    Meena: "Guru",
  });

  const calculateDrsti = (house: number, drstiOffsets: number[]) => {
    const drstis = [];
    for (let offset of drstiOffsets) {
      const drstiHouse = ((house + offset - 1) % 12) + 1;
      drstis.push(drstiHouse);
    }
    return drstis;
  };

  const calculateBhavaOrder = (lagnaSign: string, allSigns: string[]) => {
    const startIndex = allSigns.indexOf(lagnaSign);
    return [...allSigns.slice(startIndex), ...allSigns.slice(0, startIndex)];
  };

  const convertJsonFormat = (primaryData: any, secondaryData: any) => {
    const sanskritNames = getSanskritNames();
    const sanskritSigns = getSanskritSigns();
    const rashiSwaniMap = getRashiSwani();

    const allSigns = [
      "Mesha",
      "Vrishabha",
      "Mithuna",
      "Karka",
      "Simha",
      "Kanya",
      "Tula",
      "Vrischika",
      "Dhanu",
      "Makara",
      "Kumbha",
      "Meena",
    ];

    const lagna =
      sanskritSigns[primaryData.ascendant as keyof typeof sanskritSigns] ||
      primaryData.ascendant;
    const bhavaOrder = calculateBhavaOrder(lagna, allSigns);

    const primaryRestructured = {
      PrimaryData: {
        Lagna: {
          Sign: lagna,
          Lord: rashiSwaniMap[lagna as keyof typeof rashiSwaniMap] || "None",
        },
        Details: {
          Varna: primaryData.Varna,
          Vashya: primaryData.Vashya,
          Yoni: primaryData.Yoni,
          Gan: primaryData.Gan,
          Nadi: primaryData.Nadi,
          SignLord:
            sanskritNames[primaryData.SignLord as keyof typeof sanskritNames] ||
            primaryData.SignLord,
          Naksahtra: {
            Name: primaryData.Naksahtra,
            Lord:
              sanskritNames[
                primaryData.NaksahtraLord as keyof typeof sanskritNames
              ] || primaryData.NaksahtraLord,
            Charan: primaryData.Charan,
          },
          Yog: primaryData.Yog,
          Karan: primaryData.Karan,
          Tithi: primaryData.Tithi,
          Yunja: primaryData.yunja,
          Tatva: primaryData.tatva,
          NameAlphabet: primaryData.name_alphabet,
          Paya: primaryData.paya,
        },
      },
    };

    const bhavaDetails = [];
    const drishtiMapping: { [key: number]: string[] } = {
      1: [],
      2: [],
      3: [],
      4: [],
      5: [],
      6: [],
      7: [],
      8: [],
      9: [],
      10: [],
      11: [],
      12: [],
    };

    for (let [index, sign] of bhavaOrder.entries()) {
      const currentBhava = index + 1;
      const correspondingData = secondaryData.find(
        (item: any) =>
          sanskritSigns[item.sign_name as keyof typeof sanskritSigns] === sign
      );

      if (correspondingData) {
        const planets = correspondingData.planet.map(
          (planet: string) =>
            sanskritNames[
              (planet.charAt(0).toUpperCase() +
                planet.slice(1).toLowerCase()) as keyof typeof sanskritNames
            ] || planet
        );

        bhavaDetails.push({
          Bhava: currentBhava,
          Rashi: sign,
          "Rashi Swani":
            rashiSwaniMap[sign as keyof typeof rashiSwaniMap] || "None",
          Graha: planets,
        });

        const drstiOffsets: { [key: string]: number[] } = {
          Surya: [6],
          Chandra: [6],
          Mangala: [3, 6, 7],
          Budha: [6],
          Guru: [4, 6, 8],
          Shukra: [6],
          Shani: [2, 6, 9],
        };

        for (let planet of correspondingData.planet) {
          const sanskritPlanet =
            sanskritNames[
              (planet.charAt(0).toUpperCase() +
                planet.slice(1).toLowerCase()) as keyof typeof sanskritNames
            ] || planet;
          if (drstiOffsets[sanskritPlanet]) {
            const drstis = calculateDrsti(
              currentBhava,
              drstiOffsets[sanskritPlanet]
            );
            for (let drsti of drstis) {
              drishtiMapping[drsti].push(sanskritPlanet);
            }
          }
        }
      }
    }

    const drishtiDetails = Object.keys(drishtiMapping).map((bhavaStr) => {
      const bhava = parseInt(bhavaStr, 10);
      return {
        Bhava: bhava,
        "Seen By": Array.from(new Set(drishtiMapping[bhava])).sort(),
      };
    });

    const finalData = {
      PrimaryData: primaryRestructured.PrimaryData,
      BhavaDetails: bhavaDetails,
      Drishti: drishtiDetails,
    };

    return finalData;
  };

  const fetchAstrologyData = () => {
    if (!dateTime.day || !location.lat) {
      setError("Invalid date or location");
      return;
    }

    const api = "astro_details";
    const secondaryApi = "horo_chart/:D1";
    const userId = import.meta.env.VITE_ASTRO_USER_ID;
    const apiKey = import.meta.env.VITE_ASTRO_USER_PASSWORD;
    const language = "en";
    const auth = "Basic " + btoa(`${userId}:${apiKey}`);

    const data = {
      day: dateTime.day,
      month: dateTime.month,
      year: dateTime.year,
      hour: dateTime.hour,
      min: dateTime.min,
      lat: location.lat,
      lon: location.lon,
      tzone: 5.5,
    };

    fetch(`https://json.astrologyapi.com/v1/${api}`, {
      method: "POST",
      headers: {
        Authorization: auth,
        "Content-Type": "application/json",
        "Accept-Language": language,
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((result) => {
        setResponse(result);
        setError(null);
      })
      .catch((err) => {
        setError(`API Error: ${err.message}`);
        setResponse(null);
      });

    fetch(`https://json.astrologyapi.com/v1/${secondaryApi}`, {
      method: "POST",
      headers: {
        Authorization: auth,
        "Content-Type": "application/json",
        "Accept-Language": language,
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((result) => {
        setSecondaryResponse(result);
        setError(null);
      })
      .catch((err) => {
        setError(`API Error: ${err.message}`);
        setSecondaryResponse(null);
      });
  };

  useEffect(() => {
    if (response && secondaryResponse) {
      const processedData = convertJsonFormat(response, secondaryResponse);
      onDataChange(processedData);
    }
  }, [response, secondaryResponse, onDataChange]);

  return (
    <div>
      <h2>Astrology API Component</h2>
      <button onClick={fetchAstrologyData}>Fetch Astrology Data</button>
      {error && <div>Error: {error}</div>}
    </div>
  );
};

export default AstrologyApiComponent;
