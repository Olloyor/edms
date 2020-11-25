import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {
    Button,
    Col,
    CustomInput,
    Form,
    FormFeedback,
    FormText,
    Input,
    Label,
    Modal,
    ModalBody,
    Row
} from "reactstrap/es";
import {uploadFile} from "../api";
import {corr} from "../utils/common";
import {config} from "../utils/config";
import {toast} from "react-toastify";


class ModalAddEditDoc extends Component {
    constructor(props) {
        super(props);
        this.state = {
            docForm: this.props.editValues ?
                {
                    id: this.props.editValues?.id,
                    fileId: this.props.editValues.file?.id,
                    regId: this.props.editValues.regId,
                    outgoingDoc: this.props.editValues.outgoingDoc,
                    createdAt: this.props.editValues.createdAt,
                    outgoingDate: this.props.editValues.outgoingDate,
                    deadline: this.props.editValues.deadline,
                    theme: this.props.editValues.theme,
                    description: this.props.editValues.description,
                    isAccess: this.props.editValues.isAccess,
                    isControl: this.props.editValues.isControl,
                    orderType: this.props.editValues.orderType.key,
                    correspondent: this.props.editValues.correspondent.key,
                } :
                {
                    fileId: null,
                    regId: "",
                    outgoingDoc: "",
                    createdAt: new Date().toLocaleDateString(),
                    outgoingDate: "",
                    deadline: "",
                    theme: "",
                    description: "",
                    isAccess: false,
                    isControl: false,
                    orderType: "NO",
                    correspondent: "NO",
                },
            docErrors: {},
            isSubmitting: false,
        }
    }

    componentDidMount() {
        // console.log("Modal Mounted")
    }

    // setFile = (newFile) => {
    //     newFile && this.setState({file: newFile})
    // }

    handleFileChange = async event => {
        // console.log(event.target.files[0].type)
        const newFile = event.target.files[0];
        if (newFile && newFile.size > config.MAX_FILE_SIZE && !this.isSupportedContentType(newFile.type)) {
            this.setState({
                docErrors: {
                    ...this.state.docErrors,
                    fileId: "File size must be less than 1MB and File type must be *.pdf , *.doc, *.docx"
                }
            })
            // toast.warn("File size must be less than 1MB\nFile type must be *.pdf , *.doc, *.docx")
            return;
        } else if (newFile.size > config.MAX_FILE_SIZE) {
            this.setState({docErrors: {...this.state.docErrors, fileId: "File size must be less than 1MB"}})
            // toast.warn("File size must be less than 1MB")
            return;
        } else if (!this.isSupportedContentType(newFile.type)) {
            this.setState({docErrors: {...this.state.docErrors, fileId: "File type must be *.pdf , *.doc, *.docx"}})
            // toast.warn("File type must be *.pdf , *.doc, *.docx")
            return;
        }
        // await this.setFile(newFile);
        // Create an object of formData
        const formData = new FormData();

        // Update the formData object
        formData.append(
            "file",
            newFile,
            newFile.name
        );

        uploadFile(formData).then(res => {
            // console.log(res);
            if (res.status === 200) {
                this.setState({
                    docForm:{...this.state.docForm, fileId: res.data.result[0]},
                    docErrors: {...this.state.docErrors, fileId: ""}});
            }
        }).catch(err => {
            // console.log(err);
            if (err.message === "Network Error") {
                toast.warn("Check your network")
            } else {
                toast.error("Something went wrong")
            }
        })
        // handleFile(newFile ? newFile : this.state.file)
    };

    isSupportedContentType(contentType) {
        return contentType === "application/pdf"
            || contentType === "application/msword"
            || contentType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    }

    clearForm = () => {
        this.setState({
            docForm: {
                fileId: null,
                regId: "",
                outgoingDoc: "",
                outgoingDate: "",
                deadline: "",
                theme: "",
                description: "",
                isAccess: false,
                isControl: false,
                orderType: "NO",
                correspondent: "NO",
            },
            docErrors: {},
        })
    }
    clearErrors=()=>{
        this.setState({docErrors:{}})
    }

    isValid=(value)=>{
        const reg = /^(([0-9]{3}[a-zA-Z0-9\s]{0,}))$/;
        return reg.test(value);
    }

