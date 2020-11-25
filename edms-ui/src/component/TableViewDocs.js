import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {config} from "../utils/config";
import {Badge, Button, Col, Modal, Row, Spinner, Table, Tooltip} from "reactstrap/es";
import DocView from "./DocView.jsx";
import IconPrint from "./icon/IconPrint";
import IconDelete from "./icon/IconDelete";
import IconEdit from "./icon/IconEdit";
import PdfViewer from "./PdfViewer";
import IconDownload from "./icon/IconDownload";
import IconView from "./icon/IconView";
import IconBack from "./icon/IconBack";

class TableViewDocs extends Component {
    constructor(props) {
        super(props);
        this.state = {
            printDoc: {},
            isOpenPdfModal: false,
            doc: null,

        }
    }

    printDoc = (currDoc) => {
        this.setState({printDoc: currDoc})
        setTimeout(() => {
            window.print();

        }, 600);
    }

    openPdfModal = (docPdf) => {
        this.setState({doc: docPdf, isOpenPdfModal: true})
    }
    togglePdfModal = () => {
        this.setState({doc: null, isOpenPdfModal: !this.state.isOpenPdfModal})
    }


    render() {
        return (
            <React.Fragment>
                {this.props.isLoading ?
                    <div className="d-flex justify-content-center">
                        <Spinner size={"lg"}/>
                    </div> :

                    <Table responsive bordered striped size={"sm"}>
                        {header()}
                        <tbody>
                        {this.props.docs && this.props.docs.map((doc, index) => {
                            return (
                                <tr key={index}>
                                    <th scope="row">{doc.regId}</th>
                                    <td>{doc.outgoingDoc}</td>
                                    <td>{doc.theme}</td>
                                    <td>{doc.description}</td>
                                    <td>{doc.orderType.value}</td>
                                    <td>{doc.correspondent.value}</td>
                                    <td>{doc.createdAt}</td>
                                    <td>{doc.outgoingDate}</td>
                                    <td>{doc.deadline}</td>
                                    <td>
                                        <span className="py-1 px-2">{doc.isAccess ? "YES" : "NO"}</span>
                                    </td>
                                    <td>
                                        <span className="py-1 px-2">{doc.isControl ? "YES" : "NO"}</span>
                                    </td>
                                    <td>
                                        {/*{doc.file?.name}*/}
                                        <div className="d-flex align-items-center">
                                            <Button className="mx-2" role="href" size="sm"
                                                    href={config.FILE_URL + doc.file?.id}><IconDownload/></Button>
                                            <Button color="primary" size="sm"
                                                    onClick={() => this.openPdfModal(doc.file)}><IconView/></Button>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="d-flex align-items-center">
                                            <Button onClick={() => this.props.editFunc(doc)} size="sm" color="primary"
                                                    className="mr-1"><IconEdit/></Button>
                                            <Button onClick={() => this.props.deleteFunc(doc.id)} size="sm"
                                                    className="mr-1" color="danger"><IconDelete/></Button>
                                            <Button onClick={() => this.printDoc(doc)} size="sm"><IconPrint/></Button>
                                        </div>
                                    </td>

                                </tr>
                            )
                        })}
                        </tbody>
                        {header()}
                    </Table>}
                {<DocView doc={this.state.printDoc}/>}
                {(!this.props.docs || this.props.docs.length === 0) && !this.props.isLoading &&
                <h2 className="text-center text-muted text-uppercase">No Documents</h2>}
                {this.state.doc &&
                <PdfModal isOpen={this.state.isOpenPdfModal} toggle={this.togglePdfModal} doc={this.state.doc}/>}
            </React.Fragment>
        );
    }
}

function header() {
    return (
        <thead>
        <tr className="text-center">
            <th scope="col">№ Register</th>
            <th>№ Outgoing</th>
            <th>Theme</th>
            <th>Description</th>
            <th>Order Type</th>
            <th>Correspondent</th>
            <th>Registered Date</th>
            <th scope="col">Outgoing Date</th>
            <th>Deadline</th>
            <th>Has Access</th>
            <th>Has Control</th>
            <th>Document</th>
            <th>Actions</th>
        </tr>
        </thead>
    )
}

export function PdfModal(props) {
    console.log(props)
    return (
        <Modal isOpen={props.isOpen} toggle={props.toggle} role="layout" className="pdf-modal">
            <Row className="p-2">
                <Col md={4}>
                    <Button color="danger" onClick={props.toggle}><IconBack/> Back</Button>
                    <Button className="mx-2" role="href" href={config.FILE_URL + props.doc.id}><IconDownload/></Button>
                </Col>
                <Col md={8}>
                    <h4>{props.doc?.name}</h4>
                </Col>
            </Row>
            <iframe className={props.doc?.contentType} width="100%" height="100%" frameBorder="0"
                    src={`https://docs.google.com/gview?url=${config.FILE_URL + props.doc?.id}&embedded=true`}/>
        </Modal>
    )
}

TableViewDocs.defaultProps = {
    isLoading: false,
}

TableViewDocs.propTypes = {
    docs: PropTypes.arrayOf(Object).isRequired,
    editFunc: PropTypes.func.isRequired,
    deleteFunc: PropTypes.func.isRequired,
};

export default TableViewDocs;
