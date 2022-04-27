function doubleDigitsString(value: number) {
    return value < 10 ? "0" + value.toString() : value.toString();
  }
  
  function getCurrentDate() {
    const date = new Date();
    const year = date.getFullYear().toString();
  
    const month = date.getMonth() + 1;
    const monthString = doubleDigitsString(month);
  
    const day = date.getDate();
    const dayString = doubleDigitsString(day);
  
    const hours = date.getHours();
    const hoursString = doubleDigitsString(hours);
  
    const minutes = date.getMinutes();
    const minutesString = doubleDigitsString(minutes);
  
    const seconds = date.getSeconds();
    const secondsString = doubleDigitsString(seconds);
  
    return year + monthString + dayString + hoursString + minutesString + secondsString ;
  }
  
  export default getCurrentDate;
  