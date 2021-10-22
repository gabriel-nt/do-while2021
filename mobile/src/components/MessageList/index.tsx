import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { ScrollView } from 'react-native';

import { api } from '../../services/api';
import { MESSAGES_EXAMPLE } from '../../utils/messages';
import { Message, MessageProps } from '../Message';

import { styles } from './styles';

let messagesQueue: MessageProps[] = MESSAGES_EXAMPLE;
const socket = io(String(api.defaults.baseURL));

socket.on('new_message', new_message => {
  messagesQueue.push(new_message);
});

export function MessageList() {
  const [currentMessages, setCurrentMessages] = useState<MessageProps[]>([]);

  useEffect(() => {
    const loadMessages = async () => {
      const response = await api.get<MessageProps[]>('/messages/last3');

      setCurrentMessages(response.data);
    };

    loadMessages();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      if (messagesQueue.length > 0) {
        setCurrentMessages(prevState => [
          messagesQueue[0],
          prevState[0],
          prevState[1],
        ]);

        messagesQueue.shift();
      }
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  return (
    <ScrollView
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="never"
      style={styles.container}
    >
      {currentMessages.map(message => (
        <Message data={message} key={message.id} />
      ))}
    </ScrollView>
  );
}
