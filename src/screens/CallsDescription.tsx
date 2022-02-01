import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
interface callType {
  call_type: string;
  created_at: string;
  duration: string;
  direction: number;
  from: string;
  to: string;
  is_archived: string;
  notes: [];
  via: string;
  id: string;
}
export default function () {
  const [loading, setLoading] = useState<boolean>(true);
  const [call, setCall] = useState<callType>();
  const [error, setError] = useState<string | null>();
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    //getting calls
    getCallDescription(id);
  }, [id]);

  const getCallDescription = async (id: any) => {
    const token = Cookies.get("access_token");
    try {
      setLoading(true);
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/${id}`, {
        headers: {
          method: "GET",

          "Content-type": "application/json",
          Authorization: `Bearer ${token}`, // notice the Bearer before your token
        },
      });
      setLoading(false);
      const data = await response.json();
      if (response.status) {
        setCall(data);
      } else {
        throw data?.message;
      }
    } catch (e: any) {
      setLoading(false);
      setError(e);
    }
  };

  return (
    <div className="container">
      {loading ? (
        <LoadingBox />
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <div className="col-sm-6 col-md-4 v my-2">
          <div className="card shadow-sm w-100" style={{ minHeight: 225 }}>
            <div className="card-body">
              <h6 className="card-subtitle mb-2 text-muted text-center">
                Duration: {call?.duration}
              </h6>
              <p className="card-text"> From:{call?.from}</p>
              <p className="card-text"> To:{call?.to}</p>
            </div>
          </div>
        </div>
      )}
      {error && (
        <div className="grp-date">
          <button onClick={() => navigate("/login")}>Signout</button>
        </div>
      )}
    </div>
  );
}
