const DateTimePicker = ({ onChange }) => {
    // Simulate the DateTimePicker returning a selected date
    onChange(null, new Date('2024-11-10T00:00:00Z'));
    return null;
  };
  
  export default DateTimePicker;
  