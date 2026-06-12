
import { BrowserRouter, Routes, Route, useParams, useSearchParams } from "react-router-dom"
import ScrollToTop from "@/components/ScrollToTop"

// LAYOUT
import MainLayout from "@/components/layout/MainLayout"

// ERROR
import ErrorPage from "./pages/ErrorPage"

// HOME
import Home from "./pages/Home"

// AUTH
import Login from "./pages/auth/login"
import Register from "./pages/auth/register"
import ForgotPassword from "./pages/auth/forgot-password"
import ResetPassword from "./pages/auth/reset-password"
import ConfirmPassword from "./pages/auth/ConfirmPassword"
import VerifyEmail from "./pages/auth/verify-email"
import TwoFactorChallenge from "./pages/auth/two-factor-challenge"
import AuthCallback from "./pages/auth/AuthCallback"

// ABONNEMENT
import Abonnement from "./pages/abonnement/Abonnement"
import SubscriptionConfirm from "./pages/abonnement/SubscriptionConfirm"

// CHILDREN
import ChildrenIndex from "./pages/children/ChildrenIndex"
import ChildrenShow from "./pages/children/ChildrenShow"
import ChildrenCreate from "./pages/children/ChildrenCreate"
import ChildrenEdit from "./pages/children/ChildrenEdit"
import ChildrenGuardian from "./pages/children/ChildGuardian"

// GROUPS
import GroupsIndex from "./pages/groups/GroupIndex"
import GroupShow from "./pages/groups/GroupShow"
import GroupsCreate from "./pages/groups/GroupCreate"
import GroupsEdit from "./pages/groups/GroupsEdit"
import GroupAddChild from "./pages/groups/GroupAddChild"
import GroupRemoveChild from "./pages/groups/GroupRemoveChild"
import GroupAddActivity from "./pages/groups/GroupAddActivity"

// GUARDIANS
import GuardianIndex from "./pages/guardian/GuardianIndex"
import GuardianShow from "./pages/guardian/GuardianShow"
import GuardianCreate from "./pages/guardian/GuardianCreate"
import GuardianEdit from "./pages/guardian/GuardianEdit"
import GuardianAddChild from "./pages/guardian/GuardianAddChild"
import GuardianRemoveChild from "./pages/guardian/GuardianRemoveChild"

// PLANNINGS
import PlanningIndex from "./pages/plannings/PlanningIndex"
import PlanningShow from "./pages/plannings/PlanningShow"
import PlanningCreate from "./pages/plannings/PlanningCreate"
import PlanningEdit from "./pages/plannings/PlanningEdit"
import PlanningDelete from "./pages/plannings/PlanningDelete"

// PAYMENTS
import PaymentSuccess from "./pages/Payments/PaymentSuccess"
import PaymentFailed from "./pages/Payments/PaymentFailed"

// SETTINGS
import Profil from "./pages/settings/profile"
import Security from "./pages/settings/security"
import Apparence from "./pages/settings/apparence"

// AUTRES
import About from "./pages/About"
import Contacta from "./pages/Contact"
import Fonctionnalites from "./pages/Fonctionnalites"
import Faq from "./pages/Faq"
import MentionsLegalesPage from "./pages/Legal"
import Historique from "./pages/Historique"
import MesAchats from "./pages/MesAchats"
import Dashboard from "./pages/Dashboard"
import PacksPage from "./pages/packs/Packs"
import PackDetail from "./pages/packs/PackDetail"
import MesActivites from "./pages/activities/MesActivites"
import ActivityDetailPack from "./pages/activities/ActivityDetailPack"
import ActivityShow from "./pages/activities/ActivityShow"
import ActivityCreate from "./pages/activities/ActivityCreate"
import ActivityEdit from "./pages/activities/ActivityEdit"
import BibliothequeIndex from "./pages/bibliotheque/BibliothequeIndex"
import BibliothequeActivityDetail from "./pages/bibliotheque/BibliothequeActivityDetail"
import ConfidentialitePage from "./pages/Confidentialite"
import CGUPage from "./pages/CGU"
import CartPage from "./pages/panier/CartPage"