    validateForm = (doc) => {
        let errors = this.state.docErrors;

        if (doc.fileId === null || doc.fileId.trim() === ''){
            errors.fileId = "Document is Required";
        }else {
            errors.fileId = "";
        }

        if (doc.regId.trim() === '') {
            errors.regId = "Register ID is required";
        } else if (!this.isValid(doc.regId)) {
            errors.regId = "Register ID is invalid";
        }else {
            errors.regId = ""
        }

        if (doc.outgoingDoc === '') {
            errors.outgoingDoc = "Outgoing Doc is required";
        } else if (!this.isValid(doc.outgoingDoc)) {
            errors.outgoingDoc = "Outgoing should start with min 3 number";
        }else {
            errors.outgoingDoc = "";
        }

        if (doc.outgoingDate === '') {
            errors.outgoingDate = "Outgoing Date is required";
        } else if (!new Date(doc.outgoingDate).getTime()) {
            errors.outgoingDate = "Date is invalid";
        }else {
            errors.outgoingDate = "";
        }

        if (doc.deadline === '') {
            errors.deadline = "Deadline is required";
        } else if ((new Date(doc.createdAt).getTime() > new Date(doc.deadline).getTime())) {
            errors.deadline = "Deadline must be bigger";
        }else {
            errors.deadline = "";
        }

        if (doc.theme === '') {
            errors.theme = "Theme required"
        } else if (doc.theme.length < 3) {
            errors.theme = "Minimum length is 2"
        } else if (doc.theme.length > 100) {
            errors.theme = "Maximum length is 100"
        }else {
            errors.theme ="";
        }

        if (doc.description === '') {
            errors.description = "Description is required"
        } else if (doc.description.length < 3) {
            errors.description = "Minimum length is 2"
        } else if (doc.description.length > 1000) {
            errors.description = "Maximum length is 1000"
        }else {
            errors.description = "";
        }

        if (doc.orderType === "NO" || doc.orderType === "") {
            errors.orderType = "Please select order type!";
        }else {
            errors.orderType ="";
        }

        if (doc.correspondent === "NO" || doc.correspondent === "") {
            errors.correspondent = "Please select correspondent!";
        }else {
            errors.correspondent = "";
        }
        this.setState({docErrors: errors})
        return (errors.fileId === "" &&
            errors.regId === "" &&
            errors.outgoingDoc === "" &&
            errors.outgoingDate === "" &&
            errors.deadline === "" &&
            errors.theme === "" &&
            errors.description === "" &&
            errors.orderType === "" &&
            errors.correspondent === "");
    };


    handleChange = (event) => {
        const {name, value, type, checked} = event.target;
        type === "checkbox" ? this.setState({
            docForm: {
                ...this.state.docForm,
                [name]: checked
            }
        }) : this.setState({docForm: {...this.state.docForm, [name]: value}})

    }

    submit = (e) => {
        e.preventDefault();

        if (this.validateForm(this.state.docForm)) {

            this.props.onSubmit(this.state.docForm)
            this.clearErrors()
        }else {
            toast.info("Fill Required fields correctly!")
        }
    }

