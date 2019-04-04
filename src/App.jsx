import ArticleEdit from './components/ArticleEdit';
import React from 'react';
import SiteStyle from './components/SiteStyle';

import { ArticleViewLoader } from './components/ArticleView';
import { TopMenuLoader } from './components/TopMenu';
import { BrowserRouter as Router, Route } from "react-router-dom";

import './App.scss';
// import 'antd/dist/antd.css';  // or 'antd/dist/antd.less'

const Home = () => <h2>Home Page TBI</h2>;
const NotImplemented = () => <h2>Not Yet Implemented</h2>;
// const DbRoot = props => <ArticleView ...Object.assign({}, props, { match: { params: { path:'_home' }}}) />
// const DbRoot = props => <ArticleView {...props} />

function DbRoot(props) {
  return <ArticleView {...props} />
}

const AppRouter = () => (
  <Router>
    <div id="router-child">
      <SiteStyle />

        <Route component={TopMenuLoader} />
      
      {/*<nav id="toc">toc</nav>*/}

      {/*<div id="routed-path-container">*/}
        <Route path="/" exact component={Home} />
        <Route exact path="/:db/:path([^$]+)/edit" render={props => <ArticleEdit {...props} />} />
        <Route exact path="/:path+" render={props => { return <ArticleViewLoader {...props} foo="bar" />}} />
      {/*</div>*/}

      
    </div>
  </Router>
);

export default AppRouter;