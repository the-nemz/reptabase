import React from 'react';
import { CSSTransitionGroup } from 'react-transition-group';
import 'focus-visible/dist/focus-visible.min.js';
import _ from 'lodash';

import Rank from './Rank.js';

import { GBIF_BASE, REPTILIA_ID, RANKS } from '../util.js';

export default class Main extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      rank: {
        key: REPTILIA_ID,
        sciName: 'Reptilia',
        numDescendants: 36698,
        rankNum: 0
      },
      children: [],
      windowDims: {
        width: window.innerWidth || 0,
        height: window.innerHeight || 0
      }
    };

    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
  }

  updateWindowDimensions() {
    let windowDims = {
      height: window.innerHeight,
      width: window.innerWidth
    }
    this.setState({
      windowDims: windowDims
    });
  }

  componentDidMount() {
    this.refreshRank();

    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);
  }

  fetchChildren(resolve, reject, children, rank, offset = 0) {
    const childRankNum = rank.rankNum + 1;
    const childRankName = RANKS.LIST[childRankNum];

    fetch(`${GBIF_BASE}/species/${rank.key}/children?offset=${offset}`)
      .then(res => res.json())
      .then(
        (result) => {
          let done = false;
          for (const entry of result.results) {
            if (entry.rank === childRankName) {
              children.push({
                key: entry.key,
                sciName: entry.canonicalName,
                numDescendants: entry.numDescendants,
                rankNum: childRankNum
              });
            } else {
              done = true;
              break;
            }
          }
          if (done || result.endOfRecords) {
            resolve();
          } else {
            this.fetchChildren(resolve, reject, children, rank, offset + result.limit);
          }
        },
        (error) => {
          console.log(error)
          reject();
        }
      );
  }

  refreshRank(child) {
    let rank = _.cloneDeep(child || this.state.rank);

    let namePromise = new Promise((resolve, reject) => {
      fetch(`${GBIF_BASE}/species/${rank.key}/vernacularNames`)
        .then(res => res.json())
        .then(
          (result) => {
            let english = '';
            let shortestUnset = '';
            for (const entry of result.results) {
              if (entry.vernacularName) {
                if (entry.language === 'eng' && !english) {
                  english = entry.vernacularName;
                } else if (!entry.language && (!shortestUnset || entry.vernacularName.length < shortestUnset.length)) {
                  shortestUnset = entry.vernacularName;
                }
              }
            }
            rank.commonName = english ? english : shortestUnset;
            resolve();
          },
          (error) => {
            console.log(error)
            reject();
          }
        );
    });

    let children = [];
    let childrenPromise = new Promise((resolve, reject) => {
      this.fetchChildren(resolve, reject, children, rank);
    });

    Promise.all([namePromise, childrenPromise])
      .then(() => {
        this.setState({
          rank: rank,
          children: children
        })
      });
  }

  handleChildClick(child) {
    this.refreshRank(child);
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
        <Rank rank={this.state.rank} children={this.state.children} windowDims={this.state.windowDims}
              onChildClick={(child) => this.handleChildClick(child)} />
      </div>
    );
  }
}
