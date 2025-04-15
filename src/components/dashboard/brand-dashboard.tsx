import { Routes, Route } from 'react-router-dom';
import { DashboardShell } from './dashboard-shell';
import { WelcomeScreen } from './welcome-screen';
import { OpportunityForm } from './opportunity-form';
import { OpportunityList } from './opportunity-list';
import { ApplicationList } from './application-list';
import { ProfileForm } from './profile-form';
import { MessagesView } from './messages-view';
import { SettingsView } from './settings-view';

export function BrandDashboard() {
  return (
    <DashboardShell>
      <Routes>
        <Route path="/" element={<WelcomeScreen />} />
        <Route path="opportunities" element={<OpportunityList />} />
        <Route path="opportunities/new" element={<OpportunityForm />} />
        <Route path="applications" element={<ApplicationList />} />
        <Route path="profile" element={<ProfileForm type="brand" />} />
        <Route path="messages" element={<MessagesView />} />
        <Route path="settings" element={<SettingsView />} />
      </Routes>
    </DashboardShell>
  );
}