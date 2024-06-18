import { useContext, useEffect } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';

import PageTitle from './components/PageTitle';
import SignIn from './pages/Authentication/SignIn';
import Clients from './pages/Clients';
import Chart from './pages/Chart';
import ECommerce from './pages/Dashboard/ECommerce';
import FormElements from './pages/Form/FormElements';
import FormLayout from './pages/Form/FormLayout';
import Products from './pages/Product/Products';
import Tables from './pages/Tables';
import Alerts from './pages/UiElements/Alerts';
import Buttons from './pages/UiElements/Buttons';
import AuthContext from './store/AuthContext';
import AllProducts from './pages/Product/AllProducts';
import Category from './pages/Product/Category';
import NewQuotation from './pages/Quotation/NewQuotation';
import Quotation from './pages/Quotation/Quotation';
import NewInvoice from './pages/Invoice/NewInvoice';
import Invoice from './pages/Invoice/Invoice';
import NewChallan from './pages/Challan/NewChallan';
import Challan from './pages/Challan/Challan';
import NewBrochure from './pages/Brochure/NewBrochure';
import Brochure from './pages/Brochure/Brochure';
import ProductDetails from './pages/Product/ProductDetails';
import EditProduct from './pages/Product/EditProduct';

function App() {
  const authCtx = useContext(AuthContext)
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <>
      <Routes>
        <Route
          index
          element={authCtx.isLoggedIn ?
            <>
              <PageTitle title="Dashboard | Saraff Creations" />
              <ECommerce />
            </> : <Navigate to="/signin" />}
        />
        <Route
          path="/clients"
          element={
            <>
              <PageTitle title="Clients | Saraff Creations" />
              <Clients />
            </>
          }
        />
        <Route
          path="/forms/form-elements"
          element={
            <>
              <PageTitle title="Form Elements | Saraff Creations" />
              <FormElements />
            </>
          }
        />
        <Route
          path="/forms/form-layout"
          element={
            <>
              <PageTitle title="Form Layout | Saraff Creations" />
              <FormLayout />
            </>
          }
        />
        <Route
          path="/tables"
          element={
            <>
              <PageTitle title="Tables | Saraff Creations" />
              <Tables />
            </>
          }
        />
        <Route
          path="/products/new"
          element={
            <>
              <PageTitle title="New Product | Saraff Creations" />
              <Products />
            </>
          }
        />
        <Route
          path="/products/all"
          element={
            <>
              <PageTitle title="All Product | Saraff Creations" />
              <AllProducts />
            </>
          }
        />
        <Route
          path="/products/categories"
          element={
            <>
              <PageTitle title="Categories | Saraff Creations" />
              <Category />
            </>
          }
        />
         <Route
          path="product/detail/:id"
          element={
            <>
              <PageTitle title="Product Details | Saraff Creations" />  
              <ProductDetails />
            </>
          }
        />
         <Route
          path="product/edit/:id"
          element={
            <>
              <PageTitle title="Product Details | Saraff Creations" />  
              <EditProduct/>
            </>
          }
        />
        <Route
          path="/quotations/new"
          element={
            <>
              <PageTitle title="New Quotation | Saraff Creations" />
              <NewQuotation />
            </>
          }
        />
        <Route
          path="/quotations/all"
          element={
            <>
              <PageTitle title="All Quotations | Saraff Creations" />
              <Quotation />
            </>
          }
        />
        <Route
          path="/invoices/new"
          element={
            <>
              <PageTitle title="New Invoice | Saraff Creations" />
              <NewInvoice />
            </>
          }
        />
        <Route
          path="/invoices/all"
          element={
            <>
              <PageTitle title="All Invoices | Saraff Creations" />
              <Invoice />
            </>
          }
        />
        <Route
          path="/challans/new"
          element={
            <>
              <PageTitle title="New Challan | Saraff Creations" />
              <NewChallan />
            </>
          }
        />
        <Route
          path="/challans/all"
          element={
            <>
              <PageTitle title="All Challans | Saraff Creations" />
              <Challan />
            </>
          }
        />
        <Route
          path="/brochures/new"
          element={
            <>
              <PageTitle title="New Brochure | Saraff Creations" />
              <NewBrochure />
            </>
          }
        />
        <Route
          path="/brochures/all"
          element={
            <>
              <PageTitle title="All Brochures | Saraff Creations" />
              <Brochure />
            </>
          }
        />
        <Route
          path="/chart"
          element={
            <>
              <PageTitle title="Basic Chart | Saraff Creations" />
              <Chart />
            </>
          }
        />
        <Route
          path="/ui/alerts"
          element={
            <>
              <PageTitle title="Alerts | Saraff Creations" />
              <Alerts />
            </>
          }
        />
        <Route
          path="/ui/buttons"
          element={
            <>
              <PageTitle title="Buttons | Saraff Creations" />
              <Buttons />
            </>
          }
        />
        <Route
          path="/signin"
          element={
            <>
              <PageTitle title="Signin | Saraff Creations" />
              <SignIn />
            </>
          }
        />
      </Routes>
    </>
  );
}

export default App;
