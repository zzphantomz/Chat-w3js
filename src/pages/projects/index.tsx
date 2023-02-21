import type { NextPage } from 'next';
import { AuthGuard } from '../../components/authentication/auth-guard'; //"../../components/authentication/auth-guard";
import { DashboardLayout } from "../../components/dashboard/dashboard-layout";
import ListPage from '../../eosweb-systems/pages/projects/list';

const ProjectList: NextPage = () => {

  return <ListPage />

}

ProjectList.getLayout = page => (
  <AuthGuard>
    <DashboardLayout>
      {page}
    </DashboardLayout>
  </AuthGuard>
);

export default ProjectList;