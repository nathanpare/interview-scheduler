
import { useState } from "react";

export function getAppointmentsForDay(state, day) {
  const appointmentsForDay = state.days.find(eachDay => day === eachDay.name);
  if (state.days.length === 0 || appointmentsForDay === undefined) {
    return [];
  }
  return appointmentsForDay.appointments.map(id => state.appointments[id]);
}