import React from 'react';
import { AntDesign } from '@expo/vector-icons';

import {
  Text,
  ColorValue,
  TouchableOpacity,
  ActivityIndicator,
  TouchableOpacityProps,
} from 'react-native';

import { styles } from './styles';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  icon?: React.ComponentProps<typeof AntDesign>['name'];
  color: ColorValue;
  isLoading?: boolean;
  backgroundColor: ColorValue;
}

export function Button({
  title,
  color,
  icon,
  backgroundColor,
  isLoading = false,
  ...rest
}: ButtonProps) {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor,
        },
      ]}
      activeOpacity={0.7}
      disabled={isLoading}
      {...rest}
    >
      {isLoading ? (
        <ActivityIndicator color={color} size="large" />
      ) : (
        <>
          <AntDesign name={icon} size={24} style={styles.icon} />
          <Text
            style={[
              styles.title,
              {
                color,
              },
            ]}
          >
            {title}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
}
