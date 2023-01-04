import React, { useEffect, useState } from "react";
import Table from "./components/Table";
import axios from "axios";

function App() {
  const [data, setData] = useState([]);

  const fetchData = async () => {
    const { data } = await axios("https://run.mocky.io/v3/a2fbc23e-069e-4ba5-954c-cd910986f40f").catch((err) => console.log(err));
    setData(data.result.auditLog);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="container">
      <Table mockData={data} />
    </div>
  );
}

export default App;
