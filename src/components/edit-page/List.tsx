import LinkedNode from "src/indexed-linked-list/LinkedNode";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { solid } from "@fortawesome/fontawesome-svg-core/import.macro";
import { useEffect, useState, useCallback } from "react";

const List = (props: any) => {
  const state: IndexedLinkedList<string> = props.state;
  const updateState: (newState: IndexedLinkedList<string>) => void = props.updateState;

  /**
   * Functions for manual state changes:
   */
  const [, render] = useState({});
  const forceUpdate = useCallback(() => render({}), []);

  const [isInputOn, setInputMode] = useState(false);
  const [currentModified, updateModified] = useState(null);
  const [currentInput, updateInput] = useState('');
  const [selectedEntryId, setSelectedEntryId] = useState('');

  const addEntry = (newEntry: string) => {
    state.appendNode(LinkedNode(newEntry));
    updateState(state);
  };

  const removeEntry = (entryId: string) => {
    state.removeNode(entryId);
    updateState(state);
    forceUpdate();
  };

  const editEntry = (entry: LinkedNode<string>) => {
    entry.setValue(currentInput);
    updateState(state);
  };

  const setNewInput = (event) => {
    updateInput(event.target.value);
  };

  const acceptInput = () => {
    if (isInputOn) {
      addEntry(currentInput);
      setInputMode(false);
    } else if (currentModified !== null) {
      editEntry(currentModified);
      updateModified(null);
    }

    updateInput('');
  };

  const cancelInput = () => {
    updateInput('');
    updateModified(null);
    setInputMode(false);
  };

  const selectEntry = (entryId: string) => {
    document.getElementById(selectedEntryId)?.classList.remove('bg-secondary');
    document.getElementById(entryId)?.classList.add('bg-secondary');
    setSelectedEntryId(entryId);
  }

  const moveUp = () => {
    const currentNode = state.getNode(selectedEntryId);
    state.swapNodes(currentNode, currentNode.getPrevious());
    updateState(state);
    forceUpdate();
  };
  
  const moveDown = () => {
    const currentNode = state.getNode(selectedEntryId);
    state.swapNodes(currentNode.getNext(), currentNode);
    updateState(state);
    forceUpdate();
  };

  return (
    <ul className="border rounded-lg">
      {[...state].map((entry: LinkedNode<string>) => (
        <li key={entry.getId()} className="border border-primary cursor-pointer" id={entry.getId()} onClick={selectEntry.bind(null, entry.getId())}>
          {entry.getValue()}
        </li>
      ))}
      {
        currentModified === null && !isInputOn ? (
            <button className="btn btn-circle" onClick={setInputMode.bind(null, true)}>
                <FontAwesomeIcon icon={solid("plus")}></FontAwesomeIcon>
            </button>
        ) : (
          <div>
            <input type="text" placeholder="Type here" className="input input-bordered input-primary w-full max-w-xs" onChange={setNewInput}/>
            <button className="btn btn-circle" onClick={acceptInput}>
              <FontAwesomeIcon icon={solid("check")}></FontAwesomeIcon>
            </button>
            <button className="btn btn-circle" onClick={cancelInput}>
              <FontAwesomeIcon icon={solid("xmark")}></FontAwesomeIcon>
            </button>
          </div>
        )
      }
      {
        selectedEntryId !== '' ? (
          <div>
            <button
              className="btn btn-circle"
              onClick={removeEntry.bind(null, selectedEntryId)}
            >
              <FontAwesomeIcon
                icon={solid("x")}
                className="text-xs"
              ></FontAwesomeIcon>
            </button>
            {!isInputOn ? (
              <button className="btn btn-circle" onClick={() => updateModified(state.getNode(selectedEntryId))}>
                <FontAwesomeIcon
                  icon={solid("pen")}
                  className="text-xs"
                ></FontAwesomeIcon>
              </button>
            ): (
              <></>
            )}
            <button className="btn btn-circle" onClick={moveUp}>
              <FontAwesomeIcon 
                icon={solid('arrow-up')}
                className="text-xs"
              ></FontAwesomeIcon>
            </button>
            <button className="btn btn-circle" onClick={moveDown}>
              <FontAwesomeIcon 
                icon={solid('arrow-down')}
                className="text-xs"
              ></FontAwesomeIcon>
            </button>
          </div>
        ) : (
          <></>
        )
      }
    </ul>
  );
};

export default List;