// RESET PASSWORD ROUTE
function ResetPasswordRoute() {
  const { token = "" } = useParams()
  const [searchParams] = useSearchParams()

  return (
    <ResetPassword
      token={token}
      email={searchParams.get("email") ?? ""}
    />
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>

        {/* AUTH (pas de MainLayout ici) */}
        <Route path="/login" element={<Login canResetPassword={true} canRegister={true} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPasswordRoute />} />
        <Route path="/reset-password/:token" element={<ResetPasswordRoute />} />
        <Route path="/confirm-password" element={<ConfirmPassword />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/two-factor-challenge" element={<TwoFactorChallenge />} />
        <Route path="/auth/callback" element={<AuthCallback />} />

        {/* LAYOUT GLOBAL (public + privé) */}
        <Route element={<MainLayout />}>

          {/* HOME */}
          <Route path="/" element={<Home />} />

          {/* DASHBOARD */}
          <Route path="/dashboard" element={<Dashboard />} />

          {/* ABONNEMENT */}
          <Route path="/abonnements" element={<Abonnement />} />
          <Route path="/abonnement/confirm" element={<SubscriptionConfirm />} />

          {/* CHILDREN */}
          <Route path="/children" element={<ChildrenIndex />} />
          <Route path="/children/create" element={<ChildrenCreate />} />
          <Route path="/children/:id" element={<ChildrenShow />} />
          <Route path="/children/:id/edit" element={<ChildrenEdit />} />
          <Route path="/children/:id/guardians" element={<ChildrenGuardian />} />

          {/* GROUPS */}
          <Route path="/groups" element={<GroupsIndex />} />
          <Route path="/groups/create" element={<GroupsCreate />} />
          <Route path="/groups/:id" element={<GroupShow />} />
          <Route path="/groups/:id/edit" element={<GroupsEdit />} />
          <Route path="/groups/:id/add-child" element={<GroupAddChild />} />
          <Route path="/groups/:id/remove-child" element={<GroupRemoveChild />} />
          <Route path="/groups/:id/add-activity" element={<GroupAddActivity />} />

          {/* GUARDIANS */}
          <Route path="/guardians" element={<GuardianIndex />} />
          <Route path="/guardians/create" element={<GuardianCreate />} />
          <Route path="/guardians/:id" element={<GuardianShow />} />
          <Route path="/guardians/:id/edit" element={<GuardianEdit />} />
          <Route path="/guardians/:id/add-child" element={<GuardianAddChild />} />
          <Route path="/guardians/:id/remove-child" element={<GuardianRemoveChild />} />

          {/* PLANNINGS */}
          <Route path="/plannings" element={<PlanningIndex />} />
          <Route path="/plannings/create" element={<PlanningCreate />} />
          <Route path="/plannings/:id" element={<PlanningShow />} />
          <Route path="/plannings/:id/edit" element={<PlanningEdit />} />
          <Route path="/plannings/:id/delete" element={<PlanningDelete />} />

          {/* ACTIVITÉS */}
          <Route path="/activities" element={<MesActivites />} />
          <Route path="/activities/create" element={<ActivityCreate />} />
          <Route path="/activities/:id" element={<ActivityShow />} />
          <Route path="/activities/:id/edit" element={<ActivityEdit />} />
          <Route path="/activities/pack/:idactivities" element={<ActivityDetailPack />} />
          <Route path="/library" element={<BibliothequeIndex />} />
          <Route path="/library/:id" element={<BibliothequeActivityDetail />} />
          <Route path="/calendar" element={<PlanningIndex />} />

          {/* PACKS */}
          <Route path="/packs" element={<PacksPage />} />
          <Route path="/packs/:idpack" element={<PackDetail />} />

          {/* PANIER */}
          <Route path="/panier" element={<CartPage />} />

          {/* SETTINGS */}
          <Route path="/settings" element={<Profil />} />
          <Route path="/settings/profil" element={<Profil />} />
          <Route path="/settings/security" element={<Security />} />
          <Route path="/settings/apparence" element={<Apparence />} />

          {/* AUTRES */}
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contacta />} />
          <Route path="/fonctionnalites" element={<Fonctionnalites />} />
          <Route path="/faq" element={<Faq />} />
          <Route path="/legal" element={<MentionsLegalesPage />} />
          <Route path="/historique" element={<Historique />} />
          <Route path="/mes-achats" element={<MesAchats />} />
          <Route path="/Confidentialite" element={<ConfidentialitePage />} />
          <Route path="/CGU" element={<CGUPage />} />

          {/* 404 */}
          <Route path="*" element={<ErrorPage />} />

          <Route path="/payment/success" element={<PaymentSuccess />} />
          <Route path="/payment/failed" element={<PaymentFailed />} />

        </Route>
      </Routes>
    </BrowserRouter>
  )
}
