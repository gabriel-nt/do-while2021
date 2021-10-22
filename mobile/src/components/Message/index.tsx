import React from 'react';
import { MotiView } from 'moti';
import { Text, View } from 'react-native';

import { UserPhoto } from '../UserPhoto';

import { styles } from './styles';

export interface MessageProps {
  id: string;
  text: string;
  user: {
    name: string;
    avatar_url: string;
  };
}

interface Props {
  data: MessageProps;
}

export function Message({ data }: Props) {
  return (
    <MotiView
      style={styles.container}
      transition={{ type: 'timing', duration: 700 }}
      from={{ opacity: 0, translateY: -50 }}
      animate={{ opacity: 1, translateY: 0 }}
    >
      <Text style={styles.message}>{data.text}</Text>

      <View style={styles.footer}>
        <UserPhoto size="SMALL" imageUri={data.user.avatar_url} />

        <Text style={styles.userName}>{data.user.name}</Text>
      </View>
    </MotiView>
  );
}