    render() {
        const docForm = this.state.docForm
        const docErrors = this.state.docErrors

        const orderType = [
            {"key": "EMAIL", "value": "Email"},
            {"key": "TELEGRAMMA", "value": "Telegramma"},
            {"key": "COURIER", "value": "Courier"}
        ]

        return (
            <Modal isOpen={this.props.isOpen} backdrop={true} toggle={()=>{ this.props.toggle(); this.clearErrors()}} modalClassName="right"
                   className="my-modal"
                   role="layout">
                <ModalBody className="p-2 px-5 p-md-3 mx-2">
                    <Form onSubmit={this.submit}>
                        <Row>
                            <Col>
                                <h2 className="text-muted text-center">{this.props.editValues ? "Edit" : "Add"} Document</h2>
                            </Col>
                        </Row>
                        <Row className="my-2">
                            <Col className="my-1 col-12">
                                <Label for="createdAt">Registration Date</Label>
                                <Input type="text" name="createdAt" id="createdAt" placeholder={new Date().toLocaleString()}
                                       value={docForm.createdAt} disabled/>
                            </Col>
                            <Col className="my-1 col-12">
                                <Label for="file">Upload File <span className="text-danger">*</span></Label>
                                <CustomInput type="file" id="file" name="file" label={this.props.editValues?.file.name}
                                             valid={docForm.fileId !=="" && docForm.fileId !==null} invalid={docErrors.fileId} accept=".doc, .docx, .pdf" onChange={this.handleFileChange}/>
                                <div className="invalid-feedback" style={{display: docErrors.fileId===""?"none":"block"}}>{docErrors.fileId}</div>
                                <div className="valid-feedback" style={{display: docForm.fileId?"block":"none"}}>File Uploaded</div>
                                <FormText className="text-muted">Required: .doc, .docx, .pdf and must be less than 1MB</FormText>
                            </Col>
                            <Col className="my-1 col-12">
                                <Label for="regId">№ Register <span className="text-danger">*</span></Label>
                                <Input type="text" name="regId" id="regId" placeholder="Register ID"
                                       value={docForm.regId} onChange={this.handleChange}
                                       invalid={docErrors.regId} required/>
                                <FormFeedback>{docErrors.regId}</FormFeedback>
                                <FormText className="text-muted">Required: Should start with min 3 number</FormText>
                            </Col>
                            <Col className="my-1 col-12">
                                <Label for="theme">Theme <span className="text-danger">*</span></Label>
                                <Input type="text" name="theme" id="theme" placeholder="Theme"
                                       value={docForm.theme} onChange={this.handleChange}
                                       invalid={docErrors.theme} required/>
                                <FormFeedback>{docErrors.theme}</FormFeedback>
                            </Col>
                            <Col className="my-1 col-12">
                                <Label for="description">Description <span className="text-danger">*</span></Label>
                                <Input type="textarea" name="description" id="description"
                                       placeholder="Description"
                                       value={docForm.description} onChange={this.handleChange}
                                       invalid={docErrors.description} required/>
                                <FormFeedback>{docErrors.description}</FormFeedback>
                            </Col>
                            <Col className="my-1 col-12">
                                <Label for="outgoingDoc">№ Outgoing Document <span className="text-danger">*</span></Label>
                                <Input type="text" name="outgoingDoc" id="outgoingDoc"
                                       placeholder="№ Outgoing"
                                       value={docForm.outgoingDoc} onChange={this.handleChange}
                                       invalid={docErrors.outgoingDoc} required/>
                                <FormFeedback>{docErrors.outgoingDoc}</FormFeedback>
                                <FormText className="text-muted">Required: Should start with min 3 number</FormText>
                            </Col>
                            <Col className="my-1 col-12 col-sm-6">
                                <Label for="outgoingDate">Outgoing Date <span className="text-danger">*</span></Label>
                                <Input type="date" name="outgoingDate" id="outgoingDate"
                                       placeholder="Outgoing Date"
                                       value={docForm.outgoingDate} onChange={this.handleChange}
                                       invalid={docErrors.outgoingDate} required/>
                                <FormFeedback>{docErrors.outgoingDate}</FormFeedback>
                            </Col>
                            <Col className="my-1 col-12 col-sm-6">
                                <Label for="deadline">Deadline <span className="text-danger">*</span></Label>
                                <Input type="date" name="deadline" id="deadline"
                                       placeholder="Deadline Date"
                                       value={docForm.deadline} onChange={this.handleChange}
                                       invalid={docErrors.deadline} required/>
                                <FormFeedback>{docErrors.deadline}</FormFeedback>
                            </Col>
                            <Col className="my-1 col-12">
                                <Label for="orderType">OrderType <span className="text-danger">*</span></Label>
                                <Input type="select" name="orderType" id="orderType"
                                       value={docForm.orderType} onChange={this.handleChange}
                                       invalid={docErrors.orderType} required>
                                    <option disabled value="NO">Select Order Type</option>
                                    {orderType.map((item, i) => {
                                        return (
                                            <option key={i} value={item.key}>{item.value}</option>
                                        )
                                    })}
                                </Input>
                                <FormFeedback>{docErrors.orderType}</FormFeedback>
                            </Col>
                            <Col className="my-1 col-12">
                                <Label for="correspondent">Correspondent <span className="text-danger">*</span></Label>
                                <Input type="select" name="correspondent" id="correspondent"
                                       value={docForm.correspondent} onChange={this.handleChange}
                                       invalid={docErrors.correspondent} required>
                                    <option disabled value="NO">Select Correspondent Type</option>
                                    {corr.map((item, i) => {
                                        return (
                                            <option key={i} value={item.key}>{item.value}</option>
                                        )
                                    })}
                                </Input>
                                <FormFeedback>{docErrors.correspondent}</FormFeedback>
                            </Col>
                            <Col className="my-1 mt-2 col-6">
                                <CustomInput type="switch" id="isAccess" name="isAccess" label="Has Access"
                                             value={docForm.isAccess} checked={docForm.isAccess}
                                             onChange={this.handleChange}
                                />
                            </Col>
                            <Col className="my-1 mt-2 col-6">
                                <CustomInput type="switch" id="isControl" name="isControl"
                                             label="Has Control"
                                             value={docForm.isControl} checked={docForm.isControl}
                                             onChange={this.handleChange}
                                />
                            </Col>

                        </Row>
                        <Row className="my-2 mt-5">
                            <Col className="col-sm-6 my-1">
                                <Button type="submit" className="float-right btn-block" color="primary"
                                        onClick={this.submit}>Save</Button>
                            </Col>
                            <Col className="col-sm-6 my-1">
                                <Button className="btn-block" color="secondary"
                                        onClick={() => {
                                            this.props.toggle()
                                            this.clearForm()
                                        }}>Cancel</Button>
                            </Col>
                        </Row>
                    </Form>
                </ModalBody>
            </Modal>
        );
    }
}


ModalAddEditDoc.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onSubmit: PropTypes.func.isRequired,
    toggle: PropTypes.func.isRequired,
    editValues: PropTypes.object,
};

export default ModalAddEditDoc;
