import { Component, createElement } from "react";
import * as ReactCrop from "react-image-crop";
import "react-image-crop/lib/ReactCrop.scss";

export type editableType = "default" | "never";
export interface ImageCropProps {
  imageUrl: string;
  dataUrl: Blob;

  // editable: editableType;
  // minWidth: number;
  // minHeight: number;
  // maxWidth: number;
  // maxHeight: number;

}

const crop = {
  x: 20,
  y: 10,
  width: 30,
  height: 10
};

class ImageCrop extends Component<ImageCropProps, {}> {
  render() {
      return createElement("div", { className: "react-image-wrapper" },
        // tslint:disable-next-line:no-console
        createElement(ReactCrop, { src: this.props.imageUrl, onChange: () => console.log("changed") })
        );
  }

  // private getImageUrl() {
  //   return URL.createObjectURL(this.props.base64toBlob);
  // }
}

export default ImageCrop;
