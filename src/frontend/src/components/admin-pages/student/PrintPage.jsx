import React from "react";
import { useReactToPrint } from "react-to-print";
import PrintOutput from "./PrintOutput";
import { Printer } from "lucide-react";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

const PrintPage = ({ student }) => {
  const componentRef = React.useRef(null);

  const printFn = useReactToPrint({
    contentRef: componentRef,
    documentTitle: "AwesomeFileName",
  });

  return (
    <>
      {/* Hidden print output */}
      <div className="hidden">
        <PrintOutput ref={componentRef} student={student} />
      </div>

      {/* Dropdown item instead of button */}
      <DropdownMenuItem onClick={printFn}>
        <Printer size={14} className="mr-2" />
        Print Student
      </DropdownMenuItem>
    </>
  );
};

export default PrintPage;
