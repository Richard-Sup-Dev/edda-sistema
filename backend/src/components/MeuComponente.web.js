// src/components/MeuComponente.web.js

import React from 'react';

const MeuComponente = ({ children, style }) => {

  const webStyle = style; 

  return <span style={webStyle}>{children}</span>;
};

export default MeuComponente;