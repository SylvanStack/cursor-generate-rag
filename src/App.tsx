import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/lib/locale/zh_CN';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './models';

// 导入页面组件
import LoginPage from './pages/login';
import ChatPage from './pages/chat';
import KnowledgePage from './pages/knowledge';
import AgentPage from './pages/agent';
import UserManagePage from './pages/userManage';
import MainLayout from './layouts/MainLayout';

// 导入自定义钩子和工具
import { useAppSelector } from './hooks/useRedux';

// 认证组件
const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { token } = useAppSelector((state) => state.user);
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  return <MainLayout>{children}</MainLayout>;
};

// App组件
const App: React.FC = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ConfigProvider locale={zhCN}>
          <Router>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route 
                path="/chat" 
                element={
                  <PrivateRoute>
                    <ChatPage />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/knowledge" 
                element={
                  <PrivateRoute>
                    <KnowledgePage />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/agent" 
                element={
                  <PrivateRoute>
                    <AgentPage />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/user" 
                element={
                  <PrivateRoute>
                    <UserManagePage />
                  </PrivateRoute>
                } 
              />
              <Route path="/" element={<Navigate to="/chat" replace />} />
            </Routes>
          </Router>
        </ConfigProvider>
      </PersistGate>
    </Provider>
  );
};

export default App;
