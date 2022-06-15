import React from "react";

import Header from "./Header";
import Show from "./Show";
import Empty from "./Empty";
import Error from "./Error";

import "components/Appointment/styles.scss"
import Form from "./Form";

import useVisualMode from "../../hooks/useVisualMode"
import Status from "./Status";
import Confirm from "./Confirm";

export default function Appointment(props){
  const EMPTY = "EMPTY";
  const SHOW = "SHOW";
  const CREATE = "CREATE";
  const SAVING = "SAVING";
  const CONFIRM = "CONFIRM";
  const DELETING = "DELETING";
  const EDIT = "EDIT";
  const ERROR_DELETE = "ERROR_DELETE";
  const ERROR_SAVE = "ERROR_SAVE";
  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );

  function save(name, interviewer) {
    const interview = {
      student: name,
      interviewer,
    };
    transition(SAVING);
    props.bookInterview(props.id, interview).then(() => 
      transition(SHOW)
    )
    .catch(error => {
      console.log(error);
      transition(ERROR_SAVE, true)
    });
  }

  function cancel() {
    transition(DELETING);
    props.cancelInterview(props.id, null).then(() => {
      transition(EMPTY)
    })
    .catch(error => {
      console.log(error);
      transition(ERROR_DELETE, true)
    });
  }

  // function destroy(event) {
  //   transition(DELETING, true);
  //   props
  //    .cancelInterview(props.id)
  //    .then(() => transition(EMPTY))
  //    .catch(error => transition(ERROR_DELETE, true));
  //  }

  return (
    <article className="appointment">
      <Header time={props.time}/>
      {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
      {mode === SHOW && (
        <Show
          student={props.interview.student}
          interviewer={props.interview.interviewer}
          onDelete={() => transition(CONFIRM)}
          onEdit={() => transition(EDIT)}
        />
      )}
      {mode === CREATE && <Form 
      interviewers={props.interviewers}
      onCancel={back}
      onSave={save} />}
      {mode === SAVING && <Status message={"Saving"}/>}
      {mode === DELETING && <Status message={"Deleting"}/>}
      {mode === CONFIRM && <Confirm 
      onConfirm={cancel}
      onCancel={back}
      />}
      {mode === EDIT && <Form
      student={props.interview.student}
      interviewers={props.interviewers}
      interviewer={props.interview.interviewer.id}
      onEdit={() => transition(CREATE)}
      onCancel={back}
      onSave={save}/>}
      {mode === ERROR_SAVE && <Error message={"Could not save appointment"} onClose={back}/>}
      {mode === ERROR_DELETE && <Error message={"Could not delete appointment"} onClose={back}/>}
      </article>
  );
}