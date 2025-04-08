import React, { useState } from 'react';
import { Table, Button, Input, Card, Tag, Modal, Form, Select, Switch, Divider, message } from 'antd';
import { 
  PlusOutlined, 
  RobotOutlined, 
  EditOutlined, 
  DeleteOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { Search } = Input;
const { TextArea } = Input;
const { Option } = Select;

interface Agent {
  id: string;
  name: string;
  description: string;
  model: string;
  instruction: string;
  knowledgeBase: string[];
  isPublic: boolean;
  createdAt: string;
}

const AgentPage: React.FC = () => {
  const [loading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  
  // 模拟智能体数据
  const [agentList, setAgentList] = useState<Agent[]>([
    {
      id: '1',
      name: '通用助手',
      description: '能够回答各种常见问题的智能体',
      model: 'gpt-3.5-turbo',
      instruction: '你是一个通用助手，能够回答用户各种问题。',
      knowledgeBase: [],
      isPublic: true,
      createdAt: '2023-05-01',
    },
    {
      id: '2',
      name: '法律顾问',
      description: '专注于法律领域的智能体',
      model: 'gpt-4',
      instruction: '你是一个法律顾问，专门回答与法律相关的问题。',
      knowledgeBase: ['公司政策文档', '常见问题解答'],
      isPublic: true,
      createdAt: '2023-05-10',
    },
    {
      id: '3',
      name: '技术支持',
      description: '提供技术问题解答的智能体',
      model: 'gpt-3.5-turbo',
      instruction: '你是一个技术支持助手，专门回答技术问题。',
      knowledgeBase: ['产品说明书', '常见问题解答'],
      isPublic: false,
      createdAt: '2023-05-15',
    },
  ]);
  
  // 表格列定义
  const columns: ColumnsType<Agent> = [
    {
      title: '智能体名称',
      dataIndex: 'name',
      key: 'name',
      render: (text) => (
        <div className="flex items-center">
          <RobotOutlined className="mr-2 text-blue-500" />
          <span className="font-medium">{text}</span>
        </div>
      ),
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: '模型',
      dataIndex: 'model',
      key: 'model',
      render: (model) => (
        <Tag color={model.includes('4') ? 'green' : 'blue'}>
          {model}
        </Tag>
      ),
    },
    {
      title: '关联知识库',
      dataIndex: 'knowledgeBase',
      key: 'knowledgeBase',
      render: (knowledgeBases: string[]) => (
        <>
          {knowledgeBases.length === 0 ? (
            <span className="text-gray-400">无</span>
          ) : (
            knowledgeBases.map((kb) => (
              <Tag key={kb} className="mr-1 mb-1">
                {kb}
              </Tag>
            ))
          )}
        </>
      ),
    },
    {
      title: '公开状态',
      dataIndex: 'isPublic',
      key: 'isPublic',
      render: (isPublic) => (
        <Tag color={isPublic ? 'green' : 'gray'}>
          {isPublic ? '公开' : '私有'}
        </Tag>
      ),
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
            onClick={() => message.info(`编辑智能体: ${record.name}`)}
          >
            编辑
          </Button>
          <Button 
            type="text" 
            danger 
            size="small" 
            icon={<DeleteOutlined />}
            onClick={() => message.info(`删除智能体: ${record.name}`)}
          >
            删除
          </Button>
        </div>
      ),
    },
  ];
  
  // 处理搜索
  const handleSearch = (value: string) => {
    // 实际项目中这里会调用API进行搜索
    console.log('搜索智能体:', value);
  };
  
  // 处理新建智能体
  const handleCreateAgent = (values: any) => {
    console.log('Form values:', values);
    
    // 模拟添加新智能体
    const newAgent: Agent = {
      id: (agentList.length + 1).toString(),
      name: values.name,
      description: values.description,
      model: values.model,
      instruction: values.instruction,
      knowledgeBase: values.knowledgeBase || [],
      isPublic: values.isPublic,
      createdAt: new Date().toISOString().split('T')[0],
    };
    
    setAgentList([...agentList, newAgent]);
    setModalVisible(false);
    form.resetFields();
    message.success('智能体创建成功');
  };
  
  return (
    <div className="h-full flex flex-col">
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-xl font-bold">智能体管理</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setModalVisible(true)}
        >
          新建智能体
        </Button>
      </div>
      
      <Divider className="my-2" />
      
      <div className="mb-4">
        <Search
          placeholder="搜索智能体"
          allowClear
          enterButton
          onSearch={handleSearch}
          className="max-w-md"
        />
      </div>
      
      <Card className="flex-1 overflow-hidden">
        <Table
          columns={columns}
          dataSource={agentList}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          loading={loading}
        />
      </Card>
      
      {/* 新建智能体模态框 */}
      <Modal
        title="新建智能体"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={700}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleCreateAgent}
          initialValues={{ model: 'gpt-3.5-turbo', isPublic: true }}
        >
          <Form.Item
            name="name"
            label="智能体名称"
            rules={[{ required: true, message: '请输入智能体名称' }]}
          >
            <Input placeholder="请输入智能体名称" />
          </Form.Item>
          
          <Form.Item
            name="description"
            label="描述"
            rules={[{ required: true, message: '请输入智能体描述' }]}
          >
            <Input placeholder="请输入智能体描述" />
          </Form.Item>
          
          <Form.Item
            name="model"
            label="模型"
            rules={[{ required: true, message: '请选择模型' }]}
          >
            <Select>
              <Option value="gpt-3.5-turbo">GPT-3.5-Turbo</Option>
              <Option value="gpt-4">GPT-4</Option>
            </Select>
          </Form.Item>
          
          <Form.Item
            name="instruction"
            label="系统指令"
            rules={[{ required: true, message: '请输入系统指令' }]}
          >
            <TextArea 
              placeholder="输入给模型的系统指令，用于定义智能体的行为和专业领域" 
              rows={4} 
            />
          </Form.Item>
          
          <Form.Item
            name="knowledgeBase"
            label="关联知识库"
          >
            <Select
              mode="multiple"
              placeholder="选择关联的知识库"
              style={{ width: '100%' }}
            >
              <Option value="公司政策文档">公司政策文档</Option>
              <Option value="产品说明书">产品说明书</Option>
              <Option value="常见问题解答">常见问题解答</Option>
            </Select>
          </Form.Item>
          
          <Form.Item
            name="isPublic"
            label="公开状态"
            valuePropName="checked"
          >
            <Switch checkedChildren="公开" unCheckedChildren="私有" />
          </Form.Item>
          
          <Form.Item className="text-right mb-0">
            <Button className="mr-2" onClick={() => setModalVisible(false)}>
              取消
            </Button>
            <Button type="primary" htmlType="submit">
              创建
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AgentPage; 