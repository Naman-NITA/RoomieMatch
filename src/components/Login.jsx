import { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";

const Login = () => {
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [about, setAbout] = useState("");
  const [skills, setSkills] = useState("");
  const [isLoginForm, setIsLoginForm] = useState(true);
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post(
        BASE_URL + "/login",
        { emailId, password },
        { withCredentials: true }
      );
      dispatch(addUser(res.data));
      return navigate("/");
    } catch (err) {
      setError(err?.response?.data || "Something went wrong");
    }
  };

  const handleSignUp = async () => {
    try {
      const res = await axios.post(
        BASE_URL + "/signup",
        {
          firstName,
          lastName,
          emailId,
          password,
          age,
          gender,
          photoUrl,
          about,
          skills: skills.split(",").map((s) => s.trim()),
        },
        { withCredentials: true }
      );
      dispatch(addUser(res.data.data));
      return navigate("/profile");
    } catch (err) {
      setError(err?.response?.data || "Something went wrong");
    }
  };

  return (
    <div className="flex justify-center my-10">
      <div className="card bg-base-300 w-96 shadow-xl">
        <div className="card-body">
          <h2 className="card-title justify-center">
            {isLoginForm ? "Login" : "Sign Up"}
          </h2>
          <div>
            {!isLoginForm && (
              <>
                <label className="form-control my-2">
                  <div className="label">
                    <span className="label-text">First Name</span>
                  </div>
                  <input
                    type="text"
                    value={firstName}
                    className="input input-bordered"
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </label>
                <label className="form-control my-2">
                  <div className="label">
                    <span className="label-text">Last Name</span>
                  </div>
                  <input
                    type="text"
                    value={lastName}
                    className="input input-bordered"
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </label>
                <label className="form-control my-2">
                  <div className="label">
                    <span className="label-text">Age</span>
                  </div>
                  <input
                    type="number"
                    value={age}
                    className="input input-bordered"
                    onChange={(e) => setAge(e.target.value)}
                  />
                </label>
                <label className="form-control my-2">
                  <div className="label">
                    <span className="label-text">Gender</span>
                  </div>
                  <input
                    type="text"
                    value={gender}
                    className="input input-bordered"
                    onChange={(e) => setGender(e.target.value)}
                  />
                </label>
                <label className="form-control my-2">
                  <div className="label">
                    <span className="label-text">Photo URL</span>
                  </div>
                  <input
                    type="text"
                    value={photoUrl}
                    className="input input-bordered"
                    onChange={(e) => setPhotoUrl(e.target.value)}
                  />
                </label>
                <label className="form-control my-2">
                  <div className="label">
                    <span className="label-text">About</span>
                  </div>
                  <textarea
                    value={about}
                    className="textarea textarea-bordered"
                    onChange={(e) => setAbout(e.target.value)}
                  />
                </label>
                <label className="form-control my-2">
                  <div className="label">
                    <span className="label-text">Skills (comma separated)</span>
                  </div>
                  <input
                    type="text"
                    value={skills}
                    className="input input-bordered"
                    onChange={(e) => setSkills(e.target.value)}
                  />
                </label>
              </>
            )}
            <label className="form-control my-2">
              <div className="label">
                <span className="label-text">Email ID</span>
              </div>
              <input
                type="email"
                value={emailId}
                className="input input-bordered"
                onChange={(e) => setEmailId(e.target.value)}
              />
            </label>
            <label className="form-control my-2">
              <div className="label">
                <span className="label-text">Password</span>
              </div>
              <input
                type="password"
                value={password}
                className="input input-bordered"
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>
          </div>
          <p className="text-red-500 text-sm">{error}</p>
          <div className="card-actions justify-center mt-4">
            <button
              className="btn btn-primary"
              onClick={isLoginForm ? handleLogin : handleSignUp}
            >
              {isLoginForm ? "Login" : "Sign Up"}
            </button>
          </div>
          <p
            className="mt-4 text-center cursor-pointer text-blue-600 underline"
            onClick={() => setIsLoginForm((prev) => !prev)}
          >
            {isLoginForm
              ? "New User? Signup Here"
              : "Existing User? Login Here"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
