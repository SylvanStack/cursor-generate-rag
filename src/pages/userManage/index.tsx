import React, { useState } from 'react';
import { Table, Button, Input, Card, Tag, Modal, Form, Select, Divider, Switch, message } from 'antd';
import { 
  PlusOutlined, 
  UserOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  LockOutlined,
  MailOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { Search } = Input;
const { Option } = Select;

interface User {
  id: string;
  username: string;
  name: string;
  email: string;
  role: string;
  enabled: boolean;
  lastLogin: string;
  createdAt: string;
}

const UserManagePage: React.FC = () => {
  const [loading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  
  // 模拟用户数据
  const [userList, setUserList] = useState<User[]>([
    {
      id: '1',
      username: 'admin',
      name: '管理员',
      email: 'admin@example.com',
      role: 'admin',
      enabled: true,
      lastLogin: '2023-05-15 08:30:00',
      createdAt: '2023-01-01',
    },
    {
      id: '2',
      username: 'user1',
      name: '张三',
      email: 'zhangsan@example.com',
      role: 'user',
      enabled: true,
      lastLogin: '2023-05-14 14:20:00',
      createdAt: '2023-02-15',
    },
    {
      id: '3',
      username: 'user2',
      name: '李四',
      email: 'lisi@example.com',
      role: 'user',
      enabled: false,
      lastLogin: '2023-04-20 10:15:00',
      createdAt: '2023-03-10',
    },
  ]);
  
  // 表格列定义
  const columns: ColumnsType<User> = [
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
      render: (text) => (
        <div className="flex items-center">
          <UserOutlined className="mr-2 text-blue-500" />
          <span className="font-medium">{text}</span>
        </div>
      ),
    },
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: '角色',
      dataIndex: 'role',
      key: 'role',
      render: (role) => (
        <Tag color={role === 'admin' ? 'gold' : 'blue'}>
          {role === 'admin' ? '管理员' : '普通用户'}
        </Tag>
      ),
      filters: [
        { text: '管理员', value: 'admin' },
        { text: '普通用户', value: 'user' },
      ],
      onFilter: (value, record) => record.role === value,
    },
    {
      title: '状态',
      dataIndex: 'enabled',
      key: 'enabled',
      render: (enabled) => (
        <Tag color={enabled ? 'green' : 'red'}>
          {enabled ? '启用' : '禁用'}
        </Tag>
      ),
      filters: [
        { text: '启用', value: true },
        { text: '禁用', value: false },
      ],
      onFilter: (value, record) => record.enabled === value,
    },
    {
      title: '最后登录',
      dataIndex: 'lastLogin',
      key: 'lastLogin',
      sorter: (a, b) => new Date(a.lastLogin).getTime() - new Date(b.lastLogin).getTime(),
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      sorter: (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <div className="flex space-x-2">
          <Button 
            type="text" 
            size="small" 
            icon={<EditOutlined />}
            onClick={() => message.info(`编辑用户: ${record.username}`)}
          >
            编辑
          </Button>
          {record.username !== 'admin' && (
            <Button 
              type="text" 
              danger 
              size="small" 
              icon={<DeleteOutlined />}
              onClick={() => message.info(`删除用户: ${record.username}`)}
            >
              删除
            </Button>
          )}
        </div>
      ),
    },
  ];
  
  // 处理添加用户
  const handleCreateUser = (values: any) => {
    console.log('Form values:', values);
    
    // 模拟添加新用户
    const newUser: User = {
      id: (userList.length + 1).toString(),
      username: values.username,
      name: values.name,
      email: values.email,
      role: values.role,
      enabled: values.enabled,
      lastLogin: '-',
      createdAt: new Date().toISOString().split('T')[0],
    };
    
    setUserList([...userList, newUser]);
    setModalVisible(false);
    form.resetFields();
    message.success('用户创建成功');
  };
  
  // 处理搜索
  const handleSearch = (value: string) => {
    // 实际项目中这里会调用API进行搜索
    console.log('搜索用户:', value);
  };
  
  return (
    <div className="h-full flex flex-col">
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-xl font-bold">用户管理</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setModalVisible(true)}
        >
          添加用户
        </Button>
      </div>
      
      <Divider className="my-2" />
      
      <div className="mb-4">
        <Search
          placeholder="搜索用户"
          allowClear
          enterButton
          onSearch={handleSearch}
          className="max-w-md"
        />
      </div>
      
      <Card className="flex-1 overflow-hidden">
        <Table
          columns={columns}
          dataSource={userList}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          loading={loading}
        />
      </Card>
      
      {/* 添加用户模态框 */}
      <Modal
        title="添加用户"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleCreateUser}
          initialValues={{ role: 'user', enabled: true }}
        >
          <Form.Item
            name="username"
            label="用户名"
            rules={[
              { required: true, message: '请输入用户名' },
              { pattern: /^[a-zA-Z0-9_]{4,16}$/, message: '用户名为4-16位字母、数字或下划线' }
            ]}
          >
            <Input prefix={<UserOutlined />} placeholder="请输入用户名" />
          </Form.Item>
          
          <Form.Item
            name="name"
            label="姓名"
            rules={[{ required: true, message: '请输入姓名' }]}
          >
            <Input placeholder="请输入姓名" />
          </Form.Item>
          
          <Form.Item
            name="email"
            label="邮箱"
            rules={[
              { required: true, message: '请输入邮箱' },
              { type: 'email', message: '请输入有效的邮箱地址' }
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="请输入邮箱" />
          </Form.Item>
          
          <Form.Item
            name="password"
            label="密码"
            rules={[
              { required: true, message: '请输入密码' },
              { min: 6, message: '密码长度不能小于6位' }
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="请输入密码" />
          </Form.Item>
          
          <Form.Item
            name="role"
            label="角色"
            rules={[{ required: true, message: '请选择角色' }]}
          >
            <Select placeholder="请选择角色">
              <Option value="admin">管理员</Option>
              <Option value="user">普通用户</Option>
            </Select>
          </Form.Item>
          
          <Form.Item
            name="enabled"
            label="状态"
            valuePropName="checked"
          >
            <Switch checkedChildren="启用" unCheckedChildren="禁用" />
          </Form.Item>
          
          <Form.Item className="text-right mb-0">
            <Button className="mr-2" onClick={() => setModalVisible(false)}>
              取消
            </Button>
            <Button type="primary" htmlType="submit">
              添加
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserManagePage; 