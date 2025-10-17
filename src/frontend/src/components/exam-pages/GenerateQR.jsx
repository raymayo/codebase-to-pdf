import React, { useEffect, useState, useRef, useCallback } from "react";
import { QRCodeSVG } from "qrcode.react";
import { useParams } from "react-router-dom";
import { toPng } from "html-to-image";

const GenerateQR = () => {
  const { id } = useParams();
  const [student, setStudent] = useState(null);
  const qrRef = useRef(null);

  useEffect(() => {
    if (!id) return;

    const fetchStudent = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/register/${id}`,
        );
        if (!response.ok) throw new Error("Failed to fetch student data");

        const data = await response.json();
        setStudent(data);
      } catch (error) {
        console.error("Error fetching student:", error);
      }
    };

    fetchStudent();
  }, [id]);

  const handleDownload = useCallback(() => {
    if (!qrRef.current || !student) return;

    toPng(qrRef.current, { cacheBust: true, crossOrigin: "anonymous" })
      .then((dataUrl) => {
        const link = document.createElement("a");
        link.href = dataUrl;
        link.download = `entrance_exam_qrid_${student.name || "unknown"}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      })
      .catch((error) => {
        console.error("Error generating QR image:", error);
      });
  }, [student]);

  // 🔥 Auto-download once student is loaded & QR is rendered
  useEffect(() => {
    if (student) {
      const timer = setTimeout(() => {
        handleDownload();
      }, 500); // give time for QR code to render
      return () => clearTimeout(timer);
    }
  }, [student, handleDownload]);

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center bg-white">
      <div
        ref={qrRef}
        className="flex h-fit w-full max-w-sm flex-col items-center rounded-md bg-zinc-800 shadow-md border border-zinc-200"
      >
        <div className="pattern flex h-fit w-full max-w-sm flex-col items-center gap-4 rounded-md p-2">
          <div className="flex w-full flex-col gap-2 rounded-md bg-white p-12">
            <QRCodeSVG
              value={student?._id || ""}
              className="h-full w-full rounded-md bg-white p-6 border border-zinc-200 shadow-md"
            />
            <h1 className="mt-4 text-center text-xl font-medium">
              {student?.name || "Loading..."}
            </h1>
            {student ? (
              <div className="flex w-full flex-col items-center justify-center gap-4 bg-white p-2 text-center">
                <h1 className="flex w-full flex-col text-xs font-medium text-zinc-500">
                  Username
                  <span className="text-base font-normal text-zinc-950">
                    {student.regNo}
                  </span>
                </h1>
                <h1 className="flex w-full flex-col text-xs font-medium text-zinc-500">
                  Password
                  <span className="text-base font-normal text-zinc-950">
                    {student.password}
                  </span>
                </h1>
              </div>
            ) : (
              <p className="text-center">Loading...</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GenerateQR;
