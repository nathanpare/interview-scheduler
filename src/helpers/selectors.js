

export function getAppointmentsForDay(state, day) {
  const appointmentsForDay = state.days.find(eachDay => day === eachDay.name);
  if (state.days.length === 0 || appointmentsForDay === undefined) {
    return [];
  }
  return appointmentsForDay.appointments.map(id => state.appointments[id]);
}

export function getInterviewersForDay(state, day) {
  const interviewersForDay = state.days.find(eachDay => day === eachDay.name);
  if (state.days.length === 0 || interviewersForDay === undefined) {
    return [];
  }
  return interviewersForDay.interviewers.map(id => state.interviewers[id]);
}

export function getInterview(state, interview) {
  if (interview === null) {
    return null;
  }
  return {
    student: interview.student,
    interviewer: state.interviewers[interview.interviewer]
  };

  // const interviewersArray = Object.values(state.appointments.interviewers);
  // console.log("getInterview", state.interviewers);
  // const interviewer = interview.interviewer;
  // console.log("interviewer", interviewer);
  // const interviewerObject = interviewersArray.find(eachinterviewer => interviewer === eachinterviewer.id);
  // console.log(interviewerObject);
  // return interviewerObject;
}