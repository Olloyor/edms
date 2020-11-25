import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Col, Row} from "reactstrap/es";

class DocView extends Component {
    render() {
        const doc = this.props.doc;

        return (
            doc!==null &&
            <div id="docPrint" style={{display:"none"}}>
                <Row className="mt-4">
                    <Col md={6}>
                        <p className="font-weight-bold">№ Register: <span className="text-dark">{doc.regId}</span></p>
                    </Col>
                </Row>
                <Row>
                    <Col md={6}>
                        <p className="font-weight-bold">Theme: <span className="text-dark">{doc.theme}</span></p>
                    </Col>
                    <Col md={6}>
                        <p className="font-weight-bold">Created: {doc.createdAt}</p>
                    </Col>
                </Row>
                <Row>
                    <Col md={6}>
                        <p className="font-weight-bold">Description: {doc.theme}</p>
                    </Col>
                    <Col md={6}>
                        <p className="font-weight-bold">Deadline: {doc.deadline}</p>
                    </Col>
                </Row>
                <Row>
                    <Col md={6}>
                        <p className="font-weight-bold">№ Outgoing: <span className="text-dark">{doc.outgoingDoc}</span></p>
                    </Col>
                    <Col md={6}>
                        <p className="font-weight-bold">Outgoing Data: <span className="text-dark">{doc.outgoingDate}</span></p>
                    </Col>
                </Row>
                <Row>
                    <Col md={6}>
                        <p className="font-weight-bold">Order Type: <span className="text-dark">{doc.orderType?.value}</span></p>
                    </Col>
                    <Col md={6}>
                        <p className="font-weight-bold">Has Control: <span className="text-dark">{doc.isControl?'YES':'NO'}</span></p>
                    </Col>
                </Row>
                <Row>
                    <Col md={6}>
                        <p className="font-weight-bold">Correspondent: <span className="text-dark">{doc.correspondent?.value}</span></p>
                    </Col>
                    <Col md={6}>
                        <p className="font-weight-bold">Has Access: <span className="text-dark">{doc.isAccess?'YES':'NO'}</span></p>
                    </Col>
                </Row>
            </div>
        );
    }
}

DocView.propTypes = {
    doc: PropTypes.object.isRequired,

};

export default DocView;
