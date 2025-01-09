import { ThemeProvider } from "@/components/theme-provider"
import Navbar from "./components/navbar"
import { Routes, Route } from "react-router-dom"
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
import Profile from "./components/appComponents/Profile"
import Homepage from "./components/appComponents/Homepage"
import BackgroundLogo from "./components/appComponents/BackgroundLogo"
import WelcomePage from "./components/appComponents/Welcome"
import FundManagement from "./components/appComponents/FundManagement"


function App() {

  useAuthInterceptor()


  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <BackgroundLogo>
      <Navbar />
      <Toaster />
      <Routes>
        <Route path="/" element={<Homepage/>} />
        <Route path={RouteSList.dashboard} element={<Dashboard />} />
        <Route path={RouteSList.myTeam} element={<MyTeam />} />
        <Route path={RouteSList.products} element={<Products />} />
        <Route path={RouteSList.reward} element={<RewardsPage />} />
        <Route path={RouteSList.payouts} element={<Payout />} />
        <Route path={RouteSList.activation} element={<Activation />} />
        <Route path={RouteSList.register} element={<Register />} />
        <Route path={RouteSList.login} element={<Login />} />
        <Route path={RouteSList.resetPassword} element={<ResetPassword/>}/>
        <Route path={RouteSList.Profile} element={<Profile/>} />
        <Route path={RouteSList.welcome} element={<WelcomePage/>} />
        <Route path={RouteSList.fundManagement} element={<FundManagement />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      </BackgroundLogo>
    </ThemeProvider>
  )
}

export default App