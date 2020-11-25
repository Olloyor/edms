import React, {Component} from 'react';
import PropTypes from 'prop-types';

class CustomTabPane extends Component {


    render() {
        const {paneItems, activeItem, toggleFunc} = this.props;

        return (
            <div className="custom-tab-pane">
                {paneItems && paneItems.map((item) => {
                    return (<div key={item} className={`pane-item${activeItem === item ? ' active' : ''} `}
                                 onClick={() => {
                                     toggleFunc(item);
                                 }}>{item}
                            </div>)
                })}
            </div>
        );
    }
}

CustomTabPane.propTypes = {
    paneItems: PropTypes.array.isRequired,
    activeItem: PropTypes.string.isRequired,
    toggleFunc: PropTypes.func.isRequired,
    additionalFunc: PropTypes.func,
};

export default CustomTabPane;
