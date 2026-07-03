import type { ReactNode } from 'react';
import { APP_TABS, TAB_LABELS, TAB_ICONS } from '../../constants';
import type { ViewTab } from '../../types';
import { IconLogo, IconLogOut } from '../icons/Icons';
import { Button } from '../ui/Button';

type SidebarProps = {
  activeTab: ViewTab;
  onTabChange: (tab: ViewTab) => void;
  onLogout: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
  companyName?: string;
};

export function Sidebar({
  activeTab,
  onTabChange,
  onLogout,
  mobileOpen,
  onMobileClose,
  companyName,
}: SidebarProps) {
  const handleTabClick = (tab: ViewTab) => {
    onTabChange(tab);
    onMobileClose();
  };

  return (
    <>
      {mobileOpen && <div className="sidebar-backdrop" onClick={onMobileClose} aria-hidden="true" />}
      <aside className={`sidebar${mobileOpen ? ' sidebar--open' : ''}`}>
        <div className="sidebar-brand">
          <IconLogo size={32} />
          <div>
            <strong>{companyName ?? 'Your company'}</strong>
          </div>
        </div>

        <nav className="sidebar-nav" aria-label="Main navigation">
          {APP_TABS.map((tab) => {
            const Icon = TAB_ICONS[tab];
            return (
              <button
                key={tab}
                type="button"
                className={`sidebar-nav-item${activeTab === tab ? ' sidebar-nav-item--active' : ''}`}
                onClick={() => handleTabClick(tab)}
                aria-current={activeTab === tab ? 'page' : undefined}
              >
                <Icon size={18} />
                <span>{TAB_LABELS[tab]}</span>
              </button>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <Button variant="ghost" fullWidth icon={<IconLogOut size={16} />} onClick={onLogout}>
            Sign out
          </Button>
        </div>
      </aside>
    </>
  );
}

type AppShellProps = {
  sidebar: ReactNode;
  children: ReactNode;
  onMenuToggle: () => void;
};

export function AppShell({ sidebar, children, onMenuToggle }: AppShellProps) {
  return (
    <div className="app-shell">
      {sidebar}
      <div className="app-main">
        <button type="button" className="mobile-menu-btn" onClick={onMenuToggle} aria-label="Open menu">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="4" y1="12" x2="20" y2="12" />
            <line x1="4" y1="6" x2="20" y2="6" />
            <line x1="4" y1="18" x2="20" y2="18" />
          </svg>
        </button>
        <div className="app-content">{children}</div>
      </div>
    </div>
  );
}
