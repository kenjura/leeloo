import ArticleEdit from './components/ArticleEdit';
import ArticleView from './components/ArticleView';
import TopMenu from './components/TopMenu';
import React from 'react';

import { BrowserRouter as Router, Route } from "react-router-dom";

import './App.scss';
// import 'antd/dist/antd.css';  // or 'antd/dist/antd.less'

const Home = () => <h2>Home Page TBI</h2>;
const NotImplemented = () => <h2>Not Yet Implemented</h2>;
// const DbRoot = props => <ArticleView ...Object.assign({}, props, { match: { params: { path:'_home' }}}) />
// const DbRoot = props => <ArticleView {...props} />

class DbRoot extends React.Component {
  render() {
    return <ArticleView {...this.props} />
  }
}

const AppRouter = () => (
  <Router>
    <div id="router-child">

      <TopMenu />
      
      {/*<nav id="toc">toc</nav>*/}

      <div id="routed-path-container">
        <Route path="/" exact component={Home} />
        <Route exact path="/:db/:path([^$]+)/edit" component={ArticleEdit} />
        <Route exact path="/:db/:path([^$/]+)" component={ArticleView} />
        <Route exact path="/:db/" component={DbRoot} />
      </div>
      
    </div>
  </Router>
);

export default AppRouter;