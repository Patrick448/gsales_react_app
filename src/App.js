import React, { useState, useEffect } from 'react'
import {BrowserRouter as Router, Route, Link, Switch, Redirect} from 'react-router-dom'
import './App.css'
import Navbar from './components/navbar'
import Table from './components/table'
import Modal from './components/modal'
import Tab from './components/tabview/tab'
import TabRow from './components/tabview/tabrow'
import TabContent from './components/tabview/tabcontent'
import {formatMoney, formattedDate} from './utils/util'
import FilterBox from './components/filter_box'
import Protected from './components/protected'



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

                  <div>
                  <Protected>
                    <Navbar title="GreenSales">
                      <a href="/novo">Novo Pedido</a>
                      <a href="/meus-pedidos">Meus Pedidos</a>
                      <a href="/admin">Painel</a>
                      <a href="/novo">Sobre</a>
                      
                    </Navbar> 
                    
                      <Route exact={true} path='/admin' component={AdminPanel}/>
                    
                      <Route exact={true} path='/novo' component={NewOrderPage}/>

                      <Route exact={true} path='/meus-pedidos' component={OrdersPage}/>

                      <Route exact={true} path='/t' render={()=>
                        <h1>Test Route 2</h1>
                        
                      }/>
                    </Protected>
                    </div>
                </Switch>

               
               
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
      if(response.status === 401){
        setRegisterFailed
    (true);
        
      }else if (response.status===200){
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
      ordersTodayTitles : {"Número":"id", "Cliente":"user_name", "Total":"total"},
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
                  {"id": "6", "price":"80", "name":"Maçã"}],
      availableList: [],
      allProducts: [],
      modalContent: [],
      historyFilteredOrders: [],
      modalFooter: [],
      modalHeader: [],
      modalAction: "",
      postSaveStatus: "",
      }
  }

  componentDidMount(){
    this.fetchAvailableList()
    this.fetchTodaysOrders()
    this.fetchAllProducts()
  }

  fetchAvailableList(){
    fetch('/pedido/get-list')
    .then(response => {return response.json()})
    .then(data =>this.setState({ contents: Object.values(data) }));
  }

  fetchTodaysOrders(){
    fetch('/admin_get_orders_today')
    .then(response => {return response.json()})
    .then(data => { this.setState({ordersToday: data})})
  }

  fetchAllProducts(){
    fetch('/get-all-products-full')
    .then(response => {return response.json()})
    .then(data => { this.setState({allProducts: data}) } )
  }

  postChangeOrderStatus(order){

    let post_data = {'order_id': order.id}

    fetch('/set-order-status-verified', {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'},  
      method: 'POST',
      body: JSON.stringify(post_data),
    }).then(response => {alert(JSON.stringify(response)); this.fetchTodaysOrders()});
    
  }

  closeModal(){
    this.setState({showModal: false});
  }

  tabClick(tab){
    this.setState({activeTab: tab})
  }

  checkboxClick(e, product){

    this.setState({postSaveStatus: ""})

    if(e.target.checked){
      product.price = prompt("Digite o preço")

    }
    else{
      product.price = null
    }

    this.forceUpdate()
    console.log(e.target.checked)
  }

  postPrices(list){

    let filteredList = list.filter(item => {return item.price})
    let pricesList = filteredList.map(item => { return {id: item.id, price: item.price} })
    let post_data = {items: pricesList}

    fetch('/set-available', {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'},  
      method: 'POST',
      body: JSON.stringify(post_data),
    }).then(response => {
      if(response.status === 201){
        this.setState({postSaveStatus: "Preços salvos"})
      } 
      });


  }

  b(y, x){
    this.setState({showModal : this.state.showModal ? false : true});
    this.setState({modalContent: x.items})
    this.setState({modalFooter: x.total})
    //alert("Clicked " + x.name)
    console.log(y)
    console.log(x)
    

  }



  orderDetailsToModal(e, order){
    
    this.setState({modalContent: order.items, 
                  modalHeader: order.user_name + " | " + formattedDate(order.timeStamp), 
                  modalFooter: order.total, 
                  showModal : this.state.showModal ? false : true});

  }

