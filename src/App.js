import React from 'react';
import './App.css';
import Navbar from './components/navbar'
import Table from './components/table'
import Modal from "./components/modal"

let titles = {"Número":"id", "Produto":"name", "Preço":"price"}
let contents = [{"id": "1", "total":"100", "nome":"José"}, 
                {"id": "2", "total":"700", "nome":"Maria"}, 
                {"id": "3", "total":"800", "nome":"João"}]



class App extends React.Component{

  constructor(props) {
    super(props);    
    this.state = {showModal: false,
                  actions : [{"text":"Adicionar", "action": this.b.bind(this)}],
                  contents: [{"id": "1", "price":"10", "name":"Banana"}, 
                              {"id": "2", "price":"70", "name":"Batata"}, 
                              {"id": "3", "price":"80", "name":"Alface"},
                              {"id": "4", "price":"80", "name":"Chuchu"},
                              {"id": "5", "price":"80", "name":"Beteraba"},
                              {"id": "6", "price":"80", "name":"Maçã"}]
                  };
  }

  componentDidMount(){
    fetch('http://192.168.0.173:5000/pedido/get-list')
    .then(response => response.json())
    .then(data =>this.setState({ contents: Object.values(data) }));
  }

   b(x){
    this.setState({showModal : this.state.showModal ? false : true});
    //alert("Clicked " + x.name)
  }

  closeModal(){
    this.setState({showModal : false});
  }

  render(){
    return  (<div className="App" class="app">
          
              <Navbar />
              
                <div class="page_content">
                  <Table titles={titles} contents={this.state.contents} actions={this.state.actions}/>
                </div>
                <Modal showModal={this.state.showModal} closeEvent={this.closeModal.bind(this)}>
                  <Table titles={titles} contents={this.state.contents}/>
                </Modal>
              
            </div>)
  }
  
}



/*function App() {

  return (
    <div className="App">
      <Navbar/>
      <Table titles={titles} contents={contents} />
      <header className="App-header">
       
      </header>
    </div>
  );
}
*/

export default App;
