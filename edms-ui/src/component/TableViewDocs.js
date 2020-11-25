import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {config} from "../utils/config";
import {Badge, Button, Col, Spinner, Table, Tooltip} from "reactstrap/es";
import DocView from "./DocView.jsx";
import IconPrint from "./icon/IconPrint";
import IconDelete from "./icon/IconDelete";
import IconEdit from "./icon/IconEdit";

class TableViewDocs extends Component {
    constructor(props) {
        super(props);
        this.state = {
            printDoc: {},

        }
    }

    printDoc = (currDoc) => {
        this.setState({printDoc: currDoc})
        setTimeout(() => {
            window.print();

        }, 600);
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
                                        <Badge className="py-1 px-2"
                                               color={doc.isAccess ? "success" : "danger"}>{doc.isAccess ? "YES" : "NO"}</Badge>
                                    </td>
                                    <td>
                                        <Badge className="py-1 px-2"
                                               color={doc.isControl ? "success" : "danger"}>{doc.isControl ? "YES" : "NO"}</Badge>
                                    </td>
                                    <td>
                                        <a rel="noreferrer" target="_blank"
                                           href={config.FILE_URL + doc.file?.id}>{doc.file?.name}</a>
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

TableViewDocs.defaultProps = {
    isLoading: false,
}

TableViewDocs.propTypes = {
    docs: PropTypes.arrayOf(Object).isRequired,
    editFunc: PropTypes.func.isRequired,
    deleteFunc: PropTypes.func.isRequired,
};

export default TableViewDocs;
