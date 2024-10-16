import React, { useEffect, useState } from "react"
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import Loader from "./Loader";
// const URL = 'http://13.202.71.152:9000/upload';
// const URL = 'http://localhost:9000/upload';
const URL = 'http://192.168.0.181:9000/testing';

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [pages, setPages] = useState([]);
  const [totalPages, setTotalPages] = useState("");
  const [error, setError] = useState(null);
  const [loader, setLoader] = useState(false);
  const onFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    setPages([]);
  };

  const onFileUpload = async () => {
    const formData = new FormData();
    formData.append('pdf', selectedFile);
    try {
      setLoader(true);
      const { data } = await axios.post(URL, formData);
      setLoader(false);

      if (data?.success) {
        toast.success("Page data Get Successfully")
        setPages(data?.result);
      }
    } catch (error) {
      setLoader(false);
      toast.error("An error occurred while uploading the file.")
    }

  };
  return (
    <>
      {loader ? (
        <Loader />
      ) : ("")}
      <div className="container mt-5">
        <h2>Upload PDF to Get Page Sizes</h2>
        <div className="mb-5">
          <input type="file" className="form-control" onChange={onFileChange} />
        </div>
        <button className="btn btn-primary" onClick={onFileUpload} disabled={!selectedFile}>
          Upload
        </button>

        {error && <div className="alert alert-danger mt-3">{error}</div>}

        {pages &&
          <h3 className="mt-5">TotalPages: {pages?.length}</h3>
        }
        {pages?.length > 0 && (
          <div className="mt-4">
            <h4>Page Sizes</h4>
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Page No</th>
                  <th>Page Type</th>
                </tr>
              </thead>
              <tbody>
                {pages.map((page, index) => (
                  <tr key={index}>
                    <td>{page.pageNo}</td>
                    <td>{page.pageType}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <ToastContainer />
    </>
  );
}

export default App;
