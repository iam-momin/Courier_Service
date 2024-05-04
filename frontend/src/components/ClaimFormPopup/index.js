import axios from 'axios';
import React, { Component } from 'react';
import { Form, FormControl } from 'react-bootstrap';
import { IoMdCloseCircle } from 'react-icons/io';
import Resizer from "react-image-file-resizer";
import SignatureCanvas from 'react-signature-canvas';
import { API_HOST, CLAIM_STATUS, HEADERS } from '../../../src/constants';
import Button from '../Button';
import Input from '../Input';
import SuccessPopup from '../SuccessPopup';
import styles from './styles.module.css';
import ImageViewer from 'react-simple-image-viewer';
import pdfToBase64 from 'pdf-to-base64';
import Textarea from '../Textarea';

class ClaimFormPopup extends Component {
    constructor(props) {
        super(props)
        this.state = {
            orderId: '',
            insuranceTotalValue: 0,
            claimDescription: '',
            parcelImages: [],
            declaration: false,
            showSuccessPopup: false,
            isSuccess: false,
            parcelPdf: []
        }
    }
    componentDidMount() {
        this.handleSetState()
        this.props.editDisabled && this.signPad.off()
    }
    handleSetState = () => {
        const { formData } = this.props
        if (formData) {
            this.setState({
                claimDescription: formData && formData.claimDescription,
                parcelImages: formData && formData.parcelImages,
                parcelPdf: formData && formData.parcelPdf,
            })
            if (this.signPad) this.signPad.fromData(formData.signatureDataArray)
        }
    }

