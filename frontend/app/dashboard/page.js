// import { getServerSession } from "next-auth";
// import { authOptions } from "../api/auth/[...nextauth]/route";
// import { redirect } from "next/navigation";
import DashboardClient from "./DashboardClient/page";

export default async function DashboardPage() {
  
  return <DashboardClient />;
}
