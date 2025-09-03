import ParentLayout from '@/Layouts/ParentLayout';
import { Head, usePage } from '@inertiajs/react';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import DeleteUserForm from './Partials/DeleteUserForm';

export default function ParentProfileEdit({ mustVerifyEmail, status }) {
  const { auth } = usePage().props;
  return (
    <ParentLayout
      header={<h2 className="text-xl font-semibold text-gray-800">Mi perfil</h2>}
    >
      <Head title="Mi perfil" />
      <div className="mx-auto max-w-7xl p-6 space-y-6">
        <div className="rounded-lg border border-orange-100 bg-white p-4 shadow sm:p-8">
          <UpdateProfileInformationForm
            mustVerifyEmail={mustVerifyEmail}
            status={status}
            className="max-w-xl"
          />
        </div>
        <div className="rounded-lg border border-orange-100 bg-white p-4 shadow sm:p-8">
          <UpdatePasswordForm className="max-w-xl" />
        </div>
        <div className="rounded-lg border border-orange-100 bg-white p-4 shadow sm:p-8">
          <DeleteUserForm className="max-w-xl" />
        </div>
      </div>
    </ParentLayout>
  );
}
