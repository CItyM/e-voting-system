import React, { useState } from "react";
import FormContext from "../../context/FormContext";
import { useAppContext } from "../../context/AppContext";
import create from "../../actions/operator/create-vote";

export default function FormContextProvider({ children }) {
  const { factoryContract } = useAppContext();
  const [name, setName] = useState("");
  const [choices, setChoices] = useState([{ choice: "" }]);
  const defaultDate = new Date();
  defaultDate.setDate(defaultDate.getDate());
  const [registrationStartDate, setRegistrationStartDate] =
    useState(defaultDate);
  const [registrationEndDate, setRegistrationEndDate] = useState(defaultDate);
  const [votingStartDate, setVotingStartDate] = useState(defaultDate);
  const [votingEndDate, setVotingEndDate] = useState(defaultDate);

  const handleOnInputChange = (index, event) => {
    if (event.target.name === "choice") {
      const values = [...choices];
      values[index].choice = event.target.value;
      setChoices(values);
    } else {
      setName(event.target.value);
    }
  };

  const handleOnAddFields = () => {
    const values = [...choices];
    values.push({ choice: "" });
    setChoices(values);
  };

  const handleOnRemoveFields = (index) => {
    const values = [...choices];
    values.splice(index, 1);
    setChoices(values);
  };

  const handleOnRegistrationStartDateChange = (event) => {
    const startDate = new Date(event.target.value);
    setRegistrationStartDate(startDate);
  };

  const handleOnRegistrationEndDateChange = (event) => {
    const endDate = new Date(event.target.value);
    setRegistrationEndDate(endDate);
  };

  const handleOnVotingStartDateChange = (event) => {
    const startDate = new Date(event.target.value);
    setVotingStartDate(startDate);
  };

  const handleOnVotingEndDateChange = (event) => {
    const endDate = new Date(event.target.value);
    setVotingEndDate(endDate);
  };

  const handleOnSubmit = async () => {
    try {
      await create(
        factoryContract,
        name,
        choices,
        registrationStartDate,
        registrationEndDate,
        votingStartDate,
        votingEndDate
      );
    } catch (error) {
      alert(error);
    }
  };

  const values = {
    choices,
    name,
    handleOnAddFields,
    handleOnInputChange,
    handleOnSubmit,
    handleOnRemoveFields,
    handleOnRegistrationStartDateChange,
    handleOnRegistrationEndDateChange,
    handleOnVotingStartDateChange,
    handleOnVotingEndDateChange,
  };

  return <FormContext.Provider value={values}>{children}</FormContext.Provider>;
}
