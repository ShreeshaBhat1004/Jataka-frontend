import React, { useState } from "react";

interface OpenStreetMapSearchProps {
  onLocationSelect: (location: {
    name: string;
    lat: number;
    lon: number;
  }) => void;
}

const OpenStreetMapSearch: React.FC<OpenStreetMapSearchProps> = ({
  onLocationSelect,
}) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<{
    name: string;
    lat: number;
    lon: number;
  } | null>(null);

  const fetchSuggestions = async (input: string) => {
    if (input.trim().length < 2) return;

    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${input}`
    );
    const data = await response.json();
    setSuggestions(data);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    setQuery(input);
    fetchSuggestions(input);
  };

  const handleSelect = (place: any) => {
    const location = {
      name: place.display_name,
      lat: parseFloat(place.lat),
      lon: parseFloat(place.lon),
    };
    setSelectedLocation(location);
    onLocationSelect(location); // Pass selected location to parent
    setSuggestions([]); // Clear suggestions
  };

  return (
    <div>
      <h4>Search Location</h4>
      <input
        type="text"
        placeholder="Type to search..."
        value={query}
        onChange={handleInputChange}
        style={{ padding: "8px", marginBottom: "10px" }}
      />
      <ul
        style={{
          listStyle: "none",
          padding: 0,
          maxHeight: "150px",
          overflowY: "auto",
        }}
      >
        {suggestions.map((place, index) => (
          <li
            key={index}
            style={{
              cursor: "pointer",
              padding: "8px",
              borderBottom: "1px solid #ddd",
            }}
            onClick={() => handleSelect(place)}
          >
            {place.display_name}
          </li>
        ))}
      </ul>
      {selectedLocation && (
        <div style={{ marginTop: "10px" }}>
          <strong>Selected Location:</strong>
          <div>Name: {selectedLocation.name}</div>
          <div>Latitude: {selectedLocation.lat}</div>
          <div>Longitude: {selectedLocation.lon}</div>
        </div>
      )}
    </div>
  );
};

export default OpenStreetMapSearch;
