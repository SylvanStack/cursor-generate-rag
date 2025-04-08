import React, { useState } from 'react';
import { Input, Button, Card, Avatar, List, Divider, Select } from 'antd';
import { SendOutlined, UserOutlined, RobotOutlined } from '@ant-design/icons';

interface Message {
  id: string;
  content: string;
  type: 'user' | 'ai';
  timestamp: number;
}

const ChatPage: React.FC = () => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: '您好！我是您的AI助手，请问有什么可以帮您的？',
      type: 'ai',
      timestamp: Date.now(),
    },
  ]);
  
  const handleSend = () => {
    if (!input.trim()) return;
    
    // 添加用户消息
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      type: 'user',
      timestamp: Date.now(),
    };
    
    setMessages([...messages, userMessage]);
    setInput('');
    setLoading(true);
    
    // 模拟AI响应
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `您好，我已收到您的消息："${input}"。这是一个模拟的响应，在实际应用中会调用后端API并返回真实的AI回复。`,
        type: 'ai',
        timestamp: Date.now(),
      };
      
      setMessages(prev => [...prev, aiMessage]);
      setLoading(false);
    }, 1000);
  };
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
  
  return (
    <div className="h-full flex flex-col">
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-xl font-bold">对话</h2>
        <Select 
          defaultValue="default" 
          style={{ width: 180 }} 
          options={[
            { value: 'default', label: '默认AI助手' },
            { value: 'knowledge', label: '知识库增强' },
            { value: 'agent', label: '自定义智能体' },
          ]}
        />
      </div>
      
      <Divider className="my-2" />
      
      <Card className="flex-1 overflow-hidden flex flex-col mb-4">
        <div className="flex-1 overflow-y-auto pr-2 mb-2">
          <List
            itemLayout="horizontal"
            dataSource={messages}
            renderItem={(message) => (
              <List.Item className={`mb-4 ${message.type === 'user' ? 'justify-end' : ''}`}>
                <div className={`flex max-w-3xl ${message.type === 'user' ? 'flex-row-reverse' : ''}`}>
                  <Avatar
                    icon={message.type === 'user' ? <UserOutlined /> : <RobotOutlined />}
                    className={`${message.type === 'user' ? 'ml-3' : 'mr-3'} ${
                      message.type === 'user' ? 'bg-blue-500' : 'bg-gray-300'
                    }`}
                  />
                  <div
                    className={`p-3 rounded-lg ${
                      message.type === 'user'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              </List.Item>
            )}
          />
        </div>
        
        <div className="flex mt-auto">
          <Input.TextArea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="输入您的问题..."
            autoSize={{ minRows: 1, maxRows: 3 }}
            disabled={loading}
            className="mr-2"
          />
          <Button
            type="primary"
            icon={<SendOutlined />}
            onClick={handleSend}
            loading={loading}
          >
            发送
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default ChatPage; 