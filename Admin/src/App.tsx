import { Toaster } from "@/components/ui/toaster"
import { Route, Routes } from "react-router-dom"
import { RouteSList } from "./Routes"
import UserPayoutManagenent from "./components/appComponent/UserPayoutManagement"
import AdminDashboard from "./components/appComponent/Dashboard"
import ProductManagement from "./components/appComponent/ProductManagement"
import OrderManagement from "./components/appComponent/OrderManagement"
import UserManagement from "./components/appComponent/UserManagement"
import ActivationCodeGenerator from "./components/appComponent/ActivationCodeGenerator"
import { ResetPassword } from "./components/appComponent/ResetPassword"
import Login from "./components/appComponent/Login"
import Register from "./components/appComponent/Register"
import NotFound from "./components/appComponent/NotFound"
import Navbar from "./components/appComponent/navbar"
import useAuthInterceptor from "./hooks/useAuthInterceptor"


export default function App() {
  useAuthInterceptor()
  return (
    <div>
    <Navbar />
    <Toaster />
    <Routes>
      <Route path={RouteSList.home} element={<AdminDashboard/>} />
      <Route path={RouteSList.orders} element={<OrderManagement />} />
      <Route path={RouteSList.products} element={<ProductManagement />} />
      <Route path={RouteSList.users} element={<UserManagement />} />
      <Route path={RouteSList.payouts} element={<UserPayoutManagenent/>} />

      <Route path={RouteSList.activation} element={<ActivationCodeGenerator />} />
      {/* <Route path={RouteSList.registerNewAdmin} element={<Register />} /> */}
      <Route path={RouteSList.login} element={<Login />} />
      {/* <Route path={RouteSList.resetPassword} element={<ResetPassword/>}/> */}
      <Route path="*" element={<NotFound />} />
    </Routes>
    </div>
  )
}