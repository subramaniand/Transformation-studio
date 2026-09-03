/**
 * Tabs Component - Tab navigation
 */
import { useState, useEffect } from 'react';

export default function Tabs({
  tabs = [],
  defaultActive = 0,
  onChange,
  variant = 'line',
}) {
  const [activeIndex, setActiveIndex] = useState(Math.max(0, defaultActive));

  // Update activeIndex when defaultActive changes
  useEffect(() => {
    const newIndex = Math.max(0, defaultActive);
    setActiveIndex(newIndex);
  }, [defaultActive]);

  const handleChange = (index) => {
    setActiveIndex(index);
    onChange?.(tabs[index]);
  };

  const activeTab = tabs[activeIndex];
  const renderContent = () => {
    if (!activeTab) return null;
    // If tab has a render function, call it to get dynamic content
    if (typeof activeTab.render === 'function') {
      return activeTab.render();
    }
    // Otherwise use static content
    return activeTab.content;
  };

  return (
    <div>
      <div style={{
        display: 'flex',
        gap: variant === 'pills' ? '8px' : '0',
        borderBottom: variant === 'line' ? '1px solid var(--bd)' : 'none',
        flexWrap: 'wrap',
      }}>
        {tabs.map((tab, index) => (
          <button
            key={tab.id || index}
            onClick={() => handleChange(index)}
            style={{
              padding: variant === 'pills' ? '6px 12px' : '12px 16px',
              background: activeIndex === index ?
                (variant === 'pills' ? 'var(--ac)' : 'transparent') :
                (variant === 'pills' ? 'var(--bg3)' : 'transparent'),
              color: activeIndex === index ?
                (variant === 'pills' ? '#fff' : 'var(--ac)') :
                'var(--tx2)',
              border: variant === 'pills' ? '1px solid var(--bd)' : 'none',
              borderBottom: variant === 'line' && activeIndex === index ?
                '2px solid var(--ac)' :
                'none',
              borderRadius: variant === 'pills' ? '6px' : '0',
              fontSize: '13px',
              fontWeight: activeIndex === index ? '600' : '500',
              cursor: 'pointer',
              transition: '0.2s',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div style={{ paddingTop: variant === 'line' ? '16px' : '0' }}>
        {renderContent()}
      </div>
    </div>
  );
}
