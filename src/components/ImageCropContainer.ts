import { Component, createElement } from "react";
import ImageCrop from "./ImageCrop";

type editableType = "default" | "never";
type onClickOptions = "doNothing" | "callMicroflow" | "showPage" | "openFullScreen";
type PageLocation = "content" | "popup" | "modal";
export interface WrapperProps {
  mxObject: mendix.lib.MxObject;
  mxform?: mxui.lib.form._FormBase;
  style?: string;
}

export interface ImageCropContainerProps extends WrapperProps {
  dataSourceMicroflow: string;
  editable: editableType;
  minWidth: number;
  minHeight: number;
  maxWidth: number;
  maxHeight: number;
  imageUrl: string;
  onClickMicroflow: string;
  onClickForm: string;
  onClickOption: onClickOptions;
  openPageAs: PageLocation;
}

export interface ImageCropContainerState {
  alertMessage?: string;
  imageUrl: string;
}
export default class ImageCropContainer extends Component<ImageCropContainerProps, ImageCropContainerState> {
  state: ImageCropContainerState = {
    imageUrl: ""
  };

  render() {
    return createElement(ImageCrop, { imageUrl: this.state.imageUrl });
  }

  componentDidMount() {
    this.fetchImage(this.props.mxObject);

  }

  componentWillReceiveProps(newProps: ImageCropContainerProps) {
    this.fetchImage(newProps.mxObject);
  }

  private fetchImage(mxObject: mendix.lib.MxObject) {
    if (mxObject) {
      const url = mx.data.getDocumentUrl(mxObject.getGuid(), mxObject.get("changedDate") as number, false);
      mx.data.getImageUrl(url,
        objectUrl => {
          this.setState({ imageUrl: objectUrl });
        });
    }
  }
}
