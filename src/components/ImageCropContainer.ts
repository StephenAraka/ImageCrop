import { Component, ReactChild, createElement } from "react";
import ImageCrop from "./ImageCrop";

type Editable = "default" | "never";
type afterCropEvent = "doNothing" | "callMicroflow" | "callNanoflow" | "showPage";
type PageLocation = "content" | "popup" | "modal";
export interface WrapperProps {
    mxObject: mendix.lib.MxObject;
    mxform: mxui.lib.form._FormBase;
    style?: string;
    readOnly?: boolean;
}

interface Nanoflow {
    nanoflow: object[];
    paramsSpec: { Progress: string };
}

export interface ImageCropContainerProps extends WrapperProps {
    dataUrl: string;
    dataSourceMicroflow: string;
    height: number;
    width: number;
    editable: Editable;
    keepSelection: boolean;
    minWidth: number;
    minHeight: number;
    maxWidth: number;
    maxHeight: number;
    afterCropMicroflow: string;
    afterCropNanoflow: Nanoflow;
    onClickForm: string;
    afterCropOption: afterCropEvent;
    openPageAs: PageLocation;
    convertCanvasToImage(url: string): string;
}

export interface ImageCropContainerState {
    alertMessage?: string;
    imageUrl: string;
    croppedImageUrl: string;
    rotate: boolean;
    toggle: boolean;
}

export default class ImageCropContainer extends Component<ImageCropContainerProps, ImageCropContainerState> {

    private subscriptionHandles: number[] = [];
    private handleFormHandle = 0;
    state: ImageCropContainerState = {
        imageUrl: "",
        croppedImageUrl: "",
        rotate: false,
        toggle: false
    };

    render() {
        return createElement(ImageCrop, {
            ...this.props as ImageCropContainerProps,
            editable: this.isReadOnly(),
            imageUrl: this.state.imageUrl,
            saveImage: this.saveImage,
            alertMessage: this.state.alertMessage
        } as any);
    }

    componentDidMount() {
        this.fetchImage(this.props.mxObject);
        this.resetSubscriptions(this.props.mxObject);

    }

    componentWillUnmount() {
        this.subscriptionHandles.forEach(window.mx.data.unsubscribe);
        this.props.mxform.unlisten(this.handleFormHandle);
    }

    componentWillReceiveProps(newProps: ImageCropContainerProps) {
        this.fetchImage(newProps.mxObject);
        this.resetSubscriptions(newProps.mxObject);
        if (this.props.dataUrl) {
            this.setState({ imageUrl: this.getAttributeValue(this.props.dataUrl, newProps.mxObject) });
        }
    }

    private isReadOnly(): boolean {
        const { dataUrl, editable, mxObject, readOnly } = this.props;

        return !(editable === "default" && mxObject) || (readOnly || mxObject.isReadonlyAttr(dataUrl));
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

    private resetSubscriptions(mxObject?: mendix.lib.MxObject) {
        if (mxObject) {
            this.handleFormHandle = this.props.mxform.listen("commit", this.handleCommit);
        }
    }

    private handleCommit = () => {
        const { mxform, mxObject, dataUrl } = this.props;
        if (mxform && mxObject && mxObject.inheritsFrom("System.Image") && dataUrl) {
            mx.data.saveDocument(
                mxObject.getGuid(), `${Math.floor(Math.random() * 1000000)}.png`,
                {}, this.base64toBlob(this.state.croppedImageUrl),
                () => { mx.ui.info("Cropped image has been saved", false); },
                error => { mx.ui.error(error.message, false); }
            );
        } else {
            this.setState({ alertMessage: "The entity does not inherit from System.Image" });
        }

        this.handleAfterCropAction();
    }

    private saveImage = (croppedImageUrl: string) => {
        this.setState({ croppedImageUrl });
    }

    private handleAfterCropAction = () => {
        const { mxform, mxObject, afterCropOption, afterCropNanoflow } = this.props;
        const context = new mendix.lib.MxContext();
        context.setContext(this.props.mxObject.getEntity(), this.props.mxObject.getGuid());

        if (afterCropOption === "callMicroflow") {
            this.executeAction(afterCropOption, mxObject.getGuid());
        } else if (afterCropOption === "callNanoflow" && afterCropNanoflow.nanoflow) {
            window.mx.data.callNanoflow({
                nanoflow: afterCropNanoflow,
                origin: mxform,
                context,
                error: (error) => window.mx.ui.error(`An error occurred while executing the nanoflow ${afterCropNanoflow}: ${error.message}`)
            });
        }
    }

    private executeAction = (actionName: string, guid: string) => {
        if (actionName && guid) {
            window.mx.ui.action(actionName, {
                error: (error) =>
                    window.mx.ui.error(`An error occured while executing the microflow ${actionName}: ${error.message}`),
                params: {
                    applyto: "selection",
                    guids: [ guid ]
                }
            });
        }
    }

    public static validateProps(props: ImageCropContainerProps): ReactChild {
        const errorMessages: string[] = [];

        if (props.afterCropOption === "callMicroflow" && !props.afterCropMicroflow) {
            errorMessages.push("On click event is set to 'Call a microflow' but no microflow is selected");
        } else if (props.afterCropOption === "callNanoflow" && !props.afterCropNanoflow.nanoflow) {
            errorMessages.push("On click event is set to 'Call a nanoflow' but no nanoflow is selected");
        }
        if (errorMessages.length) {
            return createElement("div", {},
                "Error in crop configuration:",
                errorMessages.map((message, key) => createElement("p", { key }, message))
            );
        }

        return "";
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
