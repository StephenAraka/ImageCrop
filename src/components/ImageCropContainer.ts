import { Component, createElement } from "react";
import ImageCrop, { editableType, imageSourceType } from "./ImageCrop";

interface WrapperProps {
  mxObject: mendix.lib.MxObject;
}

export interface ImageCropContainerProps extends WrapperProps {
  imageSource: imageSourceType;
  editable: editableType;
  minWidth: number;
  minHeight: number;
  maxWidth: number;
  maxHeight: number;
  onClickMicroflow: string;
  onClickForm: string;
  onClickOption: onClickOptions;
}

interface ImageCropContainerState {
    alertMessage?: string;
}

type onClickOptions = "doNothing" | "callMicroflow" | "showPage" | "openFullScreen";

export default class ImageCropContainer extends Component<ImageCropContainerProps, ImageCropContainerState> {
  render() {
      return createElement(ImageCrop);
  }
}
