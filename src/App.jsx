import AppRoutes from "./routes/AppRoutes";
import TraderProfileDrawer from "./components/TraderProfileDrawer";
import ToastViewport from "./components/ToastViewport";
import DemoUnlockModal from "./components/DemoUnlockModal";
import OfferSelectionModal from "./components/OfferSelectionModal";
import { RelayProvider } from "./context/RelayContext";

function App() {
  return (
    <RelayProvider>
      <AppRoutes />
      <TraderProfileDrawer />
      <ToastViewport />
      <DemoUnlockModal />
      <OfferSelectionModal />
    </RelayProvider>
  );
}

export default App;
