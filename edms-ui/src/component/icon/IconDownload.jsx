import React, {Component} from 'react';
import PropTypes from 'prop-types';

class IconDownload extends Component {
    render() {
        return (
            <svg width={this.props.size} height={this.props.size} viewBox="0 0 16 16" className="bi bi-pen-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
                <path fillRule="evenodd" d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"/>
            </svg>
        );
    }
}
IconDownload.defaultProps = {
    size: "1rem"
}

IconDownload.propTypes = {
    size: PropTypes.string.isRequired,
};

export default IconDownload;
