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

function Disambiguator(props) {
  if (!props) throw new Error('Disambiguator > impossible error');
  if (!props.match) throw new Error('Disambiguator > invalid props; "match" not found');
  if (!props.match.params) throw new Error('Disambiguator > invalid props; "match.params" not found');
  const { path } = props.match.params;
  if (!path || typeof(path) !== 'string') throw new Error('Disambiguator > path is invalid');
  if (path.includes('/edit')) return <ArticleEdit {...props} />; // todo: remove "/edit" from path
  else return <ArticleViewLoader {...props} />; 
}

const AppRouter = () => (
  <Router>
    <div id="router-child">
      <SiteStyle />

        <Route component={TopMenuLoader} />
      
      {/*<nav id="toc">toc</nav>*/}

      {/*<div id="routed-path-container">*/}
        <Route path="/" exact component={Home} />
        <Route exact path="/:db/:path([^$]+)/edit" render={props => <Disambiguator {...props} />} />
        <Route exact path="/:path+" render={props => { return <Disambiguator {...props} fileList={fileList} foo="bar" />}} />
      {/*</div>*/}

      
    </div>
  </Router>
);

export default AppRouter;




const fileList=["/5e advanced","/5e advanced/_badge.html","/5e advanced/characters","/5e advanced/classes","/5e advanced/playtesting","/5e advanced/musings","/5e advanced/_style.txt","/5e advanced/classes/demigod.md","/5e advanced/house rules.txt","/5e advanced/implied changes.txt","/5e advanced/_home.txt","/5e advanced/test.md","/5e advanced/initiative.md","/5e advanced/races.md","/5e advanced/skills.txt","/5e advanced/armor.txt","/5e advanced/weapons.txt","/5e advanced/spells.txt","/5e advanced/playtesting/kaine vs adult blue dragon.md","/5e advanced/playtesting/keket vs the beholder zombie.md","/5e advanced/playtesting/keket (10) vs alhoon.md","/5e advanced/playtesting/keket (10) vs 8 shadow demons.md","/5e advanced/characters/ani.md","/5e advanced/characters/natalia.md","/5e advanced/characters/zahl.md","/5e advanced/characters/keket.md","/5e advanced/classes/vampire.md","/5e advanced/maneuvers.txt","/5e advanced/characters/vi.md","/5e advanced/classes/tiefling.md","/5e advanced/magic.md","/5e advanced/classes/cleric.md","/5e advanced/classes/warlock.md","/5e advanced/classes/witch.md","/5e advanced/classes/wizard.md","/5e advanced/musings/big magic.md","/5e advanced/classes/fighter.md","/5e advanced/characters/wesley.md","/5e advanced/classes/rogue.txt","/5e advanced/characters/alaera.md","/5e advanced/characters/zelena.md","/5e advanced/classless.md","/5e advanced/classes/druid.md","/5e advanced/_style.leeloo.css","/5e advanced/epic.md","/5e advanced/characters/talrendis.md","/5e advanced/characters/aurora.md","/5e advanced/characters/aeon.md","/5e advanced/musings/strategy.md","/5e advanced/style.css","/5e advanced/classes/index.md","/5e advanced/characters/sapphire.md","/5e advanced/classes/psion.md","/5e advanced/classes/armor jockey.md","/5e advanced/characters/phobos.md","/5e advanced/_menu.md","/5e advanced/_menu.txt","/5e advanced/classes/dragon.md","/5e advanced/classes/psion 2.md","/5e advanced/changelog.md","/5e advanced/characters/cassandra.md","/5e advanced/characters/kaine.md"];