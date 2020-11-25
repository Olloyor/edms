import React, {Component} from 'react';
import PropTypes from 'prop-types';

class IconBack extends Component {
    render() {
        return (
            <svg width={this.props.size} height={this.props.size} viewBox="0 0 16 16" className="bi bi-trash-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm9.5 8.5a.5.5 0 0 0 0-1H5.707l2.147-2.146a.5.5 0 1 0-.708-.708l-3 3a.5.5 0 0 0 0 .708l3 3a.5.5 0 0 0 .708-.708L5.707 8.5H11.5z"/>
            </svg>
        );
    }
}
IconBack.defaultProps = {
    size: "1rem"
}

IconBack.propTypes = {
    size: PropTypes.string.isRequired,
};

export default IconBack;
