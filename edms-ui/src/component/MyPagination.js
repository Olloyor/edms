import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Pagination, PaginationItem, PaginationLink} from "reactstrap/es";

class MyPagination extends Component {

    render() {
        return (
            <Pagination aria-label="Page navigation example" className={this.props.className}>
                <PaginationItem disabled={this.props.isFirst}>
                    <PaginationLink previous onClick={()=> this.props.handlePageClick(this.props.page - 1)}/>
                </PaginationItem>
                {[...Array(this.props.totalPages)].map((page, i) => (
                    <PaginationItem active={i === this.props.page} key={i}>
                        <PaginationLink onClick={() => this.props.handlePageClick(i)}>
                            {i + 1}
                        </PaginationLink>
                    </PaginationItem>
                ))}
                <PaginationItem disabled={this.props.isLast}>
                    <PaginationLink next onClick={()=> this.props.handlePageClick(this.props.page + 1)}/>
                </PaginationItem>
            </Pagination>
        );
    }
}

MyPagination.propTypes = {
    isFirst: PropTypes.bool.isRequired,
    isLast: PropTypes.bool.isRequired,
    page: PropTypes.number.isRequired,
    totalPages: PropTypes.number.isRequired,
    handlePageClick: PropTypes.func.isRequired,

};

export default MyPagination;
