import type { NextPage } from 'next';
import { AuthGuard } from '../../../components/authentication/auth-guard'; //"../../components/authentication/auth-guard";
import { DashboardLayout } from "../../../components/dashboard/dashboard-layout";
import DetailPage from '../../../eosweb-systems/pages/projects/detail';

const ProjectList: NextPage = () => {

  return <DetailPage />

}

ProjectList.getLayout = page => (
  <AuthGuard>
    <DashboardLayout>
      {page}
    </DashboardLayout>
  </AuthGuard>
);

export default ProjectList;