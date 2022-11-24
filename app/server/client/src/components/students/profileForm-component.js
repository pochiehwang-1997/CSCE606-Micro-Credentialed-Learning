import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import StudentService from "../../services/student.service";

const ProfileForm = (props) => {
  return(
    <><label htmlFor={props.name}>{props.name}</label>
    <input
      name={props.name}
      type="text"
      className="form-control mt-2"
      id={props.name}
      defaultValue={props.defaultValue}
      onChange={props.onChange}
    /></>
  );
};

const ProfileFormComponent = (props) => {
  const [ currentFirstName, setFirstName ] = useState("");
  const [ currentLastName, setLastName ] = useState("");
  const [ currentAddress, setAddress ] = useState("");
  const [ currentPhone, setPhone ] = useState("");
  const [ currentEmail, setEmail ] = useState("");
  const [ currentDescription, setDescription ] = useState("");
  let [message, setMessage] = useState(null);
  const history = useHistory();

  const handleChangeFirstName = (e) => {
    setFirstName(e.target.value);
  };
  const handleChangeLastName = (e) => {
    setLastName(e.target.value);
  };
  const handleChangeAddress = (e) => {
    setAddress(e.target.value);
  };
  const handleChangePhone = (e) => {
    setPhone(e.target.value);
  };
  const handleChangeEmail = (e) => {
    setEmail(e.target.value);
  };
  const handleChangeDescription = (e) => {
    setDescription(e.target.value);
  };

  useEffect(() => {
    StudentService.renderProfileForm()
    .then(({ data }) => {
      setFirstName(data.firstName);
      setLastName(data.lastName);
      setAddress(data.address);
      setPhone(data.phone);
      setEmail(data.email)
      setDescription(data.description);
    })
    .catch((err) => {
      console.log(err);
    });
  }, []);

  const updateProfile = () => {
    const editProfile = {
      firstName: currentFirstName,
      lastName: currentLastName,
      address: currentAddress,
      phone: currentPhone,
      email: currentEmail,
      description: currentDescription,
    };
    StudentService.updateProfile(editProfile).then(() => {
      window.alert("Profile is updated!")
      history.push("/student/home")
    }).catch((err) => {
      setMessage(err.response.data)
    });
  }

  return (
    <div style={{ padding: "3rem" }}>
      {/* If not login or not student*/}
      {!props.currentRole && (
        <h1>Please Login</h1>
      )}
      {/* If not student*/}
      {props.currentRole && props.currentRole !== "student" && (
        <h1>You Are Not a Student</h1>
      )}
      {/* If login and student */}
      {props.currentRole && props.currentRole === "student" && (
        <div 
          className="form-group"
          style={{
          position: "absolute",
          background: "#fff",
          top: "10%",
          left: "10%",
          right: "10%",
          padding: 15,
          border: "2px solid #444"
          }}
        >
          <h1>Edit Profile</h1>
          <ProfileForm 
            name={"First Name"}
            defaultValue={currentFirstName}
            onChange={handleChangeFirstName}
          />
          <ProfileForm 
            name={"Last Name"}
            defaultValue={currentLastName}
            onChange={handleChangeLastName}
          />
          <ProfileForm 
            name={"Email"}
            defaultValue={currentEmail}
            onChange={handleChangeEmail}
          />
          <ProfileForm 
            name={"Phone"}
            defaultValue={currentPhone}
            onChange={handleChangePhone}
          />
          <ProfileForm 
            name={"Address"}
            defaultValue={currentAddress}
            onChange={handleChangeAddress}
          />
          <p><label htmlFor="description">Description</label></p>
          <textarea id="description" rows="4" cols="50"
            value={currentDescription} onChange={handleChangeDescription} />
          <br />
          <button id="submit" className="btn btn-primary" onClick={updateProfile}>Submit</button>
          <br />
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

export default ProfileFormComponent;
