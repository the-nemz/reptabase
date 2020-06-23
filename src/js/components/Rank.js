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
    const segAngleY = (2 * Math.PI / 3) / (children.length + 1);
    const segAngleX = Math.PI / (children.length + 1);

    let childElems = [];
    for (const [i, child] of children.entries()) {
      let angleY = (Math.PI / 6) + segAngleY * (i + 1);
      let angleX = segAngleX * (i + 1);
      let y = 100 * Math.sin(angleY);
      let x = 50 + 100 * Math.cos(angleX) / -2;

      let mod = ((i % 5) / 2) - 1;
      let boost = children.length > 20 ? mod * 200 : 0;


      const style = {
        top: `calc(${y}% + ${boost}px)`,
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

    const count = Math.min(this.props.children.length + 1, 10)
    const screenWidth = this.props.windowDims.width;
    const margin = 2 * screenWidth / (count);

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
