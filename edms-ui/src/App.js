import React, {Component} from "react";
import {Route, Switch, Link} from 'react-router-dom';
import {Badge, Button, Col, Container, Input, Row, TabContent, TabPane} from "reactstrap/es";
import ModalAddEditDoc from "./component/ModalAddEditDoc";
import CustomTabPane from "./component/CustomTabPane";
import TableViewDocs from "./component/TableViewDocs";
import {getAllDocs, getDocsCount, addNewDoc, editDoc, deleteDoc,getOrderType,getCorrespondentType} from "./api";
import {toast} from "react-toastify";
import MyPagination from "./component/MyPagination";
import ModalConfirm from "./component/ModalConfirm";
import AllDocsWithFilter from "./component/AllDocsWithFilter";
import {date, corr} from "./utils/common";



class App extends Component {
    constructor(props) {
        super(props);
        this.tabPane = ["All", "Filter"]
        this.state = {
            activeTab: this.tabPane[0],
            isLoading: false,
            isOpen: false,
            isOpenEditM: false,
            isOpenDelM: false,
            editDoc: null,
            deleteDoc: null,
            allDocs: [],
            page: 0,
            size: 5,
            totalPages: 0,
            totalElements: 0,
            numberOfElements: 0,
            offset: 0,
            isFirst: true,
            isLast: true,
            allByFilter: [],
            fileId: "",
            docsCount:0,
            correspondent: "CB",
            currentMonth: new Date().getMonth() + 1,
        }
    }

    componentDidMount() {
        this.getAllDocsPageable(this.state.page, this.state.size);
        this.getDocsCountByCorr(this.state.correspondent, this.state.currentMonth)
    }

    getAllDocsPageable = (page, size) => {
        this.setState({isLoading: true})
        getAllDocs(page, size).then(res => {
            if (res.status === 200) {
                this.setState({
                    allDocs: res.data.content, page: res.data.number, size: res.data.size,
                    totalPages: res.data.totalPages, totalElements: res.data.totalElements,
                    numberOfElements: res.data.numberOfElements, offset: res.data.pageable.offset,
                    isFirst: res.data.first, isLast: res.data.last
                })
            }
            // console.log(res)
        }).catch(err => {
            // console.log(err)
            if (err.message === "Network Error") {
                toast.warn("Check your network")
            } else {
                toast.error("Something went wrong")
            }
        })
        this.setState({isLoading: false})
    }
    getDocsCountByCorr = (correspondent, month) => {
        getDocsCount(correspondent, month).then(res => {
            // console.log(res);
            if (res.status === 200) {
                this.setState({docsCount: res.data})
            }
        }).catch(err => {
            // console.log(err);
            toast.error("Something went wrong");
        })
    }
    // getOrderTypeEnum=()=>{
    //
    // }

    handlePageClick = (page) => {
        // console.log(page);
        if (this.state.page !== page) {
            this.getAllDocsPageable(page, this.state.size);
        }
    }

    // PAGE SIZE CHANGER
    pageSizeChange = (e) => {
        // console.log(e.target.value);
        this.getAllDocsPageable(0, e.target.value);
    }

    filterChange=(event)=>{
        const {name, value, type, checked} = event.target;
        if (name === "correspondent"){
            this.getDocsCountByCorr(value, this.state.currentMonth);

        }else if(name === "currentMonth"){
            this.getDocsCountByCorr(this.state.correspondent, value);
        }
        this.setState({[name]: value})
    }


    toggleTab = (tab) => {
        if (this.state.activeTab !== tab) this.setState({activeTab: tab});
    }


    openAddDocModal = () => {
        this.setState({isOpen: true})
    }
    toggleAddDocModal = () => {
        this.setState({isOpen: !this.state.isOpen})
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

    // ADD DOC SUBMIT
    submitAdd = (data) => {
        addNewDoc(data).then(res => {
            // console.log(res);
            toast.success("Successfully Added")
            const newAllDocs = [res.data, ...this.state.allDocs]
            this.setState({allDocs: newAllDocs, isOpen: false})
        }).catch(err => {
            // console.log(err)
            toast.error("Something went wrong")
        })
    }
    // EDIT DOC SUBMIT
    submitEdit = (data) => {
        editDoc(data).then(res => {
            // console.log(res);
            if (res.status === 200) {
                toast.success("Document Edited")
                this.getAllDocsPageable(this.state.page, this.state.size);
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
                this.getAllDocsPageable(this.state.page, this.state.size);
            }
        }).catch(err => {
            // console.log(err);
            toast.error("Something went wrong");
        })
        this.setState({deleteDoc: null, isOpenDelM: false})
    }


    render() {

        return (
            <Container>
                <Row className="my-4">
                    <Col className="my-2">
                        <Button onClick={this.openAddDocModal} color={"success"}>Add Document</Button>
                    </Col>
                    <Col className="my-2 d-flex align-items-center justify-content-end">
                        <CustomTabPane paneItems={this.tabPane} toggleFunc={this.toggleTab}
                                       activeItem={this.state.activeTab}/>
                    </Col>
                </Row>
                <Row className="my-3 no-print">
                    <Col className="d-flex align-items-center flex-row">
                        <span className="mr-2">You have <Badge className="badge-info px-2 py-1">{this.state.docsCount}</Badge> documents in </span>
                        <Input type="select" name="currentMonth" id="currentMonth" style={{width:"250px"}}
                               value={this.state.currentMonth} onChange={this.filterChange}>
                            {date.map((item, i) => {
                                return (
                                    <option key={i} value={item.key}>{item.value}</option>
                                )
                            })}
                        </Input>
                        <span className="mx-2">by</span>
                        <Input type="select" name="correspondent" id="correspondent" style={{width:"250px"}}
                               value={this.state.correspondent} onChange={this.filterChange}>
                            {corr.map((item, i) => {
                                return (
                                    <option key={i} value={item.key}>{item.value}</option>
                                )
                            })}
                        </Input>
                    </Col>
                </Row>
                <TabContent activeTab={this.state.activeTab}>
                    <TabPane tabId={this.tabPane[0]}>
                        <h3 className="no-print">All Documents</h3>
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
                                <span className="no-print">Showing {this.state.numberOfElements === 0 ? 0 : this.state.offset + 1} to {this.state.offset + this.state.numberOfElements} of {this.state.totalElements} documents</span>
                            </Col>
                            <Col md={6}>
                                <MyPagination isFirst={this.state.isFirst} isLast={this.state.isLast}
                                              page={this.state.page} totalPages={this.state.totalPages}
                                              handlePageClick={this.handlePageClick} className="float-right"/>
                            </Col>
                        </Row>
                    </TabPane>
                    <TabPane tabId={this.tabPane[1]}>
                        <AllDocsWithFilter/>
                    </TabPane>
                </TabContent>
                <ModalAddEditDoc isOpen={this.state.isOpen} onSubmit={this.submitAdd} toggle={this.toggleAddDocModal}/>

                {this.state.editDoc &&
                <ModalAddEditDoc isOpen={this.state.isOpenEditM} toggle={this.toggleEditDocModal}
                                 onSubmit={this.submitEdit} editValues={this.state.editDoc}/>}
                <ModalConfirm confirm={this.submitDeleteDoc} isOpen={this.state.isOpenDelM}
                              toggle={this.toggleDelDocModal}/>

            </Container>
        );
    }
}

export default App;
