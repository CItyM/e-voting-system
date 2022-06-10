const shortAddress = (address) => {
  const l = address.length;
  const start = address.substring(0, 5);
  const end = address.substring(l - 4, l);
  return `${start}...${end}`;
};

export default shortAddress;
