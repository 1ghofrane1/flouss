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

function AddIncomeModal({
  isIncomeModalVisible,
  handleIncomeCancel,
  onFinish,
}) {
  const [form] = Form.useForm();
  const [tags, setTags] = useState(["salary", "freelance", "investment"]); // Predefined tags

  const handleAddCustomTag = (newTag) => {
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag]);
    }
  };

  return (
    <Modal
      style={{ fontWeight: 600}}
      title="Add Income"
      open={isIncomeModalVisible}
      onCancel={handleIncomeCancel}
      footer={null}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={(values) => {
          onFinish(values, "income");
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
            { required: true, message: "Please input the income amount!" },
          ]}
        >
          <Input type="number" className="custom-input" />
        </Form.Item>
        <Form.Item
          style={{ fontWeight: 600 }}
          label="Date"
          name="date"
          rules={[
            { required: true, message: "Please select the income date!" },
          ]}
        >
          <DatePicker format="YYYY-MM-DD" className="custom-input" />
        </Form.Item>
        <Form.Item
          style={{ fontWeight: 600 }}
          label="Tag"
          name="tag"
          rules={[{ required: true, message: "Please select or input a tag!" }]}
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
            Add Income
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default AddIncomeModal;
