import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Button, Col, Input, Label, Row} from "reactstrap/es";
import MyPagination from "./MyPagination";
import TableViewDocs from "./TableViewDocs";
import {deleteDoc, editDoc, getByFilter} from "../api";
import {date, corr} from "../utils/common"
import {toast} from "react-toastify";
import ModalAddEditDoc from "./modal/ModalAddEditDoc";
import ModalConfirm from "./modal/ModalConfirm";

class AllDocsWithFilter extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            isOpenEditM: false,
            isOpenDelM: false,
            editDoc: null,
            deleteDoc: null,
            allDocs: [],
            orderType: "COURIER",
            correspondent: "CB",
            start: 1,
            end: 2,
            word: "",
            page: 0,
            size: 5,
            totalPages: 0,
            totalElements: 0,
            numberOfElements: 0,
            offset: 0,
            isFirst: true,
            isLast: true,
        }
    }

    getAllDocsFilter = (page, size, data) => {
        getByFilter(page, size, data).then(res => {
            if (res.status === 200) {
                this.setState({
                    allDocs: res.data.content, page: res.data.number, size: res.data.size,
                    totalPages: res.data.totalPages, totalElements: res.data.totalElements,
                    numberOfElements: res.data.numberOfElements, offset: res.data.pageable.offset,
                    isFirst: res.data.first, isLast: res.data.last
                })
                // res.data.content.length === 0 && toast.info("NO DOCUMENTS WITH THIS FILTER")
            }
            // console.log(res);
        }).catch(err => {
            // console.log(err)
            if (err.message === "Network Error") {
                toast.warn("Check your network")
            } else {
                toast.error("Something went wrong")
            }
        })
    }
    filterDate = (state) => {
        return {
            orderType: state.orderType,
            correspondent: state.correspondent,
            start: state.start,
            end: state.end,
            word: state.word
        }
    }

    componentDidMount() {
        this.getAllDocsFilter(this.state.page, this.state.size, this.filterDate(this.state));
    }

    handlePageClick = (page) => {
        console.log(page);
        if (this.state.page !== page) {
            this.getAllDocsFilter(page, this.state.size, this.filterDate(this.state));
        }
    }
    // PAGE SIZE CHANGER
    pageSizeChange = (e) => {
        // console.log(e.target.value);
        this.getAllDocsFilter(0, e.target.value, this.filterDate(this.state));
    }

    makeFilter = () => {
        this.getAllDocsFilter(this.state.page, this.state.size, this.filterDate(this.state));
        // this.setState({word:""})
    }

    handleChange = (event) => {
        const {name, value, type, checked} = event.target;
        if (name === "start" || name === "end") {
            if (name === "start" && value < 12 && value > this.state.end) {
                this.setState({end: parseInt(value) + 1})
            }
            this.setState({[name]: parseInt(value)});
            return;
        }
        type === "checkbox" ? this.setState({[name]: checked}) : this.setState({[name]: value})

    }

    openEditDocM = (doc) => {
        this.setState({editDoc: doc, isOpenEditM: true})
    }
    toggleEditDocModal = () => {
        this.setState({editDoc: null, isOpenEditM: !this.state.isOpenEditM})
    }

    openDeleteDoc = (docId) => {
        this.setState({deleteDoc: docId, isOpenDelM: true})
    }
    toggleDelDocModal = () => {
        this.setState({deleteDoc: null, isOpenDelM: !this.state.isOpenDelM})
    }


    // EDIT DOC SUBMIT
    submitEdit = (data) => {
        editDoc(data).then(res => {
            // console.log(res);
            if (res.status === 200) {
                toast.success("Document Edited")
                this.getAllDocsFilter(this.state.page, this.state.size, this.filterDate(this.state));
                this.setState({editDoc: null, isOpenEditM: false})
            }
        }).catch(err => {
            // console.log(err);
            toast.error("Something went wrong");
        })
    }
    // DELETE DOC SUBMIT
    submitDeleteDoc = () => {
        deleteDoc(this.state.deleteDoc).then(res => {
            if (res.status === 200) {
                toast.success("Document Deleted");
                this.getAllDocsFilter(this.state.page, this.state.size, this.filterDate(this.state));
            }
        }).catch(err => {
            // console.log(err);
            toast.error("Something went wrong");
        })
        this.setState({deleteDoc: null, isOpenDelM: false})
    }

    render() {
        const orderType = [
            {"key": "EMAIL", "value": "Email"},
            {"key": "TELEGRAMMA", "value": "Telegramma"},
            {"key": "COURIER", "value": "Courier"}
        ]


        return (
            <React.Fragment>
                <h3 className="no-print">Documents with Filter</h3>
                <Row className="my-3 no-print">
                    <Col md={2}>
                        <Label for="theme">Order Type</Label>
                        <Input type="select" name="orderType" id="orderType"
                               value={this.state.orderType} onChange={this.handleChange}>
                            <option value="ALL">All</option>
                            {orderType.map((item, i) => {
                                return (
                                    <option key={i} value={item.key}>{item.value}</option>
                                )
                            })}
                        </Input>
                    </Col>
                    <Col md={2}>
                        <Label for="theme">Correspondent Type</Label>
                        <Input type="select" name="correspondent" id="correspondent"
                               value={this.state.correspondent} onChange={this.handleChange}>
                            <option value="ALL">All</option>
                            {corr.map((item, i) => {
                                return (
                                    <option key={i} value={item.key}>{item.value}</option>
                                )
                            })}
                        </Input>
                    </Col>
                    <Col md={3}>
                        <Row>
                            <Col md={6}>
                                <Label for="theme">Start date</Label>
                                <Input type="select" name="start" id="start"
                                       value={this.state.start} onChange={this.handleChange}>
                                    {date.map((item, i) => {
                                        return (
                                            <option key={i} value={item.key}>{item.value}</option>
                                        )
                                    })}
                                </Input>
                            </Col>
                            <Col md={6}>
                                <Label for="theme">End date</Label>
                                <Input type="select" name="end" id="end"
                                       value={this.state.end} onChange={this.handleChange}>
                                    {date.map((item, i) => {
                                        return (
                                            <option key={i} value={item.key}
                                                    disabled={this.state.start >= item.key}>{item.value}</option>
                                        )
                                    })}
                                </Input>
                            </Col></Row>
                    </Col>
                    <Col md={3}>
                        <Label for="theme">Filter word</Label>
                        <Input type="text" name="word" id="word" placeholder="type here..."
                               value={this.state.word} onChange={this.handleChange}/>
                    </Col>
                    <Col md={2} className="pt-2">
                        <Button className="mt-4 btn-block" onClick={this.makeFilter} color="primary">Filter</Button>
                    </Col>
                </Row>
                <Row className="no-print">
                    <Col md={3} className="col-6 d-flex align-items-center">
                        <span className="mr-2">Show </span>
                        <Input type="select" name="size" id="pageSize" style={{width: "70px"}}
                               value={this.state.size} onChange={this.pageSizeChange}>
                            <option value={5}>5</option>
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                        </Input>
                        <span className="ml-2"> Documents</span>
                    </Col>
                    <Col md={6} className="offset-md-3">
                        <MyPagination isFirst={this.state.isFirst} isLast={this.state.isLast}
                                      page={this.state.page} totalPages={this.state.totalPages}
                                      handlePageClick={this.handlePageClick} className="float-right"/>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <TableViewDocs docs={this.state.allDocs} editFunc={this.openEditDocM}
                                       deleteFunc={this.openDeleteDoc} isLoading={this.state.isLoading}/>
                    </Col>
                </Row>

                <Row className="d-flex align-items-center my-3 no-print">
                    <Col md={6}>
                        <span
                            className="no-print">Showing {this.state.numberOfElements === 0 ? 0 : this.state.offset + 1} to {this.state.offset + this.state.numberOfElements} of {this.state.totalElements} documents</span>
                    </Col>
                    <Col md={6}>
                        <MyPagination isFirst={this.state.isFirst} isLast={this.state.isLast}
                                      page={this.state.page} totalPages={this.state.totalPages}
                                      handlePageClick={this.handlePageClick} className="float-right"/>
                    </Col>
                </Row>
                {this.state.editDoc &&
                <ModalAddEditDoc isOpen={this.state.isOpenEditM} toggle={this.toggleEditDocModal}
                                 onSubmit={this.submitEdit} editValues={this.state.editDoc}/>}
                <ModalConfirm confirm={this.submitDeleteDoc} isOpen={this.state.isOpenDelM}
                              toggle={this.toggleDelDocModal}/>
            </React.Fragment>
        );
    }
}

AllDocsWithFilter.propTypes = {};

export default AllDocsWithFilter;
