import React, { useState, useEffect } from 'react';
import {BrowserRouter as Router, Route, Link, Switch, Redirect} from 'react-router-dom'
import './App.css';
import Navbar from './components/navbar'
import Table from './components/table'
import Modal from './components/modal'
import Tab from './components/tabview/tab';
import TabRow from './components/tabview/tabrow';
import TabContent from './components/tabview/tabcontent';
import formatMoney from './utils/util'



class App extends React.Component{

  constructor(props) {
    super(props);    
    this.state = {};
  }


  render(){
    return  (<div className="app" class="app">
              <Router>
                <Switch>
                <Route exact={true} path='/login' component={LoginPage}/>

                <Route exact={true} path='/register' component={SignUpPage}/>

                 <Navbar title="GreenSales">
                   
                    <a href="/novo">Novo Pedido</a>
                    <a href="/admin">Histórico</a>
                    <a href="/novo">Sobre</a>
                  </Navbar>
                </Switch>
                  <Route exact={true} path='/admin' component={AdminPanel}/>

                  <Route exact={true} path='/novo' component={NewOrderPage}/>

                  <Route exact={true} path='/t' render={()=>
                    <h1>Test Route 2</h1>
                  }/>
               
              </Router>
            </div>)
  }
  
}

export default App;




function LoginPage(props){

  const [loginFailed, setLoginFailed] = useState(false)
  const [serverMessage, setServerMessage] = useState()

  function handleSubmit(event) {
    event.preventDefault();
    const data = new FormData(event.target);
    
    fetch('/test-login', {
      method: 'POST',
      body: data,
    }).then(response =>{
      if(response.status == 401){
        setLoginFailed(true);
        
      }else if (response.status==200){
        window.location.replace("/novo")
      }
      return response.text()
    }).then(text=>{
      setServerMessage(text)
      console.log(text)
    }
    );
    

  }

  return(
      <div className="login-page">
        <div className="login-box">
          <h1>Login</h1>
          <div className="login-form-container">
            <form onSubmit={handleSubmit}>
              <input className="form-input" type="email" name="email" placeholder="Email"/>
              <input className="form-input" type="password" name="password" placeholder="Senha"/>
              {loginFailed? <p className="login-failed-warning">{serverMessage}</p>: ""}

              <input type="submit" value="Entrar"/>
              <a href="/register">Ou cadastre-se aqui</a>
            </form>
          </div>
          </div>
      </div>
  )
}


function SignUpPage(props){

  const [registerFailed, setRegisterFailed] = useState(false)
  const [serverMessage, setServerMessage] = useState()

  function handleSubmit(event) {
    event.preventDefault();
    const data = new FormData(event.target);
    
    fetch('/registrar2', {
      method: 'POST',
      body: data,
    }).then(response =>{
      if(response.status == 401){
        setRegisterFailed
    (true);
        
      }else if (response.status==200){
        window.location.replace("/login")
      }
      return response.text()
    }).then(text=>{
      setServerMessage(text)
      console.log(text)
    }
    );
    

  }

  return(
      <div className="login-page">
        <div className="login-box">
          <h1>Registrar</h1>
          <div className="login-form-container">
            <form onSubmit={handleSubmit}>
              <input className="form-input" type="name" name="name" placeholder="Nome"/>
              <input className="form-input" type="email" name="email" placeholder="Email"/>
              <input className="form-input" type="password" name="password" placeholder="Senha"/>
              <input className="form-input" type="password" name="confirm_password" placeholder="Confirmar senha"/>
              {registerFailed? <p className="login-failed-warning">{serverMessage}</p>: ""}

              <input type="submit" value="Registrar"/>

            </form>
          </div>
          </div>
      </div>
  )
}

class AdminPanel extends React.Component {

  constructor(props){
    super(props)
    this.state = {showModal: false,
      titles : {"Número":"id", "Produto":"name", "Preço":"price"},
      ordersTodayTitles : {"Número":"id", "Cliente":"name", "Total":"total"},
      activeTab: "t1",
      actions : [{type: "button", value: "Adicionar", action: this.b.bind(this)}],
      pricesActions: [{type: "checkbox", value: "",  action: this.checkboxClick.bind(this)}],
      ordersToday:[{"id": "1", "total":"10", "name":"Angelina"}, 
                    {"id": "2", "total":"70", "name":"Brad"}, 
                    {"id": "3", "total":"80", "name":"Mariah"},
                    {"id": "4", "total":"80", "name":"Beyoncé"},
                    {"id": "5", "total":"80", "name":"Rihana"},
                    {"id": "6", "total":"80", "name":"Selena"}],

      contents: [{"id": "1", "price":"10", "name":"Banana"}, 
                  {"id": "2", "price":"70", "name":"Batata"}, 
                  {"id": "3", "price":"80", "name":"Alface"},
                  {"id": "4", "price":"80", "name":"Chuchu"},
                  {"id": "5", "price":"80", "name":"Beteraba"},
                  {"id": "6", "price":"80", "name":"Maçã"}]
      }
  }

  componentDidMount(){
    fetch('/pedido/get-list')
    .then(response => {return response.json()})
    .then(data =>this.setState({ contents: Object.values(data) }));
  }

  

  closeModal(){
    this.setState({showModal: false});
  }

