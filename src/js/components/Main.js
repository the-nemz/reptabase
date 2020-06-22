import React from 'react';
import { CSSTransitionGroup } from 'react-transition-group';
import URI from 'urijs';
import 'focus-visible/dist/focus-visible.min.js';

export default class Main extends React.Component {

  constructor(props) {
    super(props);

    this.state = {};
  }

  renderFadeWrap(content) {
    return (
      <CSSTransitionGroup transitionName="FadeAnim"
                          transitionAppear={true}
                          transitionAppearTimeout={400}
                          transitionEnter={true}
                          transitionEnterTimeout={400}
                          transitionLeave={true}
                          transitionLeaveTimeout={400}>
        {content}
      </CSSTransitionGroup>
    );
  }

  render() {
    return (
      <div className="Main">
      </div>
    );
  }
}
