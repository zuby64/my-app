import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
export default function SigninScreen(props: any) {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<String | null>(null);
  const navigate = useNavigate();

  const submitHandler = async (e: any) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await fetch(
        "https://frontend-test-api.aircall.io/auth/login",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username: email, password: password }),
        }
      );
      setLoading(false);
      const data = await response.json();
      if (response.status == 201) {
        const { access_token, refresh_token } = data;
        Cookies.set("access_token", access_token);
        localStorage.setItem("refresh_token", refresh_token);
        navigate("/");
      } else {
        throw data?.message;
      }
    } catch (e: any) {
      setLoading(false);
      setError(e);
    }
  };

  return (
    <div>
      <form className="form" onSubmit={submitHandler}>
        <div>
          <h1>Sign In</h1>
        </div>
        {loading && <LoadingBox></LoadingBox>}
        {error && <MessageBox variant="danger">{error}</MessageBox>}
        <div>
          <label htmlFor="email">Email address</label>
          <input
            type="email"
            id="email"
            placeholder="Enter email"
            required
            onChange={(e) => setEmail(e.target.value)}
          ></input>
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            placeholder="Enter password"
            required
            onChange={(e) => setPassword(e.target.value)}
          ></input>
        </div>
        <div>
          <label />
          <button className="primary" type="submit">
            Sign In
          </button>
        </div>
      </form>
    </div>
  );
}
