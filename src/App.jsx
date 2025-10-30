import { Provider } from 'react-redux';
import { store } from './store/store';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor } from './store/store';
import AppRoute from './routes/route';
import { NotificationProvider } from './context/NotificationProvider';

const App = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <NotificationProvider>
          <AppRoute />
        </NotificationProvider>
      </PersistGate>
    </Provider>
  );
};
export default App;
