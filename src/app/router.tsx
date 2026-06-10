import { Navigate, RouterProvider, createBrowserRouter } from "react-router-dom"
import { AppLayout } from "@/app/layout"
import { ConnectScreen } from "@/modules/connect/screens/ConnectScreen"
import { MyChildScreen } from "@/modules/child/screens/MyChildScreen"
import { ComingSoonScreen } from "@/shared/screens/ComingSoonScreen"

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { index: true, element: <Navigate to="/my-child" replace /> },
      { path: "home", element: <ComingSoonScreen title="Home" /> },
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
])

export function AppRouter() {
  return <RouterProvider router={router} />
}
