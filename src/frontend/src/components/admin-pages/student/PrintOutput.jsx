import React from "react";

const PrintOutput = React.forwardRef(({ student }, ref) => {

  function formatDay(dateString) {
    const date = new Date(dateString);
    const month = String(date.getMonth() + 1).padStart(2, "0"); // months are 0-based
    const day = String(date.getDate()).padStart(2, "0");
    const year = date.getFullYear();
    return `${month}-${day}-${year}`;
  }

  // console.log(student);

  return (
    <div ref={ref} className="grid place-items-center px-6 pt-6">


      <div

        // style={containerStyle}
        className="print-scale-content bg-white text-sm text-black grid test justify-between"
      >
        <header className="relative mb-4 flex items-center justify-center gap-4">
          <div className="text-center">
            <h1 className="relative flex items-center text-3xl font-semibold uppercase">
              <img
                className="absolute left-[-4.5rem] w-14"
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQiqAW5DZhfWVqYlFU0p6Gqh5hfqzJTwi1BLw&s"
                alt="School Logo"
              />
              Kolehiyo Ng Subic
            </h1>
            <span className="-mt-2 mb-4 w-full text-center text-sm">
              Subic, Zambales
            </span>
          </div>
        </header>

        <h1 className="mb-4 text-center text-xl font-semibold">
          Registration Form
        </h1>

        <div className="mb-4 grid grid-cols-8 gap-y-1">
          <p className="col-span-6">Name: {student.name}</p>
          <p className="col-span-2">Sex: {student.gender}</p>
          <p className="col-span-8">Address: {student.address}</p>
          <p className="col-span-3">Place of Birth: {student.birthplace}</p>
          <p className="col-span-5">
            Date of Birth: {formatDay(student.birthday)}
          </p>
          <p className="col-span-3">Contact Number: {student.phone}</p>
          <p className="col-span-5">Name Of Guardian: {student.guardian}</p>
          <p className="col-span-8">School Last Attended: {student.lastSchool}</p>
          <p className="col-span-8">
            Address of School Last Attended: {student.lastSchoolAddress}
          </p>
          <p className="col-span-8">
            Course Taken (for Transferees Only): {student?.transfereeCourse || ""}
          </p>
          <p className="col-span-8">Course to be taken in this institution:</p>
          <p className="col-start-2 col-end-9">
            First Choice Course: {student.course1st}
          </p>
          <p className="col-start-2 col-end-9">
            Second Choice Course: {student.course2nd}
          </p>
        </div>

        <div className="mb-4 grid grid-cols-2 gap-4">
          <div>
            <h1 className="mb-2 text-center font-bold uppercase">
              Incoming First Year
            </h1>
            <ul className="list-none space-y-1">
              <li>( ) High School Card Form 138</li>
              <li>( ) Certificate of Good Moral Character</li>
              <li>( ) Barangay Certificate of Residency</li>
              <li>( ) Two (2) 2x2 Colored Pictures</li>
              <li>
                ( ) PSA Certified Birth Certificate (1 Original & 1 Photocopy)
              </li>
              <li>( ) Two (2) Long Brown Envelopes</li>
            </ul>
          </div>
          <div>
            <h1 className="mb-2 text-center font-bold uppercase">
              For Transferee
            </h1>
            <ul className="list-none space-y-1">
              <li>( ) Transcript of Record / Certificate of Grades</li>
              <li>( ) Honorable Dismissal</li>
              <li>( ) Barangay Certificate of Residency</li>
              <li>( ) Two (2) 2x2 Colored Pictures</li>
              <li>
                ( ) PSA Certified Birth Certificate (1 Original & 1 Photocopy)
              </li>
              <li>( ) Two (2) Long Brown Envelopes</li>
            </ul>
          </div>
        </div>

        <section className="grid grid-cols-10 border-b border-dashed py-4">
          <div className="col-start-8 col-end-11 text-center">
            <h1 className="border-b font-semibold">Ms. Thelma Laxamana</h1>
            <p>Registrar</p>
          </div>
        </section>

        <div className="my-4">
          <h1 className="text-right">DATE: {formatDay(student.createdAt)}</h1>
          <p>
            Mr./Ms {student.name} is granted to take the Entrance Examination on{" "}
            {formatDay(student.createdAt)} at COMLAB2
          </p>
        </div>

        <section className="grid grid-cols-10 py-4">
          <div className="col-start-8 col-end-11 text-center">
            <h1 className="border-b font-semibold">Ms. Thelma Laxamana</h1>
            <p>Registrar</p>
          </div>
        </section>

        <div className="mb-4 grid grid-cols-2 gap-4">
          <h1 className="col-span-2 font-bold">Entrance Examination Result</h1>
          <div>
            <p>
              <span className="font-semibold">{student.examScores.english}</span>{" "}
              English
            </p>
            <p>
              <span className="font-semibold">{student.examScores.math}</span>{" "}
              Mathematics
            </p>
            <p>
              <span className="font-semibold">{student.examScores.filipino}</span>{" "}
              Filipino
            </p>
          </div>
          <div>
            <p>
              <span className="font-semibold">{student.examScores.science}</span>{" "}
              Science
            </p>
            <p>
              <span className="font-semibold">
                {student.examScores.socialstudies}
              </span>{" "}
              Social Studies
            </p>
            <p>
              TOTAL SCORE:{" "}
              <span className="font-semibold">
                {student.examScores.english +
                  student.examScores.math +
                  student.examScores.filipino +
                  student.examScores.science +
                  student.examScores.socialstudies}
              </span>
            </p>
          </div>
        </div>

        <section className="grid grid-cols-10 pt-10">
          <div className="col-start-8 col-end-11 text-center">
            <h1 className="border-b font-semibold">&nbsp;</h1>
            <p>Signature</p>
          </div>
        </section>

        <section className="grid grid-cols-10 pt-4">
          <p className="col-span-10">Noted by:</p>
          <div className="col-start-2 col-end-6 text-center">
            <h1 className="border-b font-bold">PABLO MENDIOGARIN, MAED-GC</h1>
            <p>Guidance Counselor</p>
          </div>
        </section>
      </div>
    </div>
  );
});

export default PrintOutput;
