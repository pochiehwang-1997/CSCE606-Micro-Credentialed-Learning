import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import RecruiterService from "../../services/recruiter.service";

const RenderApplicationComponent = (props) => {
  let [currentJob, setCurredntJob] = useState(null);
  const jobId = useParams().jobId;
  useEffect(() => {
    RecruiterService.renderApplication(jobId)
    .then(({ data }) => {
      setCurredntJob(data);
    })
    .catch((err) => {
      console.log(err);
    });
  }, []);

  return (
    <div style={{ padding: "3rem" }}>
      {/* If not login*/}
      {!props.currentRole && (
        <h1>Please Login</h1>
      )}
      {/* If not recruiter*/}
      {props.currentRole && props.currentRole !== "recruiter" && (
        <h1>You Are Not a Recruiter</h1>
      )}
      {/* If login and recruiter */}
      {props.currentRole && props.currentRole === "recruiter" && (
        <>
        {currentJob &&(
          <>
          <h1>{currentJob.name}</h1>
          {currentJob.resumes.map((resume) => (
            <li key={resume._id}>
              <Link className="text-primary h3" to={`applications/${resume._id}`}>{resume._id}</Link>
            </li>
          ))}
          </>
        )}
        </>
      )}
    </div>
  );
};

export default RenderApplicationComponent;
