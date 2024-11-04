import { ThemeProvider } from "@/components/theme-provider"
import Navbar from "./components/navbar"
import { Routes, Route, Navigate } from "react-router-dom"
import { RouteSList } from "./Routes"
import Dashboard from "./components/appComponents/Dashboard"
import MyTeam from "./components/appComponents/MyTeam"
import Products from "./components/appComponents/Products"
import Payout from "./components/appComponents/Payout"
import Activation from "./components/appComponents/Activation"
import Login from "./components/appComponents/Login"
import Register from "./components/appComponents/Register"
import { Toaster } from "@/components/ui/toaster"
import RewardsPage from "./components/appComponents/Reward"
import NotFound from "./components/appComponents/NotFound"
import useAuthInterceptor from "./hooks/useAuthInterceptor"
import { ResetPassword } from "./components/appComponents/ResetPassword"


function App() {

  useAuthInterceptor()

  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <Navbar />
      <Toaster />
      <Routes>
        <Route path="/" element={<Navigate to={RouteSList.home} />} />
        <Route path={RouteSList.dashboard} element={<Dashboard />} />
        <Route path={RouteSList.myTeam} element={<MyTeam />} />
        <Route path={RouteSList.products} element={<Products />} />
        <Route path={RouteSList.reward} element={<RewardsPage />} />
        <Route path={RouteSList.payouts} element={<Payout />} />
        <Route path={RouteSList.activation} element={<Activation />} />
        <Route path={RouteSList.register} element={<Register />} />
        <Route path={RouteSList.login} element={<Login />} />
        <Route path={RouteSList.resetPassword} element={<ResetPassword/>}/>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </ThemeProvider>
  )
}

export default App