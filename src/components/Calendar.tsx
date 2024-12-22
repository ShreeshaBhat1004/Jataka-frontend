import React, { useState } from "react";
import { LocalizationProvider, renderTimeViewClock } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import dayjs, { Dayjs } from "dayjs";

interface DateAndTimeProps {
  onDateTimeChange: (dateTime: {
    day: number;
    month: number;
    year: number;
    hour: number;
    min: number;
  }) => void;
}

const DateAndTime: React.FC<DateAndTimeProps> = ({ onDateTimeChange }) => {
  const [selectedDateTime, setSelectedDateTime] = useState<Dayjs | null>(
    dayjs()
  );

  const handleChange = (newValue: Dayjs | null) => {
    setSelectedDateTime(newValue);
    if (newValue) {
      onDateTimeChange({
        day: newValue.date(),
        month: newValue.month() + 1, // Months are zero-indexed
        year: newValue.year(),
        hour: newValue.hour(),
        min: newValue.minute(),
      });
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DateTimePicker
        label="Select Date and Time"
        value={selectedDateTime}
        onChange={handleChange}
        viewRenderers={{
          hours: renderTimeViewClock,
          minutes: renderTimeViewClock,
          seconds: renderTimeViewClock,
        }}
      />
    </LocalizationProvider>
  );
};

export default DateAndTime;