    handleParcelImages = (e) => {
        const { parcelImages } = this.state
        let files = e.target.files
        if (files && (files.length + parcelImages.length) > 3) {
            alert(`Cannot upload more than 3 images!`)
            return false
        }
        for (let i = 0; i < (files && files.length); i++) {
            if (files[i])
                try {
                    Resizer.imageFileResizer(
                        e.target.files[i],
                        600,
                        600,
                        "JPEG",
                        30,
                        0,
                        (uri) => {
                            this.setState({ parcelImages: [...this.state.parcelImages, { file: files[i], data: uri }] })
                        },
                        "base64",
                        400,
                        400
                    );
                } catch (err) {
                    console.log(err);
                }
        }
    }
    handleValidation = () => {
        const { declaration } = this.state
        const signatureDataArray = this.signPad && this.signPad.toDataURL('image/png');

        const validationList = [
            { id: 'claimDescription', isRequired: true, min: 3 },
            { id: 'signaturePad', isRequired: true, stateName: signatureDataArray },
            { id: 'declaration', isRequired: true, declaration: !declaration }

        ]
        let isEmpty = false
        validationList.map(item => {
            var re = /\S+@\S+\.\S+/;
            if ((item.stateName && item.stateName.length === 0) || (document.getElementById(item.id) && document.getElementById(item.id).value === '') ||
                (item.isEmail && !re.test(document.getElementById(item.id).value)) || item.declaration) {
                if (item.isRequired) {
                    if (item.id, document.getElementById(item.id)) {
                        document.getElementById(item.id).setAttribute('style', 'box-shadow: 0 0 2px 1px red')
                    } else if (document.getElementsByClassName(item.id).length > 0) {
                        document.getElementsByClassName(item.id)[0].setAttribute('style', 'box-shadow: 0 0 2px 1px red')
                    }
                    isEmpty = true
                }
            } else {
                if (document.getElementById(item.id)) {
                    document.getElementById(item.id).setAttribute('style', 'box-shadow: 0 0 2px 0px #212224')
                } else if (document.getElementsByClassName(item.id).length > 0) {
                    document.getElementsByClassName(item.id)[0].setAttribute('style', 'box-shadow: none')
                }
            }
        })
        return isEmpty

    }
    handleSubmit = () => {
        let { claimDescription, parcelImages, parcelPdf } = this.state
        const { orderId, handleSubmit, formData } = this.props
        let signatureDataArray = []

        if (this.handleValidation()) {
            this.setState({ submitRes: { status: 400, data: { message: "Required fields can't be empty." } } })
            return
        }

        signatureDataArray = this.signPad && this.signPad.toData()
        const claimDetails = { claimDescription, parcelImages, signatureDataArray, parcelPdf }
        let params = {
            claimDetails, claimStatus: CLAIM_STATUS && CLAIM_STATUS[0]
        }
        // delete params['_id']
        axios.put(`${API_HOST}/api/orderDetails/claim/${orderId}`, params, HEADERS)
            .then((res) => {
                if (res) {
                    this.setState({ submitRes: res, showSuccessPopup: true, isSuccess: true })
                }
                if (res.status == 200) {
                    handleSubmit()
                }
            }).catch((error) => {
                this.setState({ submitRes: error.response, showSuccessPopup: true, isSuccess: false })
            })
    }
    handleImageViewer = (i) => {
        this.setState({ showImageViewer: true, currentImage: i })
    }
    handlePDFUpload = (event) => {
        let selectedFile = event.target.files;
        if (selectedFile[0].size > 50000) {
            alert('File size must be less than 500KB')
            return false
        }
        let file = null;
        let fileName = "";
        if (selectedFile.length > 0) {
            let fileToLoad = selectedFile[0];
            fileName = fileToLoad.name;
            let fileReader = new FileReader();
            fileReader.onload = (fileLoadedEvent) => {
                file = fileLoadedEvent.target.result;
                this.setState({
                    parcelPdf: {
                        fileData: file,
                        fileName: fileName
                    }
                })
            };
            fileReader.readAsDataURL(fileToLoad);
        }
    }
    render() {
        const { parcelImages, claimDescription, showSuccessPopup, isSuccess, showImageViewer, currentImage, parcelPdf } = this.state
        const { handleCancel, orderId, insuranceTotalValue, editDisabled, formData } = this.props
        return (
            <div className={styles.popupContainer}>
                <div className={styles.popupWrapper}>
                    <div className={styles.header}>Insurance Claim</div>
                    <div className={styles.popupBody}>
                        <div className={styles.idAndAmount}>
                            <Input
                                disable
                                id={'orderId'}
                                label={"Order Id"}
                                value={orderId} />

                            <Input
                                disable
                                id={'insuranceTotalValue'}
                                label={"Total Amount"}
                                value={insuranceTotalValue} />
                        </div>
                        <div className={styles.companyDetails}>
                            <label>{"Description"}<sup style={{ color: '#eb4d4b', fontSize: '10px' }}>*</sup></label>
                            <Textarea
                                disabled={editDisabled}
                                id={'claimDescription'}
                                value={claimDescription}
                                onChange={(e) => this.setState({ claimDescription: e.target.value })}
                                rows={3}
                                cols={2}
                            />
                        </div>

                        {!editDisabled && <div className={styles.uplaodParcelImg}>
                            <Form.Group controlId="formFileSm" className="mb-3 fileUpload img">
                                <Form.Label>Upload Parcel Images (max 3)</Form.Label>
                                <input type="file" accept="image/apng, image/avif, image/jpeg, image/png, image/svg+xml, image/webp" multiple onChange={(e) => this.handleParcelImages(e)} />
                            </Form.Group>
                            <Form.Group controlId="formFileSm" className="mb-3 fileUpload pdf">
                                <Form.Label>Upload Parcel PDF (&lt;500KB)</Form.Label>
                                <input type="file" accept="application/msword, application/vnd.ms-excel, application/vnd.ms-powerpoint,text/plain, application/pdf" onChange={this.handlePDFUpload} onClick={e => e.target.value = null} />
                            </Form.Group>
                        </div>}
                        <div className={styles.parcelImg}>
                            <div>
                                {parcelImages && parcelImages.length > 0 ? parcelImages.map((item, i) => {
                                    return <div key={i}>
                                        {!editDisabled && <IoMdCloseCircle
                                            style={{ color: 'red', fontSize: 24, verticalAlign: 'top' }}
                                            disable
                                            onClick={() => {
                                                let list = [...parcelImages]
                                                list.splice(i, 1);
                                                this.setState({ parcelImages: list })
                                            }} />}
                                        <img src={item.data} alt={i} style={{ width: '80px', height: '80px' }} onClick={() => this.handleImageViewer(i)} />
                                    </div>
                                })
                                    : <div>No Images</div>}
                            </div>
                            {parcelPdf && parcelPdf.fileData ? <div>
                                {!editDisabled && <IoMdCloseCircle
                                    style={{ color: 'red', fontSize: 24, verticalAlign: 'top' }}
                                    disable
                                    onClick={() => { this.setState({ parcelPdf: {} }) }} />}
                                <a href={parcelPdf.fileData} download={parcelPdf.fileName}>Download {parcelPdf.fileName}</a>
                            </div> : <div></div>}
                        </div>

                        <div className={styles.signatureContainer}>
                            <span className={styles.signatureWrapper} id={'signaturePad'}>
                                <label>{"Signature Pad "}<sup style={{ color: '#eb4d4b', fontSize: '10px' }}>*</sup></label>
                                <SignatureCanvas canvasProps={{ width: 360, height: 180, className: 'sigCanvas' }} ref={(e) => this.signPad = e} />
                                {!editDisabled && <Button text={'Clear'} classes={'secondary sm'} onClick={() => { this.signPad && this.signPad.clear() }} />}
                            </span>
                        </div>
                    </div>

                    <div className={styles.popupBtnWrapper}>
                        {!editDisabled && <div className={styles.declaration}>
                            {formData && formData.isAdmin ? "" :
                                <><input type="checkbox" id="declaration" name="declaration" style={{ margin: '4px' }} onChange={(e) => { this.setState({ declaration: e.target.checked }) }} ></input>
                                    <label htmlFor="declaration"> I have read the <a target="_blank" href="https://www.estolink.com/insurance/terms">Terms of Insurance</a> for claim.<sup style={{ color: '#eb4d4b', fontSize: '10px' }}>*</sup></label></>}
                        </div>}

                        <Button text={'Close'} classes={'secondary'} onClick={handleCancel} />
                        {!editDisabled && <Button text={'Submit'} classes={'primary'} onClick={() => { this.handleSubmit() }} />}
                    </div>
                </div>
                {showSuccessPopup &&
                    <SuccessPopup
                        isSuccess={isSuccess}
                        successText={'Claim successful'}
                        errorText={'Failed please try again'}
                        onClick={() => this.setState({ showSuccessPopup: false, isSuccess: false })}
                    />
                }
                {showImageViewer &&
                    <ImageViewer
                        src={parcelImages && parcelImages.map(item => item.data)}
                        currentIndex={currentImage}
                        disableScroll={false}
                        closeOnClickOutside={true}
                        onClose={() => this.setState({ showImageViewer: false, currentImage: 0 })}
                    />}
            </div>
        );
    }
}

export default ClaimFormPopup;