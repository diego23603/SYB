import { Switch, Route } from "wouter";
import Products from "@/pages/Products";
import EditProduct from "@/pages/EditProduct";

function App() {
  return (
    <Switch>
      <Route path="/" component={Products} />
      <Route path="/products/new" component={EditProduct} />
      <Route path="/products/:id/edit" component={EditProduct} />
    </Switch>
  );
}

export default App;
