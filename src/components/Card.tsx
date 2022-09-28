import React from "react";

class Card extends React.Component<any, any> {
  constructor(props: any) {
    super(props);

    this.state = {
      // TODO
    };
  }

  render(): React.ReactNode {
    const { title, iconObj } = this.props.data;
    const { onInspect } = this.props;

    return (
      <div className="bg-white rounded-2xl shadow-xl flex flex-col items-center gap-4 p-2 h-[30vh] w-[30vh]">
        <h1 className="font-bold text-center">{title}</h1>
        <div className="h-[20vh] w-3/4 lg:pt-3 rounded-lg text-center">
          {iconObj}
        </div>
        <button
          onClick={onInspect.bind(null, title)}
          type="button"
          data-bs-toggle="modal"
          data-bs-target="#inspectionModal"
          className="w-1/2 bg-purple-500 border border-white rounded-lg text-white text-center"
        >
          Inspect
        </button>
      </div>
    );
  }
}

export default Card;
