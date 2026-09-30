import { Navigate, RouterProvider, createBrowserRouter, useParams } from "react-router-dom"
import { AppLayout } from "@/app/layout"
import { ConnectScreen } from "@/modules/connect/screens/ConnectScreen"
import { MyChildScreen } from "@/modules/child/screens/MyChildScreen"
import { FeesScreen } from "@/modules/fees/screens/FeesScreen"
import { HomeScreen } from "@/modules/home/screens/HomeScreen"
import { RolloverChildScreen } from "@/modules/fees/rollover/screens/RolloverChildScreen"
import { RolloverDeclarationScreen } from "@/modules/fees/rollover/screens/RolloverDeclarationScreen"
import { RolloverDetailsScreen } from "@/modules/fees/rollover/screens/RolloverDetailsScreen"
import { RolloverLayout } from "@/modules/fees/rollover/screens/RolloverLayout"
import { RolloverParentScreen } from "@/modules/fees/rollover/screens/RolloverParentScreen"
import { ComingSoonScreen } from "@/shared/screens/ComingSoonScreen"

function RolloverDeclarationRoute() {
  const { docId } = useParams()
  // Keyed by docId so each document gets a fresh, unconfirmed consent state.
  return <RolloverDeclarationScreen key={docId} />
}

function RedirectToRolloverDetails() {
  const { childId } = useParams()
  return <Navigate to={`/fees/rollover/${childId}`} replace />
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { index: true, element: <Navigate to="/my-child" replace /> },
      { path: "home", element: <HomeScreen /> },
      { path: "fees", element: <FeesScreen /> },
      { path: "add", element: <ComingSoonScreen title="Add" /> },
      { path: "connect", element: <ConnectScreen /> },
      { path: "profile", element: <ComingSoonScreen title="Profile" /> },
      {
        path: "my-child",
        children: [
          { index: true, element: <MyChildScreen initialTab="attendance" /> },
          { path: "attendance", element: <MyChildScreen initialTab="attendance" /> },
          { path: "timetable", element: <MyChildScreen initialTab="timetable" /> },
          { path: "exams", element: <MyChildScreen initialTab="exams" /> },
          { path: "badges", element: <MyChildScreen initialTab="badges" /> },
          { path: "learn", element: <MyChildScreen initialTab="learn" /> },
        ],
      },
    ],
  },
  {
    path: "/fees/rollover/:childId",
    element: <RolloverLayout />,
    children: [
      { index: true, element: <RolloverDetailsScreen /> },
      { path: "parent", element: <RolloverParentScreen /> },
      { path: "child", element: <RolloverChildScreen /> },
      { path: "declaration", element: <RedirectToRolloverDetails /> },
      { path: "family", element: <RedirectToRolloverDetails /> },
      { path: "children", element: <RedirectToRolloverDetails /> },
      { path: "declaration/:docId", element: <RolloverDeclarationRoute /> },
    ],
  },
])

export function AppRouter() {
  return <RouterProvider router={router} />
}