verifyOrderDetailsModal(e, order){
    
    this.setState({modalContent: order.items, 
                  modalHeader: order.user_name + " | " + formattedDate(order.timeStamp), 
                  modalFooter: order.total, 
                  showModal : this.state.showModal ? false : true,
                  modalAction: () => this.postChangeOrderStatus(order)});

  } 


  historyFilter(event){ 
    event.preventDefault();
    const data = new FormData(event.target);

    console.log(event.target.time_from.valueAsNumber)

    const dayInMillis = 86400000;
    let timeFrom= event.target.time_from.valueAsNumber
    let timeTo=event.target.time_to.valueAsNumber + dayInMillis
    let customerName = event.target.name.value
    let orderNum = event.target.num.value
   

    fetch(`/admin_get_orders/filter/?time_from=${timeFrom}&time_to=${timeTo}&name=${customerName}&num=${orderNum}`)
    .then(response => {return response.json()})
    .then(data => {this.setState({historyFilteredOrders: data})})
  
  }

  historyTableRowFormat(row){
    let newRow = {...row}
    newRow.total = formatMoney(newRow.total)
    newRow.timeStamp = formattedDate(newRow.timeStamp)

    return newRow

  }

  render(){

    const historyTitles = {"Número":"id", "Data":"timeStamp", "Cliente":"user_name", "Total":"total"}
    const historyActions = [{type: "button", value: "Ver", action: this.orderDetailsToModal.bind(this)}]
    const modalTableTitles = {"Número":"id", "Produto":"name","Quantidade":"quant", "Unidade":"unit", "Preço":"price", "Subtotal":"total"}
    const ordersTodayActions = [{type: "button", value: "Verificar", action: this.verifyOrderDetailsModal.bind(this)}]
    const ordersTodayTitles = {"Número":"id", "Cliente":"user_name", "Total":"total", "Verificado":"status"}
    const pricesActions = [{type: "checkbox", value: "",  action: this.checkboxClick.bind(this)}]

    return(
      <div>
      <Modal showModal={this.state.showModal} 
            closeEvent={this.closeModal.bind(this)}
            title={this.state.modalHeader}
            footerText={"R$ " + formatMoney(this.state.modalFooter)}
            buttonText="Confirmar"
            buttonAction={this.state.modalAction}>
      
        <Table titles={modalTableTitles} contents={this.state.modalContent}/>
      </Modal>
  
      <TabRow>
        <Tab tab="t1" activeTab={this.state.activeTab} onClick={this.tabClick.bind(this)}>Hoje</Tab>
        <Tab tab="t2" activeTab={this.state.activeTab} onClick={this.tabClick.bind(this)}>Histórico</Tab>
        <Tab tab="t3" activeTab={this.state.activeTab} onClick={this.tabClick.bind(this)}>Preços</Tab>
        <Tab tab="t4" activeTab={this.state.activeTab} onClick={this.tabClick.bind(this)}>Clientes</Tab>
      </TabRow>
  
      <TabContent tab="t1" activeTab={this.state.activeTab}>
        <div className="page_content">
          <Table titles={ordersTodayTitles} contents={this.state.ordersToday} actions={ordersTodayActions}/>
        </div>
      </TabContent>
  
      <TabContent tab="t2" activeTab={this.state.activeTab}>
      <div className="page_content">
          <FilterBox>
            <div className="history-filter-container">
              <form onSubmit={(event) => this.historyFilter(event)}>
                <label for="time_from">De</label>
                <input className="filter date-input" type="date" name="time_from"/>

                <label for="time_to">a</label>
                <input className="filter date-input" type="date" name="time_to"/>

                <label for="name">Nome</label>
                <input className="filter text-input" type="text" name="name"/>

                <label for="num">Pedido</label>
                <input className="filter text-input" type="text" name="num"/>

                <input className="filter button" type="submit" value="Filtrar"/>
              </form>
            </div>
          </FilterBox>
          <Table titles={historyTitles} contents={this.state.historyFilteredOrders} actions={historyActions} preDisplay={this.historyTableRowFormat}/>
      </div>
      </TabContent>
  
      <TabContent tab="t3" activeTab={this.state.activeTab}>
        <Table titles={this.state.titles} contents={this.state.allProducts} actions={pricesActions}/>
        <button onClick={() => this.postPrices(this.state.allProducts)}>Salvar Preços</button>
        <span>{this.state.postSaveStatus}</span>
      </TabContent>
    </div>
  
    )
  }
} 

class OrdersPage extends React.Component{

