import React, {Component} from 'react';
import PropTypes from 'prop-types';

class IconView extends Component {
    render() {
        return (
            <svg width={this.props.size} height={this.props.size} viewBox="0 0 16 16" className="bi bi-pen-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z"/>
                <path fillRule="evenodd" d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z"/>
            </svg>
        );
    }
}
IconView.defaultProps = {
    size: "1rem"
}

IconView.propTypes = {
    size: PropTypes.string.isRequired,
};

export default IconView;
