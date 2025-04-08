import React, { useEffect } from 'react';
import { Form, Input, Button, Checkbox, Card, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux';
import { loginAsync, clearLoginError } from '../../models/user';
import { LoginParams } from '../../interface/user';

const LoginPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, loginError, token } = useAppSelector((state) => state.user);
  
  // 如果已经登录，直接跳转到首页
  useEffect(() => {
    if (token) {
      navigate('/chat');
    }
  }, [token, navigate]);
  
  // 处理登录错误信息
  useEffect(() => {
    if (loginError) {
      message.error(loginError);
      dispatch(clearLoginError());
    }
  }, [loginError, dispatch]);
  
  // 处理登录提交
  const onFinish = (values: LoginParams) => {
    dispatch(loginAsync(values));
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            数据检索增强生成系统
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            登录您的账号
          </p>
        </div>
        
        <Card className="mt-8 shadow-lg rounded-lg">
          <Form
            name="login"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            size="large"
            className="space-y-6"
          >
            <Form.Item
              name="username"
              rules={[{ required: true, message: '请输入用户名!' }]}
            >
              <Input 
                prefix={<UserOutlined className="site-form-item-icon" />} 
                placeholder="用户名" 
              />
            </Form.Item>
            
            <Form.Item
              name="password"
              rules={[{ required: true, message: '请输入密码!' }]}
            >
              <Input.Password
                prefix={<LockOutlined className="site-form-item-icon" />}
                type="password"
                placeholder="密码"
              />
            </Form.Item>
            
            <Form.Item>
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>记住密码</Checkbox>
              </Form.Item>
              
              <a className="float-right text-blue-600 hover:text-blue-800" href="#">
                忘记密码?
              </a>
            </Form.Item>
            
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="w-full"
                loading={loading}
              >
                登录
              </Button>
            </Form.Item>
            
            <div className="text-center text-sm">
              <span className="text-gray-600">测试账号: </span>
              <span className="text-gray-900 font-medium">admin</span>
              <span className="text-gray-600"> / 密码: </span>
              <span className="text-gray-900 font-medium">admin123</span>
            </div>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage; 