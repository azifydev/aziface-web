import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './services';
import { useUser } from './hooks';
import { Unless, When } from 'react-if';
import { Home } from './screens/home';
import { Login } from './screens/login';
function App() {
  const { tokenBiometric, token } = useUser();
  const isAuth = !!token && !!tokenBiometric;
  return (
    <QueryClientProvider client={queryClient}>
      <When condition={isAuth}>
        <Home />
      </When>
      <Unless condition={isAuth}>
        <Login />
      </Unless>
    </QueryClientProvider>
  );
}
export default App;
