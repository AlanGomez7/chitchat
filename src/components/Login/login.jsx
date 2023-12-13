import { background } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState(false);
  const navigate = useNavigate();
  // let emailRegex = new RegExp('[a-z0-9]+@[a-z]+\.[a-z]{2,3}');
  // const [checkEmail, setEmailChecker] = useState('')

  useEffect(() =>{
    if(localStorage.getItem("userInfo")){
      navigate("/chat");
    }
  },[])
  
  const submitHandler = () => {
    fetch("http://localhost:3000/login", {
      method: "POST",
      body: JSON.stringify({
        email,
        password,
      }),
      headers: { "Content-Type": "application/json; charset=UTF-8"},
    })
      .then((r) => r.json())
      .then((res) => {
        console.log(res)
        if (res.token) {
          const data = JSON.stringify(res)
          navigate("/chat");
          localStorage.setItem("userInfo", data);
        } else {
          setErr(true);
        }
      });
  };
  return (
    <>
      <div className="wrapper flex justify-center  items-center h-screen">
        <div className="login-card p-5 h-96 w-96 shadow-lg rounded-xl">
          <div className="label-div">
            <p className="text-4xl">Login Here</p>
            <div className="input-div">
              {err ? (
                <p style={{ color: "red" }} className="mt-10">
                  Invalid user Credentials
                </p>
              ) : (
                ""
              )}
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11 mt-10 w-80 p-4 bg-yellow-50"
                placeholder="Enter your email here"
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-11  mt-5 w-80 p-4 bg-yellow-50"
                placeholder="Enter your password here"
              />
            </div>
            <button
              className="h-10 w-32 bg-primary flex justify-center items-center rounded-sm mt-10"
              onClick={submitHandler}
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default login;
