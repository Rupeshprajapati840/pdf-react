import React, { useState } from 'react';
import { Tabs as BootstrapTabs, Tab } from 'react-bootstrap';

export interface TabItem {
  key: string;
  title: React.ReactNode;
  content: React.ReactNode;
}

export interface TabsProps {
  items: TabItem[];
  defaultActiveKey?: string;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({ items, defaultActiveKey, className }) => {
  const [activeKey, setActiveKey] = useState(defaultActiveKey || items[0].key);

  return (
    <BootstrapTabs
      activeKey={activeKey}
      onSelect={(k) => k && setActiveKey(k)}
      className={className}
    >
      {items.map((item) => (
        <Tab key={item.key} eventKey={item.key} title={item.title}>
          {item.content}
        </Tab>
      ))}
    </BootstrapTabs>
  );
};

Tabs.displayName = 'Tabs';