import React, { useState } from 'react';
import { Table, Button, Input, Card, Tag, Modal, Form, Divider, message } from 'antd';
import { 
  PlusOutlined, 
  FileTextOutlined, 
  FileExcelOutlined, 
  FilePdfOutlined,
  DeleteOutlined,
  EditOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { Search } = Input;

interface KnowledgeBase {
  id: string;
  name: string;
  description: string;
  documentCount: number;
  documentTypes: string[];
  updatedAt: string;
  createdBy: string;
}

const KnowledgePage: React.FC = () => {
  const [loading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  
  // 模拟知识库数据
  const [knowledgeList, setKnowledgeList] = useState<KnowledgeBase[]>([
    {
      id: '1',
      name: '公司政策文档',
      description: '包含公司各项政策、规章制度等文档',
      documentCount: 24,
      documentTypes: ['PDF', 'DOCX'],
      updatedAt: '2023-05-01',
      createdBy: '管理员',
    },
    {
      id: '2',
      name: '产品说明书',
      description: '各类产品的使用说明和技术文档',
      documentCount: 15,
      documentTypes: ['PDF', 'XLSX', 'TXT'],
      updatedAt: '2023-05-10',
      createdBy: '管理员',
    },
    {
      id: '3',
      name: '常见问题解答',
      description: '用户常见问题及解答文档',
      documentCount: 42,
      documentTypes: ['TXT', 'DOCX'],
      updatedAt: '2023-05-15',
      createdBy: '管理员',
    },
  ]);
  
  // 获取文件图标
  const getFileIcon = (type: string) => {
    switch (type.toUpperCase()) {
      case 'PDF':
        return <FilePdfOutlined style={{ color: '#f5222d' }} />;
      case 'XLSX':
        return <FileExcelOutlined style={{ color: '#52c41a' }} />;
      case 'TXT':
      case 'DOCX':
      default:
        return <FileTextOutlined style={{ color: '#1890ff' }} />;
    }
  };
  
  // 表格列定义
  const columns: ColumnsType<KnowledgeBase> = [
    {
      title: '知识库名称',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <span className="font-medium">{text}</span>,
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: '文档数量',
      dataIndex: 'documentCount',
      key: 'documentCount',
      sorter: (a, b) => a.documentCount - b.documentCount,
    },
    {
      title: '文档类型',
      dataIndex: 'documentTypes',
      key: 'documentTypes',
      render: (types: string[]) => (
        <>
          {types.map((type) => (
            <Tag icon={getFileIcon(type)} key={type} className="mr-1 mb-1">
              {type}
            </Tag>
          ))}
        </>
      ),
    },
    {
      title: '更新时间',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      sorter: (a, b) => new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime(),
    },
    {
      title: '创建者',
      dataIndex: 'createdBy',
      key: 'createdBy',
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
            onClick={() => message.info(`编辑知识库: ${record.name}`)}
          >
            编辑
          </Button>
          <Button 
            type="text" 
            danger 
            size="small" 
            icon={<DeleteOutlined />}
            onClick={() => message.info(`删除知识库: ${record.name}`)}
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
    console.log('搜索知识库:', value);
  };
  
  // 处理新建知识库
  const handleCreateKnowledge = (values: any) => {
    console.log('Form values:', values);
    
    // 模拟添加新知识库
    const newKnowledge: KnowledgeBase = {
      id: (knowledgeList.length + 1).toString(),
      name: values.name,
      description: values.description,
      documentCount: 0,
      documentTypes: [],
      updatedAt: new Date().toISOString().split('T')[0],
      createdBy: '管理员',
    };
    
    setKnowledgeList([...knowledgeList, newKnowledge]);
    setModalVisible(false);
    form.resetFields();
    message.success('知识库创建成功');
  };
  
  return (
    <div className="h-full flex flex-col">
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-xl font-bold">知识库管理</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setModalVisible(true)}
        >
          新建知识库
        </Button>
      </div>
      
      <Divider className="my-2" />
      
      <div className="mb-4">
        <Search
          placeholder="搜索知识库"
          allowClear
          enterButton
          onSearch={handleSearch}
          className="max-w-md"
        />
      </div>
      
      <Card className="flex-1 overflow-hidden">
        <Table
          columns={columns}
          dataSource={knowledgeList}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          loading={loading}
        />
      </Card>
      
      {/* 新建知识库模态框 */}
      <Modal
        title="新建知识库"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleCreateKnowledge}
        >
          <Form.Item
            name="name"
            label="知识库名称"
            rules={[{ required: true, message: '请输入知识库名称' }]}
          >
            <Input placeholder="请输入知识库名称" />
          </Form.Item>
          
          <Form.Item
            name="description"
            label="描述"
            rules={[{ required: true, message: '请输入知识库描述' }]}
          >
            <Input.TextArea placeholder="请输入知识库描述" rows={4} />
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

export default KnowledgePage; 