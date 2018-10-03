import { Component, createElement } from "react";
import ImageCrop, { editableType, imageSourceType } from "./ImageCrop";

interface WrapperProps {
  mxObject: mendix.lib.MxObject;
  mxform?: mxui.lib.form._FormBase;
  style?: string;
}

export interface ImageCropContainerProps extends WrapperProps {
  dataSource: DataSource;
  dataSourceMicroflow: string;
  imagesEntity: string;
  entityConstraint: string;
  urlAttribute: string;
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
    // private subscriptionHandle: number;
    constructor(props: ImageCropContainerProps) {
        super(props);

        const alertMessage = ImageCropContainer.validateProps(props);
        this.state = {
            alertMessage
        };
    }

    render() {
      return createElement(ImageCrop);
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
