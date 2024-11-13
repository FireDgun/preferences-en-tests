import "./App.css";
import { BrowserRouter } from "react-router-dom";
import Layout from "./layout/Layout";
import Router from "./routes/Router";
import { UserProvider } from "./providers/UserProvider";
import { StageTwoProvider } from "./providers/StageTwoProvider";
import PreventFromSmallScreenProvider from "./providers/PreventFromSmallScreenProvider";
import ShowBlackScreenForPeriodOfTimeProvider from "./providers/ShowBlackScreenForPeriodOfTimeProvider";

function App() {
  return (
    <BrowserRouter>
      <UserProvider>
        <StageTwoProvider>
          <ShowBlackScreenForPeriodOfTimeProvider>
            <PreventFromSmallScreenProvider>
              <Layout>
                <Router />
              </Layout>
            </PreventFromSmallScreenProvider>
          </ShowBlackScreenForPeriodOfTimeProvider>
        </StageTwoProvider>
      </UserProvider>
    </BrowserRouter>
  );
}

export default App;
