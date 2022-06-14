import { useState, useEffect } from "react";

import axios from "axios";

export default function useApplicationData() {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    // you may put the line below, but will have to remove/comment hardcoded appointments variable
    appointments: {}
  });
  
  const setDay = day => setState({ ...state, day });

  useEffect(() => {
    Promise.all([
      axios.get('http://localhost:8001/api/days'),
      axios.get('http://localhost:8001/api/appointments'),
      axios.get('http://localhost:8001/api/interviewers')
    ]).then((all) => {
      console.log(all[0]); // first
      console.log(all[1]); // second
      console.log(all[2]); // third
      setState(prev => ({...prev, days: all[0].data, appointments: all[1].data, interviewers:  all[2].data }));
    });
    
  }, [])

  function bookInterview(id, interview) {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }

    };
    
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    
    return axios.put(`http://localhost:8001/api/appointments/${id}`, appointment).then(() => {
      setState({
        ...state, appointments
      })
    })
  }

  function cancelInterview(id, interview) {
    const appointment = {
      ...state.appointments[id],
      interview

    };
    
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    return axios.delete(`http://localhost:8001/api/appointments/${id}`, appointment).then(() => {
      setState({
        ...state, appointments
      })
    })
  }

  return { 
    state,
    setDay,
    bookInterview,
    cancelInterview }
}