import React, { useState, useEffect } from 'react';
import CatalogManager from '../../components/CatalogManager';
import { catalogConfigs, catalogGroups } from '../../config/catalogConfigs';

const CatalogosPage = () => {
  const [activeGroup, setActiveGroup] = useState(catalogGroups[0]?.key);
  const [active, setActive] = useState(
    catalogConfigs.find((cfg) => cfg.group === catalogGroups[0]?.key)?.key,
  );

  useEffect(() => {
    const first = catalogConfigs.find((cfg) => cfg.group === activeGroup);
    setActive(first?.key);
  }, [activeGroup]);

  const groupConfigs = catalogConfigs.filter((cfg) => cfg.group === activeGroup);

  return (
    <div className="p-4">
      <div className="border-b mb-4 flex flex-wrap">
        {catalogGroups.map((grp) => (
          <button
            key={grp.key}
            onClick={() => setActiveGroup(grp.key)}
            className={`px-4 py-2 -mb-px border-b-2 transition-colors ${
              activeGroup === grp.key
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500'
            }`}
          >
            {grp.title}
          </button>
        ))}
      </div>
      <div className="border-b mb-4 flex flex-wrap">
        {groupConfigs.map((cfg) => (
          <button
            key={cfg.key}
            onClick={() => setActive(cfg.key)}
            className={`px-4 py-2 -mb-px border-b-2 transition-colors ${
              active === cfg.key
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500'
            }`}
          >
            {cfg.title}
          </button>
        ))}
      </div>
      {groupConfigs.map((cfg) => (
        <div key={cfg.key} className={active === cfg.key ? 'block' : 'hidden'}>
          <CatalogManager {...cfg} />
        </div>
      ))}
    </div>
  );
};

export default CatalogosPage;
