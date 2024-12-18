import React, { useState } from "react";
import {
  Card,
  Col,
  Row,
  Button,
  Modal,
  Form,
  Input,
  DatePicker,
  Select,
} from "antd";

function AddExpenseModal({
  isExpenseModalVisible,
  handleExpenseCancel,
  onFinish,
}) {
  const [form] = Form.useForm();
  const [tags, setTags] = useState(["food", "education", "office"]); // Predefined tags

  const handleAddCustomTag = (newTag) => {
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag]);
    }
  };

  return (
    <Modal
      style={{ fontWeight: 600 }}
      title="Add Expense"
      open={isExpenseModalVisible}
      onCancel={handleExpenseCancel}
      footer={null}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={(values) => {
          onFinish(values, "expense");
          form.resetFields();
        }}
      >
        <Form.Item
          style={{ fontWeight: 600 }}
          label="Name"
          name="name"
          rules={[
            {
              required: true,
              message: "Please input the name of the transaction!",
            },
          ]}
        >
          <Input type="text" className="custom-input" />
        </Form.Item>
        <Form.Item
          style={{ fontWeight: 600 }}
          label="Amount"
          name="amount"
          rules={[
            { required: true, message: "Please input the expense amount!" },
          ]}
        >
          <Input type="number" className="custom-input" />
        </Form.Item>
        <Form.Item
          style={{ fontWeight: 600 }}
          label="Date"
          name="date"
          rules={[
            { required: true, message: "Please select the expense date!" },
          ]}
        >
          <DatePicker className="custom-input" format="YYYY-MM-DD" />
        </Form.Item>
        <Form.Item
          label="Tag"
          name="tag"
          style={{ fontWeight: 600 }}
          rules={[{ required: true, message: "Please select a tag!" }]}
        >
          <Select
            className="select-input-2"
            placeholder="Select or add a tag"
            dropdownRender={(menu) => (
              <>
                {menu}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: 8,
                  }}
                >
                  <Input
                    placeholder="Add custom tag"
                    onPressEnter={(e) => {
                      handleAddCustomTag(e.target.value);
                      e.target.value = "";
                    }}
                    style={{ flex: "auto", marginRight: 8 }}
                  />
                  <Button
                    type="primary"
                    onClick={(e) => {
                      const input = e.target.previousSibling;
                      handleAddCustomTag(input.value);
                      input.value = "";
                    }}
                  >
                    Add
                  </Button>
                </div>
              </>
            )}
          >
            {tags.map((tag) => (
              <Select.Option key={tag} value={tag}>
                {tag}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item>
          <Button className="btn btn-blue" type="primary" htmlType="submit">
            Add Expense
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default AddExpenseModal;
