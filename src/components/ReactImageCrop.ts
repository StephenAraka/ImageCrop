import { Component, createElement } from "react";

export type imageSourceType = "localDatabase" | "onlineUrl";
export type editableType = "default" | "never";
interface ReactImageCropProps {
  imageSource: imageSourceType;
  editable: editableType;
  minWidth: number;
  minHeight: number;
  maxWidth: number;
  maxHeight: number;

}

class ReactImageCrop extends Component<ReactImageCropProps, {}> {
  render() {
      return createElement("div", {});
  }
}

export default ReactImageCrop;

// return createElement("div", { className: "react-image-wrapper" },
    //         createElement("img", { src: }));
