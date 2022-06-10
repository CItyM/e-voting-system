const tableTime = (time) => {
  const start = new Date(time.start * 1000);
  const end = new Date(time.end * 1000);
  return `${ISODateString(start)} :: ${ISODateString(end)}`;
};

const ISODateString = (d) => {
  function pad(n) {
    return n < 10 ? "0" + n : n;
  }
  return (
    d.getUTCFullYear() +
    "-" +
    pad(d.getUTCMonth() + 1) +
    "-" +
    pad(d.getUTCDate()) +
    "T" +
    pad(d.getUTCHours()) +
    ":" +
    pad(d.getUTCMinutes()) +
    "Z"
  );
};

export default tableTime;
