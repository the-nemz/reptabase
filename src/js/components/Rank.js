import React from 'react';
import _ from 'lodash';

import Child from './Child.js';

const RANKNUM_TO_COLOR = {
  0: '#36964c',
  1: '#683696',
  2: '#963936',
  3: '#365496',
  4: '#36964c',
  5: '#36964c' // Shouldn't be used
}

export default class Rank extends React.Component {

  constructor(props) {
    super(props);

    this.state = {};
  }

  renderChildren(screenWidth, width) {
    const color = RANKNUM_TO_COLOR[this.props.rank.rankNum];
    const children = _.cloneDeep(this.props.children);
    const segAngle = Math.PI / (children.length + 1)

    let childElems = [];
    for (const [i, child] of children.entries()) {
      let angle = segAngle * (i +  1);
      let y = 100 * Math.sin(angle);
      let x = 50 + 100 * Math.cos(angle) / -2;


      const style = {
        top: `${y}%`,
        right: `${(screenWidth - width) * x / 100}px`,
        width: width
      };
      childElems.push(
        <div className="Rank-child" style={style} key={child.key}>
          <Child child={child} color={color}
                 onClick={(child) => this.props.onChildClick(child)} />
        </div>
      )
    }

    return childElems;
  }

  render() {
    const color = RANKNUM_TO_COLOR[this.props.rank.rankNum];

    const screenWidth = this.props.windowDims.width - 32;
    const margin = 2 * screenWidth / (this.props.children.length + 1);

    return (
      <div className="Rank" style={{color: color}}>
        <h1 className="Rank-title l-container">
          <div className="Rank-commonName">
            {this.props.rank.commonName}
          </div>
          <div className="Rank-sciName l-italic">
            {this.props.rank.sciName}
          </div>
        </h1>
        <div className="Rank-children" style={{marginLeft: `${margin}px`, width: `calc(100% - ${margin}px)`}}>
          {this.renderChildren(screenWidth, margin)}
        </div>
      </div>
    );
  }
}
