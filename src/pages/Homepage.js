import React, { useState } from "react";
import * as XLSX from "xlsx";

const Homepage = () => {
  const [file1Data, setFile1Data] = useState([]);
  const [file2Data, setFile2Data] = useState([]);
  const [diffs, setDiffs] = useState([]);

  const handleFileUpload = (e, setData) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json(sheet);
      setData(json);
    };
    reader.readAsArrayBuffer(file);
  };

  // 修正 compareData
  const compareData = function () {
    if (!file1Data.length || !file2Data.length) {
      alert("請先上傳兩個檔案");
      return;
    }
    // 取出 key 欄位並去除非字母數字

    const column1 = file1Data.map((row, idx) => {
      return (row["net_name"] || "").toLowerCase().replace(/[^a-z0-9]/gi, "");
    });
    const column2 = file2Data.map((row) => {
      return (row["net_name"] || "").toLowerCase().replace(/[^a-z0-9]/gi, "");
    });

    console.log(column1);

    const set1 = new Set(column1);
    const set2 = new Set(column2);
    const onlyLn1 = [...set1].filter((x) => !set2.has(x));
    const onlyLn2 = [...set2].filter((x) => !set1.has(x));

    setDiffs([
      { source: "只在檔案 1 出現", values: onlyLn1 },
      {
        source: "只在檔案 2 出現",
        values: onlyLn2,
      },
    ]);
  };

  return (
    <div>
      <h1>net_name比對工具</h1>
      <div>
        <input
          type="file"
          accept=".xlsx"
          onChange={(e) => handleFileUpload(e, setFile1Data)}
        />
        <span>檔案1</span>
      </div>
      <div>
        <input
          type="file"
          accept=".xlsx"
          onChange={(e) => handleFileUpload(e, setFile2Data)}
        />
        <span>檔案2</span>
      </div>
      <button onClick={compareData}>比對net_name</button>

      {diffs.length > 0 && (
        <div>
          {diffs.map((diff, i) => (
            <div key={i}>
              <h2>{diff.source}</h2>
              <ul>
                {diff.values.map((v, idx) => (
                  <li key={idx}>{v}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Homepage;
