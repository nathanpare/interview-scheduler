import { useState, useEffect } from "react";

import axios from "axios";

export default function useApplicationData() {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    // you may put the line below, but will have to remove/comment hardcoded appointments variable
    // first:"abra cadabra",
    appointments: {
      // second: 123
    }
  });

  const setDay = day => setState({ ...state, day });

  const countSpotsInADay = function (currentDay, oldState) {
    let counter = 0;
    currentDay.appointments.map((appointmentId) => {
      const currentAppointment = oldState.appointments[appointmentId]
      if (currentAppointment.interview === null) {
        return counter += 1;
      }
      return null;
    })
    return counter;
  }

  const updateSpots = function (oldState) {
    // loop through the days so that we can update the spots
    const updatedDays = oldState.days.map((currentDay) => {
      const newSpotCount = countSpotsInADay(currentDay, oldState);
      // using the current day check which appoiintments aka time slots have no interviews
      const newDay = {
        ...currentDay,
        spots: newSpotCount
      }
      return newDay
    })
    const updatedState = {
      ...oldState,
      days: updatedDays
    }

    return updatedState;
  }

  useEffect(() => {
    Promise.all([
      axios.get('/api/days'),
      axios.get('/api/appointments'),
      axios.get('/api/interviewers')
    ]).then((all) => {
      setState(prev => ({ ...prev, days: all[0].data, appointments: all[1].data, interviewers: all[2].data }));
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


    return axios.put(`/api/appointments/${id}`, appointment)
      .then(() => {
        const newState = {
          ...state, appointments
        }
        const stateWithUpdatedSpots = updateSpots(newState);
        setState(stateWithUpdatedSpots)
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

    return axios.delete(`/api/appointments/${id}`, appointment).then(() => {
      const newState = {
        ...state, appointments
      }
      const stateWithUpdatedSpots = updateSpots(newState)
      setState(stateWithUpdatedSpots)
    })
  }

  return {
    state,
    setDay,
    bookInterview,
    cancelInterview
  }
}