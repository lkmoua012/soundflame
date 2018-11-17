export default <Router history={hashHistory}>
  <Route path="/" component={App}>
    <IndexRoute component={App}/>
    <Route path="demo" component={App}/>
  </Route>
</Router>