  tabClick(tab){
    this.setState({activeTab: tab})
  }

  checkboxClick(e){
    console.log(e)
  }

  b(y, x){
    this.setState({showModal : this.state.showModal ? false : true});
    alert("Clicked " + x.name)
    console.log(y)
    console.log(x)
    
  }

  render(){
    return(
      <div>
      <Modal showModal={this.state.showModal} 
            closeEvent={this.closeModal.bind(this)}
            title="Pedido"
            footerText="Valor"
            buttonText="Confirmar">
      
        <Table titles={this.state.titles} contents={this.state.contents}/>
      </Modal>
  
      <TabRow>
        <Tab tab="t1" activeTab={this.state.activeTab} onClick={this.tabClick.bind(this)}>Hoje</Tab>
        <Tab tab="t2" activeTab={this.state.activeTab} onClick={this.tabClick.bind(this)}>Histórico</Tab>
        <Tab tab="t3" activeTab={this.state.activeTab} onClick={this.tabClick.bind(this)}>Preços</Tab>
        <Tab tab="t4" activeTab={this.state.activeTab} onClick={this.tabClick.bind(this)}>Clientes</Tab>
      </TabRow>
  
      <TabContent tab="t1" activeTab={this.state.activeTab}>
        <div className="page_content">
          <Table titles={this.state.ordersTodayTitles} contents={this.state.ordersToday} actions={this.state.actions}/>
        </div>
      </TabContent>
  
      <TabContent tab="t2" activeTab={this.state.activeTab}>
        Aloo tab 2
      </TabContent>
  
      <TabContent tab="t3" activeTab={this.state.activeTab}>
        <Table titles={this.state.titles} contents={this.state.contents} actions={this.state.pricesActions}/>
      </TabContent>
    </div>
  
    )
  }
}

class NewOrderPage extends React.Component {

  constructor(props){
    super(props)
    this.state = {tableTitles: {"Número":"id", "Produto":"name", "Preço":"price", "Unidade":"unit"},
                  tableActions: [{type: "button", value: "Adicionar", action: this.addToCart.bind(this)}],
                  cartTitles: {"Número":"id", "Produto":"name", "Unidade":"unit", "Preço":"price", "Quantidade":"quant", "Subtotal":"total"},
                  cartActions: [{type: "button", value: "Remover", action: this.removeFromCart.bind(this)}],
                  tableCart: [],
                  tableContent: []

    }
  }

  
  componentDidMount() {
      fetch('/pedido/get-list')  
      .then(response => {return response.json()})
      .then(data => this.setState({tableContent: data}))
  }
 
  addToCart(e, item){

    let alreadyExists = this.state.tableCart.some((el) => {return el.id == item.id})

    if(alreadyExists){
      alert("Já adicionado")
    }
    else{
      //alert(JSON.stringify(item))
      let tempArray = this.state.tableCart
      item.quant = prompt("Digite a quantidade")
      item.total = item.quant*item.price
      tempArray.push(item)
      this.setState({tableCart: tempArray})
      console.log(tempArray) 
      console.log(this.state.tableCart)
 
    }
  }

  removeFromCart(e, item){
    let tempArray = this.state.tableCart.filter(element => {console.log(element.id, item.id, (element.id !== item.id)); return element.id != item.id})
    this.setState({tableCart: tempArray})
    console.log(tempArray)
    console.log(this.state.tableCart)
  }

  cartReducer(total, current){
    return total += current.total
  }

  postOrder(order){
    let post_data = {'order':{'items':order, 'total': order.reduce(this.cartReducer, 0)}}
    
    fetch('/save-order', {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'},  
      method: 'POST',
      body: JSON.stringify(post_data),
    }).then(response => alert(JSON.stringify(response)));
    
  }

   
   availableTableRowFormat(row){
    let newRow = {...row}
    newRow.price = formatMoney(newRow.price)

    return newRow
  }

  cartTableRowFormat(row){
    let newRow = {...row}
    newRow.price = formatMoney(newRow.price)
    newRow.total = formatMoney(newRow.total)


    return newRow
  }

  render(){

    let totalValue = this.state.tableCart.reduce(this.cartReducer, 0)
    
    return(
    <div className="new-orders-page-container">
      <div className="available-products-container">
        <div className="available-filter-box">
          <input type="text"/>
          <input type="button" value="Todos"/>
          <input type="button" value="Fruta"/>
          <input type="button" value="Legume"/>
          <input type="button" value="Verdura"/>
          <input type="button" value="Ovo"/>
        </div>

        <div>
          <h2>Disponíveis</h2>

          <Table 
            titles={this.state.tableTitles} 
            contents={this.state.tableContent} 
            actions={this.state.tableActions}
            preDisplay={this.availableTableRowFormat.bind(this)}/>

        </div> 
      
        <div style={{display: this.state.tableCart.length? "block" : "none"}}>
          <h2>Carrinho</h2>

          <Table 
            titles={this.state.cartTitles} 
            contents={this.state.tableCart} 
            actions={this.state.cartActions}
            preDisplay={this.cartTableRowFormat}/>

          <div className="cart-footer">
            <p>R$ {formatMoney(totalValue)}</p>
            <button onClick={() => this.postOrder(this.state.tableCart)}>Concluir</button>
          </div>
        </div>
      </div>
    </div> 
  )
    }
}
