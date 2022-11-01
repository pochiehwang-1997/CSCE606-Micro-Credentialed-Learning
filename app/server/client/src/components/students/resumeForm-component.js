import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import StudentService from "../../services/student.service"



const ResumeFormComponent = (props) => {
    let { currentUser, setCurrentUser } = props;
    const resume_id = useParams()._id;
    let _id = ""
    if (currentUser) {
        _id = currentUser.user._id;
    }
    const [message, setMessage] = useState(null);
    const [ resumeName, setResumeName] = useState("");
    const [ firstName, setFirstName ] = useState("");
    const [ lastName, setLastName ] = useState("");
    const [ address, setAddress ] = useState("");
    const [ phone, setPhone ] = useState("");
    const [ email, setEmail ] = useState("");
    const [ description, setDescription ] = useState("");
    const [ credentialsName, setCredentialsName ] = useState([]);
    // If no current user go to login
    const history = useHistory();
    const handleTakeToLogin = () => {
        history.push("/login");
    };

    const renderEditResumeForm = ()=> {
        history.push("/student/resumes/"+resume_id+"/edit");
    }

    useEffect(() => {
        StudentService.renderResumeForm(_id, resume_id)
        .then(({ data }) => {
            setResumeName(data.name);
            setFirstName(data.profile.firstName);
            setLastName(data.profile.lastName);
            setAddress(data.profile.address);
            setPhone(data.profile.phone);
            setEmail(data.profile.email);
            setDescription(data.profile.description);
            setCredentialsName([...credentialsName, ...data.credentialsName]);
        })
        .catch((err) => {
            console.log(err);
        });
    }, []);

    return (
        <div style={{ padding: "3rem" }}>
            {/* If not login */}
            {!currentUser && (
                <div>
                    <p>You must login before seeing your credentials.</p>
                    <button
                        onClick={handleTakeToLogin}
                        className="btn btn-primary btn-lg"
                    >
                        Take me to login page
                    </button>
                </div>
            )}
            {/* If not student */}
            {(currentUser.user.role != "student") && (
                <div>
                    <p>You are not authorized</p>
                </div>
            )}
            {/* If login and student */}
            {currentUser && (currentUser.user.role == "student") &&(
                <div className="form-resume">
                    <h1>{firstName} {lastName}</h1>
                    <h5>
                        { phone && (<>Phone: {phone}; </>)}
                        { email && (<>Email: {email}; </>)}
                        { address && (<>Address: {address}; </>)}  
                    </h5>
                    <h5>{description}</h5>
                    <br></br>
                    <div>
                        <h3>Credentials</h3>
                        {credentialsName && (credentialsName.map((name, index) => (
                            <li key={index}> {name}</li>
                        )))}
                    </div>
                    <button className="btn btn-primary" onClick={renderEditResumeForm}>Edit</button>
                    {message && (
                        <div className="alert alert-warning mt-3" role="alert">
                            {message}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ResumeFormComponent;
