import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Row,Col,Modal, Button} from "reactstrap";
import Spinner from "reactstrap/es/Spinner";


class ModalConfirm extends Component {
    render() {
        const {label, isOpen, toggle, confirm, loading} = this.props;

        return (
            <Modal isOpen={isOpen} toggle={toggle} backdrop={false} centered={true} modalClassName="confirm-modal" className="confirm-modal-content">
                <Row className="mt-4 mb-3 mx-2">
                    <Col className="">
                        <p className="text-center title title-sub">{label}</p>
                    </Col>
                </Row>
                <Row className="mb-4 mx-2 d-flex justify-content-around">
                    <Col className="d-flex justify-content-end">
                        <Button style={{minWidth:'90px'}} onClick={toggle} color="danger" outline>Cancel</Button>
                    </Col>
                    <Col>
                        <Button disabled={loading} style={{minWidth:'90px'}} onClick={confirm} color="primary"> {loading? <Spinner size="sm" color="light"/> :'Confirm'} </Button>
                    </Col>
                </Row>
            </Modal>
        );
    }
}
ModalConfirm.defaultProps = {
    loading: false,
    type: '',
    label: 'Are you sure?'
}

ModalConfirm.propTypes = {
    loading:PropTypes.bool,
    isOpen: PropTypes.bool.isRequired,
    toggle: PropTypes.func.isRequired,
    confirm: PropTypes.func.isRequired,
    label: PropTypes.string,
    className: PropTypes.string,
    type:PropTypes.string
};

export default ModalConfirm;
