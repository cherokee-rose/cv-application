import { Viewer, Worker } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";

const Modal = (props: any) => {
  const { fileName } = props;
  const pdfFile = require(`src/assets/pdf/${fileName}.pdf`);

  return (
    <>
      <input type="checkbox" id="my-modal-3" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box relative">
          <label htmlFor="my-modal-3" className="btn btn-sm btn-circle btn-primary absolute right-2 top-2 z-50">✕</label>
          <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.15.349/build/pdf.worker.js">
            <Viewer fileUrl={pdfFile}/>
          </Worker>
        </div>
      </div>
    </>
  );
};

export default Modal;
