import React, { Component } from 'react';
import './App.css';
import Search from './Search.jsx';
import Table from './Table.jsx';
import Button from './Button.jsx'; 

const DEFAULT_QUERY = '';
const DEFAULT_PAGE = 0;
const DEFAULT_HPP = '20'; 

const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';
const PARAM_PAGE = 'page='
const PARAM_HPP = 'hitsPerPage=';

class App extends Component {
  constructor(props){
    super(props) 

    this.state = {
      result: null,
      searchTerm: DEFAULT_QUERY,
    }

    this.onDismiss = this.onDismiss.bind(this); 
    this.onSearchChange = this.onSearchChange.bind(this); 
    this.setSearchTopStories = this.setSearchTopStories.bind(this);
    this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this);
    this.onSearchSubmit = this.onSearchSubmit.bind(this); 
  }

  fetchSearchTopStories(searchTerm, page) {
    fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`)
    .then(response => response.json())
    .then(result => this.setSearchTopStories(result));
  }

  setSearchTopStories(result){
    const { hits, page } = result; 

    const oldHits = page !== 0 
    ? this.state.result.hits
    : []; 

    const updatedHits = [
      ...oldHits,
      ...hits
    ]; 

    this.setState({
      result: {hits: updatedHits, page}
    })
  }

  componentDidMount(){
    const {searchTerm} = this.state;
    this.fetchSearchTopStories(searchTerm, DEFAULT_PAGE);
  }

  onDismiss(id){
    function isNotId(item){
      return item.objectID !== id; 
    }

    const updatedHits = this.state.result.hits.filter(isNotId);

    this.setState({
      result: { ...this.state.result, hits: updatedHits }
    });
  }

  onSearchChange(event){
    this.setState({searchTerm: event.target.value }) 
  }

  onSearchSubmit(event){
    const {searchTerm} = this.state;
    this.fetchSearchTopStories(searchTerm, DEFAULT_PAGE); 
    event.preventDefault(); 
  }

  render() {
    const {searchTerm, result} = this.state; 
    const page = (result && result.page) || 0; 
    if (!result) {return null;}
    console.log(this.state); 

    return (
      <div className="page">
      <div className="interactions">
      <Search
      type="text" 
      value={searchTerm}
      onChange={this.onSearchChange} 
      onSubmit={this.onSearchSubmit}
      > Search 
      </Search> 
      </div> 

      {
        result ?
          <Table 
        list={result.hits}
        onDismiss={this.onDismiss}
        /> 
          :
            null
      }
      <div> 
      <Button onClick={() => this.fetchSearchTopStories(searchTerm, page + 1)}> 
      More 
      </Button> 
      </div>
      </div>
    );
  }
}

export default App;
