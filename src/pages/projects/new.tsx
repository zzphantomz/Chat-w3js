import type { NextPage } from 'next';
import { AuthGuard } from '../../components/authentication/auth-guard'; //"../../components/authentication/auth-guard";
import { DashboardLayout } from "../../components/dashboard/dashboard-layout";
import CreatePage from '../../eosweb-systems/pages/projects/new';

const ProjectList: NextPage = () => {

  return <CreatePage />

}

ProjectList.getLayout = page => (
  <AuthGuard>
    <DashboardLayout>
      {page}
    </DashboardLayout>
  </AuthGuard>
);

export default ProjectList;