import { Component, createElement } from "react";
import ImageCrop from "./ImageCrop";

type editableType = "default" | "never";
type onClickOptions = "doNothing" | "callMicroflow" | "showPage" | "openFullScreen";
type PageLocation = "content" | "popup" | "modal";
type ImageDataSource = "static" | "XPath" | "microflow";
interface WrapperProps {
  mxObject: mendix.lib.MxObject;
  mxform?: mxui.lib.form._FormBase;
  style?: string;
}

export interface ImageCropContainerProps extends WrapperProps {
  dataSource: ImageDataSource;
  editable: editableType;
  minWidth: number;
  minHeight: number;
  maxWidth: number;
  maxHeight: number;
  imageUrl?: string;
  onClickMicroflow: string;
  onClickForm: string;
  onClickOption: onClickOptions;
  openPageAs: PageLocation;
  url: string;
  staticImages: object;
}

interface ImageCropContainerState {
  imageUrl?: string;
}
export default class ImageCropContainer extends Component<ImageCropContainerProps, ImageCropContainerState> {
  state: ImageCropContainerState = {
    imageUrl: ""
  };

  render() {
    return createElement(ImageCrop, {
      imageUrl: this.state.imageUrl
    });
  }

  componentWillReceiveProps(newProps: ImageCropContainerProps) {
    this.fetchImage(newProps);
  }

  private fetchImage(newProps: ImageCropContainerProps) {
    let image = "";
    const { mxObject } = newProps;
    if (this.props.dataSource === "static" && mxObject) {
      image = mx.data.getDocumentUrl(mxObject.getGuid(), mxObject.get("changedDate") as number, true);
    }
    const imageUrl = image;
    if (imageUrl)
      this.setState({ imageUrl });
  }

  //     componentWillUnmount() {
  //     if (this.subscriptionHandle) window.mx.data.unsubscribe(this.subscriptionHandle);
  // }

  public static validateProps(props: ImageCropContainerProps): string {
    let message = "";
    if (props.dataSource === "static" && !props.staticImages) {
      message = "For the data source option 'Static', at least one static image should be added";
    }
    if (props.dataSource === "XPath" && !props.dataSource) {
      message = "For the data source 'XPath', the images entity is required";
    }
    if (props.dataSource === "microflow" && !props.onClickMicroflow) {
      message = "For data source option 'microflow', a data source microflow is required";
    }

    return message;
  }
}
