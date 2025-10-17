import React, { useState, useEffect } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const API_BASE_URL = "http://localhost:5000/api/register";

const CodeScanner = () => {
  const [qrCode, setQRCode] = useState(null);
  const [result, setResult] = useState(null);
  const [animatedScores, setAnimatedScores] = useState({});
  const [loading, setLoading] = useState(false);

  const handleScan = (data) => {
    const value = data?.[0]?.rawValue?.trim();
    if (!value || value === qrCode) return;

    setQRCode(value);
    fetchScore(value);
  };

  const handleError = (error) => {
    console.error("QR scan error:", error);
  };

  const fetchScore = async (code) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/${code}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      const result = await response.json();
      console.log("Server response:", result);
      setResult(result);
    } catch (error) {
      console.error("Fetch error:", error);
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!result?.examScores) return;

    setAnimatedScores({}); // Reset scores for animation

    const timeout = setTimeout(() => {
      setAnimatedScores(result.examScores);
    }, 100); // Delay triggers animation

    return () => clearTimeout(timeout);
  }, [result]);

  const getPathColor = (percentage) => {
    if (percentage <= 50) return "rgba(255, 69, 58, 1)"; // Red for 0-50%
    if (percentage <= 75) return "rgba(255,165,0,1.0)"; // Yellow for 51-75%
    return "rgba(8, 207, 108, 1)"; // Green for 76-100%
  };

  const getBgColor = (percentage) => {
    if (percentage <= 50) return "#FFEEEC"; // Red for 0-50%
    if (percentage <= 75) return "#FFF6EB"; // Yellow for 51-75%
    return "#EDFBF1"; // Green for 76-100%
  };

  const hasValidResult =
    result?.name &&
    result?.examScores &&
    Object.keys(result.examScores).length > 0;

  return (
    <div className="bg-white0 grid h-screen w-screen place-items-center p-8">
      <div className="w-full max-w-xl">
        <Scanner
          onScan={handleScan}
          onError={handleError}
          facingMode="environment"
        />

        {loading && (
          <p className="mt-4 text-center text-sm text-gray-500">
            Fetching results...
          </p>
        )}

        {hasValidResult && (
          <div className="mt-4 flex w-full flex-col rounded-lg border border-zinc-200 bg-white p-4 text-gray-700 shadow-2xs">
            <h1 className="text-center text-lg font-medium">
              {result.name} Results
            </h1>
            <div className="grid w-full grid-cols-5 text-center">
              {Object.entries(result.examScores).map(([subject, score]) => {
                const percentage = (animatedScores[subject] / 50) * 100 || 0;

                return (
                  <div
                    key={subject}
                    className="flex flex-col items-center justify-center gap-2 p-4"
                  >
                    <CircularProgressbar
                      className="font-medium"
                      value={percentage}
                      text={`${score}/50`}
                      background={true}
                      styles={buildStyles({
                        pathColor: getPathColor(percentage),
                        textColor: getPathColor(percentage),
                        trailColor: "rgba(214,214,214,.0)",
                        backgroundColor: getBgColor(percentage),
                        textSize: "1.4rem",
                      })}
                      pathTransitionDuration={1.5}
                    />
                    <h2 className="text-sm font-medium capitalize">
                      {subject}
                    </h2>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CodeScanner;
