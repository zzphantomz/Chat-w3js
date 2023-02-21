import type { NextPage } from 'next';
import { AuthGuard } from '../../components/authentication/auth-guard'; //"../../components/authentication/auth-guard";
import { DashboardLayout } from "../../components/dashboard/dashboard-layout";
import ListPage from '../../eosweb-systems/pages/privileges/list';

const PrivilegesList: NextPage = () => {

  return <ListPage />

}

PrivilegesList.getLayout = page => (
  <AuthGuard>
    <DashboardLayout>
      {page}
    </DashboardLayout>
  </AuthGuard>
);

export default PrivilegesList;