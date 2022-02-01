import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import LoadingBox from "../components/LoadingBox";
import ReactPaginate from "react-paginate";
import MessageBox from "../components/MessageBox";
import Cookies from "js-cookie";
// import "./App.css";

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
interface selectedType {
  selected: number;
}
function CallsScreen() {
  const [calls, setCalls] = useState<[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [pageCount, setPageCount] = useState<number>(0);
  const [limit, setLimit] = useState<number>(12);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [refresh, setRefresh] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    checkToken();
  }, []);

  const checkToken = () => {
    const refresh_token = localStorage.getItem("refresh_token");
    if (!refresh_token) {
      navigate("/login");
    }
  };

  useEffect(() => {
    //getting calls
    getCalls(currentPage);
  }, [currentPage]);

  const getCalls = async (currentPage: number) => {
    const token = Cookies.get("access_token");
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}?offset=${currentPage}&&_limit=${limit}`,
        {
          headers: {
            method: "GET",

            "Content-type": "application/json",
            Authorization: `Bearer ${token}`, // notice the Bearer before your token
          },
        }
      );
      setLoading(false);
      const data = await response.json();
      if (response?.status == 200) {
        console.log("inside of the 200");
        const totalCalls = Number(response.headers.get("x-total-count"));
        setPageCount(Math.ceil(totalCalls / 5));
        setCalls(data?.nodes);
      } else {
        throw data?.message;
      }
    } catch (e: any) {
      setLoading(false);
      setError(e);
    }
  };

  const handleClickPage = (selectedItem: selectedType) => {
    setCurrentPage(selectedItem?.selected + 1);
  };

  //group by date
  const groupByDate = () => {
    calls?.sort((a: any, b: any) => {
      return (
        new Date(a.created_at).getDate() - new Date(b.created_at).getDate()
      );
    });
    setCalls(calls);
    setRefresh(!refresh);
  };
  const toggleArchive = async (id: string) => {
    try {
      const token = Cookies.get("access_token");

      try {
        setLoading(true);
        const response = await fetch(
          `${process.env.REACT_APP_BASE_URL}/${id}/archive`,
          {
            method: "PUT",
            headers: {
              "Content-type": "application/json",
              Authorization: `Bearer ${token}`, // notice the Bearer before your token
            },
          }
        );
        setLoading(false);
        console.log("response from archive");
        const data = await response.json();
        console.log("data", response);
        if (response?.status == 200) {
          getCalls(currentPage);
        } else {
          throw data?.message;
        }
      } catch (e: any) {
        setLoading(false);
        setError(e);
      }
    } catch (e) {}
  };

  return (
    <div className="container">
      {calls && !error && !loading && (
        <div className="grp-date">
          <button onClick={() => groupByDate()}>Group By Date</button>
        </div>
      )}
      {loading ? (
        <LoadingBox />
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <div className="row m-2">
          {calls.map((call: callType) => {
            return (
              <div key={call.id} className="col-sm-6 col-md-4 v my-2">
                <div
                  className="card shadow-sm w-100"
                  style={{ minHeight: 225 }}
                >
                  <div className="card-body">
                    <h6 className="card-subtitle mb-2 text-muted text-center">
                      Duration: {call.duration}
                    </h6>
                    <p className="card-text" style={{ textAlign: "center" }}>
                      From:{call.from}
                    </p>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-around",
                        alignItems: "center",
                        paddingTop: 30,
                      }}
                    >
                      <button onClick={() => toggleArchive(call.id)}>
                        {call.is_archived ? "Un Archive" : "Archive"}
                      </button>
                      <Link to={`/call/${call.id}`}>
                        <button>Description</button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {!error && !loading && (
        <ReactPaginate
          previousLabel={"Previous"}
          nextLabel={"Next"}
          breakLabel={"..."}
          pageCount={pageCount}
          marginPagesDisplayed={2}
          pageRangeDisplayed={3}
          onPageChange={handleClickPage}
          containerClassName="pagination justify-content-center"
          pageClassName="page-item"
          pageLinkClassName="page-link"
          previousClassName="page-item"
          previousLinkClassName="page-link"
          nextClassName="page-item"
          nextLinkClassName="page-link"
          breakClassName="page-item"
          breakLinkClassName="page-link"
          activeClassName="active"
        />
      )}
      {error && <button onClick={() => navigate("/login")}>SignOut</button>}
    </div>
  );
}

export default CallsScreen;