  constructor(props){
    super(props)
    this.state = { 
      showModal: false,
      modalContent: [],
      myOrdersFilteredOrders: [],
      modalFooter: [],
      modalHeader: []
    }
  }

 

  closeModal(){
    this.setState({showModal: false});
  }

  orderDetailsToModal(e, order){
    
    this.setState({modalContent: order.items, 
                  modalHeader: formattedDate(order.timeStamp), 
                  modalFooter: order.total, 
                  showModal : this.state.showModal ? false : true});

  }

  myOrdersFilter(event){
    event.preventDefault();
    const data = new FormData(event.target);

    console.log(event.target.time_from.valueAsNumber)

    const dayInMillis = 86400000;
    let timeFrom= event.target.time_from.valueAsNumber
    let timeTo=event.target.time_to.valueAsNumber + dayInMillis
    let orderNum = event.target.num.value
   

    fetch(`/get_orders/by_date/${timeFrom}+${timeTo}`)
    .then(response => {return response.json()})
    .then(data => {this.setState({myOrdersFilteredOrders: data})})
  
  }

  myOrdersTableRowFormat(row){
    let newRow = {...row}
    newRow.total = formatMoney(newRow.total)
    newRow.timeStamp = formattedDate(newRow.timeStamp)

    return newRow

  }

  modalOrderTableRowFormat(row){
    let newRow = {...row}
    newRow.price = formatMoney(newRow.price)
    newRow.total = formatMoney(newRow.total)


    return newRow
  }

  render(){

    const myOrdersTitles = {"Número":"id", "Data":"timeStamp", "Total":"total"}
    const myOrdersActions = [{type: "button", value: "Ver", action: this.orderDetailsToModal.bind(this)}]
    const modalTableTitles = {"Número":"id", "Produto":"name","Quantidade":"quant", "Unidade":"unit", "Preço":"price", "Subtotal":"total"}

    return(
      <div>
      <Modal showModal={this.state.showModal} 
            closeEvent={this.closeModal.bind(this)}
            title={this.state.modalHeader}
            footerText={"R$ " + formatMoney(this.state.modalFooter)}
            buttonText="Ok">
      
        <Table titles={modalTableTitles} contents={this.state.modalContent} preDisplay={this.modalOrderTableRowFormat}/>

      </Modal>
  
  
      <div className="page_content">
          <FilterBox>
            <div className="history-filter-container">
              <form onSubmit={(event) => this.myOrdersFilter(event)}>
                <label for="time_from">De</label>
                <input className="filter date-input" type="date" name="time_from"/>

                <label for="time_to">a</label>
                <input className="filter date-input" type="date" name="time_to"/>

                <label for="num">Pedido</label>
                <input className="filter text-input" type="text" name="num"/>

                <input className="filter button" type="submit" value="Filtrar"/>
              </form>
            </div>
          </FilterBox>
          <Table titles={myOrdersTitles} contents={this.state.myOrdersFilteredOrders} actions={myOrdersActions} preDisplay={this.myOrdersTableRowFormat}/>
      </div>
      
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
                  tableContent: [],
                  modalContent: [],
                  modalFooter: [],
                  modalHeader: []

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
    }).then(response => {alert(JSON.stringify(response)); window.location.replace("/meus-pedidos")});
    
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

  orderDetailsToModal(e, order){
    
    this.setState({modalContent: order.items, 
                  modalHeader: order.user_name + " | " + formattedDate(order.timeStamp), 
                  modalFooter: order.total, 
                  showModal : this.state.showModal ? false : true});

  }

  closeModal(){
    this.setState({showModal: false});
  }

  render(){

    let totalValue = this.state.tableCart.reduce(this.cartReducer, 0)
    const modalTableTitles = {"Número":"id", "Produto":"name","Quantidade":"quant", "Unidade":"unit", "Preço":"price", "Subtotal":"total"}

    
    return(
    <div className="new-orders-page-container">
       <Modal showModal={this.state.showModal} 
            closeEvent={this.closeModal.bind(this)}
            title="Confirmar pedido"
            footerText={"R$ " + totalValue}
            buttonText="Confirmar"
            buttonAction={() => this.postOrder(this.state.tableCart)}>
      
        <Table titles={modalTableTitles} contents={this.state.tableCart}/>
      </Modal>

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
            <button onClick={(e) => this.orderDetailsToModal(e, this.state.tableCart)}>Concluir</button>
          </div>
        </div>
      </div>
    </div> 
  )
    }
} 
