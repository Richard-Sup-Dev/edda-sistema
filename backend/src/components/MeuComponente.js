// src/components/MeuComponente.js

import React from 'react';
import { Text } from 'react-native';

const MeuComponente = ({ children, style }) => {
  return <Text style={style}>{children}</Text>;
};

export default MeuComponente;