import { Component, createElement } from "react";

export type imageSourceType = "localDatabase" | "onlineUrl";
export type editableType = "default" | "never";
interface ImageCropProps {
  imageSource: imageSourceType;
  editable: editableType;
  minWidth: number;
  minHeight: number;
  maxWidth: number;
  maxHeight: number;

}

class ImageCrop extends Component<ImageCropProps, {}> {
  render() {
      return createElement("div", {});
  }
}

export default ImageCrop;

// return createElement("div", { className: "react-image-wrapper" },
    //         createElement("img", { src: }));
