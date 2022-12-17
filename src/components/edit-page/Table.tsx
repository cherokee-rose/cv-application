import uniqid from "uniqid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { solid } from "@fortawesome/fontawesome-svg-core/import.macro";
import { useState, useCallback, useRef, useEffect } from "react";
import LinkedNode from "DataAPI/LinkedNode";
import getDateFromString from "Helpers/getDateFromString";

const Table = (props: any) => {
  /**
   * Props
   */
  const data: IndexedLinkedList<Row> = props.data;
  const updateData: (newState: IndexedLinkedList<Row>) => void =
    props.updateData;
  const title: string = props.title;
  const maxItems = props.maxItems as number;

  /**
   * The prototype of a row is required for creating new instances.
   */
  const rowPrototype = useRef(null);
  if (rowPrototype.current === null) {
    rowPrototype.current = data.getHead().getValue().createNewInstance();
  }

  /**
   * States
   */
  const [, render] = useState({});
  const forceUpdate = useCallback(() => render({}), []);
  const updateAllStates = () => {
    updateData(data);
    forceUpdate();
  };
  const [selectedTarget, setSelectedTarget] = useState({
    selectedRow: data.getHead(),
    selectedField: "",
  });
  const [isInputOn, setInputMode] = useState(false);
  const [currInput, setNewInput] = useState("");
  const [isValidInput, setValidity] = useState(true);

  /**
   * Functions for operating on the state
   */
  const rejectInput = () => {
    setNewInput("");
    setInputMode(false);
  };

  const acceptInput = () => {
    if (!isValidInput) {
      return;
    }

    (selectedTarget.selectedRow as LinkedNode<Row>)
      .getValue()
      .editField(
        selectedTarget.selectedField.slice(
          0,
          selectedTarget.selectedField.indexOf("-")
        ),
        currInput
      );
    rejectInput();
    updateAllStates();
  };

  const addRow = () => {
    if (data.getLength() < maxItems) {
      data.appendNode(LinkedNode(rowPrototype.current.createNewInstance()));
      updateAllStates();
    }
  };

  const removeRow = () => {
    data.removeNode((selectedTarget.selectedRow as LinkedNode<Row>).getId());
    updateAllStates();
  };

  const moveRowUp = () => {
    data.swapNodes(
      (selectedTarget.selectedRow as LinkedNode<Row>).getPrevious(),
      selectedTarget.selectedRow as LinkedNode<Row>
    );
    updateAllStates();
  };

  const moveRowDown = () => {
    data.swapNodes(
      selectedTarget.selectedRow as LinkedNode<Row>,
      (selectedTarget.selectedRow as LinkedNode<Row>).getNext()
    );
    updateAllStates();
  };

  const handleOpenEditInput = () => {
    setInputMode(true);

    const row = (selectedTarget.selectedRow as LinkedNode<Row>).getValue();
    var field = selectedTarget.selectedField;
    field = field.slice(0, field.indexOf("-"));
    setNewInput(row.getFieldValue(field));
  };

  const handleSelectField = (newTarget: {
    selectedField: string;
    selectedRow: LinkedNode<Row>;
  }) => {
    setInputMode(false);
    setSelectedTarget(newTarget);
  };

  const getDates = (
    field: string,
    inputDate: string
  ): [dateFrom: Date, dateTo: Date] => {
    const dateFromData =
      field === "dateFrom"
        ? inputDate
        : selectedTarget.selectedRow.getValue().getFieldValue("dateFrom");
    const dateToData =
      field === "dateTo"
        ? inputDate
        : selectedTarget.selectedRow.getValue().getFieldValue("dateTo");

    return [getDateFromString(dateFromData), getDateFromString(dateToData)];
  };

  const validateDate = (
    field: string,
    inputDate: string,
    target: HTMLInputElement
  ): void => {
    if (field === "dateFrom" && inputDate === "") {
      setValidity(false);
      target.setCustomValidity("The starting date must specified.");
      return;
    }

    const [dateFrom, dateTo] = getDates(field, inputDate);

    if (dateFrom > dateTo) {
      setValidity(false);
      target.setCustomValidity(
        "The starting date cannot be after the ending date."
      );
    } else {
      setValidity(true);
    }
    setNewInput(inputDate);
  };

  const handleNewInput = (e: Event) => {
    const target = e.target as HTMLInputElement;
    const newInput = target.value;
    let field = selectedTarget.selectedField;
    field = field.slice(0, field.indexOf("-"));
    
    if (field === "dateFrom" || field === "dateTo") {
      validateDate(field, newInput, target);
    } else {
      setNewInput(newInput);
    }
  };

  useEffect(() => {
    if (selectedTarget.selectedField !== "") {
      document.getElementById(selectedTarget.selectedField)?.focus();
    }
  }, []);

  return (
    <div className="flex flex-col w-full h-full gap" key={uniqid()}>
      <h1 className="text-3xl h-1/6 w-full flex items-center justify-center">
        {title}
      </h1>
      <div className="overflow-scroll h-4/6 w-full">
        {/* Table */}
        <table className="table text-xs h-full w-full">
          <thead>
            <tr>
              <th></th>
              {[
                data
                  .getHead()
                  ?.getValue()
                  .getAllFields()
                  .map((field: string) => <th key={uniqid()}>{field}</th>),
              ]}
            </tr>
          </thead>
          <tbody>
            {([...data] as { i: number; node: LinkedNode<Row> }[]).map(
              (entry) => (
                <tr
                  id={entry.node.getId()}
                  key={uniqid()}
                  className={
                    (entry.node === selectedTarget.selectedRow
                      ? "border border-secondary"
                      : "") + " cursor-pointer"
                  }
                >
                  <th className="border-r border-r-neutral">{entry.i + 1}</th>
                  {[
                    entry.node
                      .getValue()
                      .getAllFields()
                      .map((field: string) => (
                        <td
                          className={
                            (field + "-" + entry.node.getId() ===
                            selectedTarget.selectedField
                              ? "bg-accent-content"
                              : "") +
                            " whitespace-normal cursor-pointer border-l border-l-neutral"
                          }
                          id={field + "-" + entry.node.getId()}
                          key={uniqid()}
                          onClick={() =>
                            handleSelectField({
                              selectedField: field + "-" + entry.node.getId(),
                              selectedRow: entry.node,
                            })
                          }
                        >
                          <button
                            autoFocus={
                              selectedTarget.selectedField ===
                              field + "-" + entry.node.getId()
                            }
                          >
                            {entry.node.getValue().getFieldValue(field)}
                          </button>
                        </td>
                      )),
                  ]}
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
      <div className="flex flex-col justify-center items-center p-2 h-1/6 mt-3">
        {/* Input container */}
        {isInputOn ? (
          <div className="flex justify-center gap-2">
            <input
              autoFocus={true}
              max={(() => {
                let today = new Date();
                return `${today.getFullYear()}-${
                  today.getMonth() + 1
                }-${today.getDate()}`;
              })()}
              value={currInput}
              type={
                selectedTarget.selectedField.startsWith("date")
                  ? "date"
                  : "text"
              }
              placeholder="Type here"
              className={
                "input input-bordered w-full max-w-xs" +
                (!isValidInput ? " input-error" : " input-primary")
              }
              onChange={(e: any) => handleNewInput(e)}
            />
            <button className="btn btn-circle" onClick={acceptInput}>
              <FontAwesomeIcon icon={solid("check")}></FontAwesomeIcon>
            </button>
            <button className="btn btn-circle" onClick={rejectInput}>
              <FontAwesomeIcon icon={solid("xmark")}></FontAwesomeIcon>
            </button>
          </div>
        ) : (
          <button className="btn btn-circle" onClick={addRow}>
            <FontAwesomeIcon icon={solid("plus")}></FontAwesomeIcon>
          </button>
        )}
        {/* Modification buttons */}
        {selectedTarget.selectedRow !== null &&
        !isInputOn &&
        data.getLength() > 0 ? (
          <div className="flex gap-2">
            <button className="btn btn-circle" onClick={removeRow}>
              <FontAwesomeIcon
                icon={solid("x")}
                className="text-xs"
              ></FontAwesomeIcon>
            </button>
            <button
              className="btn btn-circle"
              onClick={() => handleOpenEditInput()}
            >
              <FontAwesomeIcon
                icon={solid("pen")}
                className="text-xs"
              ></FontAwesomeIcon>
            </button>
            <button className="btn btn-circle" onClick={moveRowUp}>
              <FontAwesomeIcon
                icon={solid("arrow-up")}
                className="text-xs"
              ></FontAwesomeIcon>
            </button>
            <button className="btn btn-circle" onClick={moveRowDown}>
              <FontAwesomeIcon
                icon={solid("arrow-down")}
                className="text-xs"
              ></FontAwesomeIcon>
            </button>
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default Table;
