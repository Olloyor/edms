import React, { useState } from "react";
import { Document, Page } from "react-pdf";
import {Button} from "reactstrap/es";
import {config} from "../utils/config";

export default function PdfViewer(props) {
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1); //setting 1 to show fisrt page

    function onDocumentLoadSuccess({ numPages }) {
        setNumPages(numPages);
        setPageNumber(1);
    }

    function changePage(offset) {
        setPageNumber(prevPageNumber => prevPageNumber + offset);
    }

    function previousPage() {
        changePage(-1);
    }

    function nextPage() {
        changePage(1);
    }

    const { pdf } = props;

    return (
        <>
            <h3>{pdf?.name}</h3>
            <Document
                file={config.FILE_URL + pdf?.id}
                options={{ workerSrc: "/pdf.worker.js" }}
                onLoadSuccess={onDocumentLoadSuccess}
            >
                <Page pageNumber={pageNumber} />
            </Document>
            <div>
                <p>Page {pageNumber || (numPages ? 1 : "--")} of {numPages || "--"}</p>
                <Button style={{width:"120px"}} size="sm" type="button" disabled={pageNumber <= 1} onClick={previousPage}>Previous</Button>
                <Button style={{width:"120px"}} size="sm" type="button" disabled={pageNumber >= numPages} onClick={nextPage}>Next</Button>
            </div>
        </>
    );
}
