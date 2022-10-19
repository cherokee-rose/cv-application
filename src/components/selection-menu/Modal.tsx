import { Viewer, Worker } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import { useContext, useRef } from "react";
import { TemplateNameContext } from "src/App";

const Modal = () => {
  const [templateName, updateTemplateName] = useContext(TemplateNameContext);
  const pdfFile = useRef(require(`src/assets/pdf/${templateName}.pdf`));

  return (
    <>
      <input type="checkbox" id="my-modal-3" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box relative">
          <label htmlFor="my-modal-3" className="btn btn-sm btn-circle btn-primary absolute right-2 top-2 z-50">✕</label>
          <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.15.349/build/pdf.worker.js">
            <Viewer fileUrl={pdfFile.current}/>
          </Worker>
        </div>
      </div>
    </>
  );
};

export default Modal;
