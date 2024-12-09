import { AuthContextProvider } from "./_utils/auth-context";
import LandingPage from "./components/landingPage";

export default function Home() {
  return (
<AuthContextProvider>
  <LandingPage/>
</AuthContextProvider>
   
  );
}
