import { Component, createElement } from "react";
import ImageCrop, { editableType, imageSourceType } from "./ImageCrop";

interface WrapperProps {
  mxObject: mendix.lib.MxObject;
  mxform?: mxui.lib.form._FormBase;
  style?: string;
}

export interface ImageCropContainerProps extends WrapperProps {
  dataSource: DataSource;
  imageSource: imageSourceType;
  editable: editableType;
  minWidth: number;
  minHeight: number;
  maxWidth: number;
  maxHeight: number;
  onClickMicroflow: string;
  onClickForm: string;
  onClickOption: onClickOptions;
  openPageAs: PageLocation;
  url: string;
  staticImages: object;
}

interface ImageCropContainerState {
    alertMessage?: string;
}

type onClickOptions = "doNothing" | "callMicroflow" | "showPage" | "openFullScreen";
type PageLocation = "content" | "popup" | "modal";
type DataSource = "static" | "XPath" | "microflow";

export default class ImageCropContainer extends Component<ImageCropContainerProps, ImageCropContainerState> {
  render() {
      return createElement(ImageCrop);
  }
}
