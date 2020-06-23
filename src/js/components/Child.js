import React from 'react';
import _ from 'lodash';

export default class Child extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      hovered: false
    };
  }

  handleHoverChange() {
    this.setState({
      hovered: !this.state.hovered
    })
  }

  render() {
    const style = {
      backgroundColor: this.props.color,
      zIndex: this.state.hovered ? 1 : 0
    }
    return (
      <div className="Child" style={style}
           onMouseEnter={() => this.handleHoverChange()}
           onMouseLeave={() => this.handleHoverChange()}
           onClick={() => this.props.onClick(this.props.child)}>
        <div className="Child-content">
          <div className="Child-sciName">
            {this.props.child.sciName}
          </div>
          <div className="Child-numDescendants">
            {this.props.child.numDescendants}
          </div>
        </div>
      </div>
    );
  }
}
