import { Navigate, RouterProvider, createBrowserRouter } from "react-router-dom"
import { AppLayout } from "@/app/layout"
import { MyChildScreen } from "@/modules/child/screens/MyChildScreen"

const router = createBrowserRouter([
  { path: "/", element: <Navigate to="/my-child" replace /> },
  {
    path: "/my-child",
    element: <AppLayout />,
    children: [
      { index: true, element: <MyChildScreen initialTab="attendance" /> },
      { path: "attendance", element: <MyChildScreen initialTab="attendance" /> },
      { path: "timetable", element: <MyChildScreen initialTab="timetable" /> },
      { path: "exams", element: <MyChildScreen initialTab="exams" /> },
      { path: "badges", element: <MyChildScreen initialTab="badges" /> },
      { path: "learn", element: <MyChildScreen initialTab="learn" /> },
    ],
  },
])

export function AppRouter() {
  return <RouterProvider router={router} />
}
