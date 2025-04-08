import React, { useState } from 'react';
import { Layout, Menu, Button, Avatar, Dropdown } from 'antd';
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined,
  MessageOutlined,
  DatabaseOutlined,
  RobotOutlined,
  TeamOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/useRedux';
import { logout } from '../models/user';

const { Header, Sider, Content } = Layout;

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const { userInfo } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // 处理登出
  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  // 用户下拉菜单
  const userMenu = (
    <Menu>
      <Menu.Item key="profile" icon={<UserOutlined />}>
        个人信息
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
        退出登录
      </Menu.Item>
    </Menu>
  );

  // 确定当前选中的菜单项
  const getSelectedKeys = () => {
    const path = location.pathname;
    if (path.startsWith('/chat')) return ['chat'];
    if (path.startsWith('/knowledge')) return ['knowledge'];
    if (path.startsWith('/agent')) return ['agent'];
    if (path.startsWith('/user')) return ['user'];
    return [];
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider trigger={null} collapsible collapsed={collapsed} theme="light">
        <div className="logo p-4 h-16 flex items-center justify-center bg-gray-100">
          <h1 className={`text-xl font-bold text-blue-600 ${collapsed ? 'hidden' : 'block'}`}>
            RAG系统
          </h1>
          {collapsed && <span className="text-2xl font-bold text-blue-600">R</span>}
        </div>
        <Menu
          theme="light"
          mode="inline"
          selectedKeys={getSelectedKeys()}
        >
          <Menu.Item key="chat" icon={<MessageOutlined />}>
            <Link to="/chat">对话</Link>
          </Menu.Item>
          <Menu.Item key="knowledge" icon={<DatabaseOutlined />}>
            <Link to="/knowledge">知识库</Link>
          </Menu.Item>
          <Menu.Item key="agent" icon={<RobotOutlined />}>
            <Link to="/agent">智能体</Link>
          </Menu.Item>
          {userInfo?.role === 'admin' && (
            <Menu.Item key="user" icon={<TeamOutlined />}>
              <Link to="/user">用户管理</Link>
            </Menu.Item>
          )}
        </Menu>
      </Sider>
      <Layout>
        <Header className="bg-white p-0 px-4 flex justify-between items-center shadow-sm">
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            className="text-lg"
          />
          <div className="flex items-center">
            <Dropdown overlay={userMenu} placement="bottomRight">
              <div className="flex items-center cursor-pointer">
                <Avatar 
                  src={userInfo?.avatar} 
                  icon={<UserOutlined />} 
                  className="mr-2"
                />
                <span className="mr-2">{userInfo?.name || 'User'}</span>
              </div>
            </Dropdown>
          </div>
        </Header>
        <Content className="m-4 p-4 bg-white rounded-lg">
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout; 