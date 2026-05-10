import { redirect } from 'next/navigation';

function AppPage() {
  // Redirect to home by default
  redirect('/home');
}

export default AppPage
