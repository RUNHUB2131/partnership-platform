import { Routes, Route } from 'react-router-dom';
import { DashboardShell } from './dashboard-shell';
import { WelcomeScreen } from './welcome-screen';
import { OpportunityList } from './opportunity-list';
import { ApplicationList } from './application-list';
import { ProfileForm } from './profile-form';
import { MessagesView } from './messages-view';
import { SettingsView } from './settings-view';
import { RunClubStats } from './run-club-stats';

export function ClubDashboard() {
  return (
    <DashboardShell>
      <Routes>
        <Route path="/" element={<WelcomeScreen />} />
        <Route path="opportunities" element={<OpportunityList />} />
        <Route path="applications" element={<ApplicationList />} />
        <Route path="profile" element={<ProfileForm type="club" />} />
        <Route path="messages" element={<MessagesView />} />
        <Route path="settings" element={<SettingsView />} />
      </Routes>
    </DashboardShell>
  );
}