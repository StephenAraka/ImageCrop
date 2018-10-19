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
  dataUrl?: string;
  dataSourceMicroflow: string;
  editable: editableType;
  minWidth: number;
  minHeight: number;
  maxWidth: number;
  maxHeight: number;
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
    return createElement(ImageCrop, {
      ...this.props as ImageCropContainerProps,
      imageUrl: this.state.imageUrl,
      onClickAction: this.saveImage,
      alertMessage: this.state.alertMessage
     } as any);
  }

  componentDidMount() {
    this.fetchImage(this.props.mxObject);
  }

  componentWillReceiveProps(newProps: ImageCropContainerProps) {
    this.fetchImage(newProps.mxObject);
    if (this.props.dataUrl) {
    this.setState({ imageUrl: this.getAttributeValue(this.props.dataUrl, newProps.mxObject) });
    }
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

  private getAttributeValue(attributeName: string, mxObject?: mendix.lib.MxObject): string {
    return mxObject ? mxObject.get(attributeName) as string : "";
}

  private saveImage = (url: string) => {
    const { mxObject, dataUrl } = this.props;
    if (mxObject && mxObject.inheritsFrom("System.Image") && dataUrl) {
      mx.data.saveDocument(
        mxObject.getGuid(),
        `${Math.floor(Math.random() * 1000000)}.png`,
        { },
        this.base64toBlob(url),
        () => { mx.ui.info("Cropped image has been saved", false); },
        error => { mx.ui.error(error.message, false); }
      );
    } else {
      this.setState({ alertMessage: "The entity does not inherit from System.Image" });
    }
  }

  private base64toBlob = (base64Uri: string): Blob => {
    const byteString = atob(base64Uri.split(";base64,")[1]);
    const bufferArray = new ArrayBuffer(byteString.length);
    const uintArray = new Uint8Array(bufferArray);

    for (let i = 0; i < byteString.length; i++) {
        uintArray[i] = byteString.charCodeAt(i);
    }

    return new Blob([ bufferArray ], { type: base64Uri.split(":")[0] });
}
}
