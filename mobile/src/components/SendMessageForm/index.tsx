import React, { useState } from 'react';

import { Alert, Keyboard, TextInput, View } from 'react-native';
import { api } from '../../services/api';
import { COLORS } from '../../theme';
import { Button } from '../Button';

import { styles } from './styles';

export function SendMessageForm() {
  const [message, setMessage] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);

  const handleMessageSubmit = async () => {
    const messageFormatted = message.trim();

    if (messageFormatted.length > 0) {
      setSendingMessage(true);

      await api.post('/messages', {
        message: messageFormatted,
      });

      setMessage('');
      Keyboard.dismiss();
      setSendingMessage(false);
      Alert.alert('Mensagem enviada com sucesso!');
    } else {
      Alert.alert('Escreva alguma mensagem para enviar!');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        multiline
        value={message}
        maxLength={140}
        style={styles.input}
        editable={!sendingMessage}
        keyboardAppearance="dark"
        onChangeText={setMessage}
        placeholder="Qual sua expectativa para o evento?"
        placeholderTextColor={COLORS.GRAY_PRIMARY}
      />

      <Button
        title="ENVIAR MENSAGEM"
        isLoading={sendingMessage}
        backgroundColor={COLORS.PINK}
        color={COLORS.WHITE}
        onPress={handleMessageSubmit}
      />
    </View>
  );
}
