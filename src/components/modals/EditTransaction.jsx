import React, { useEffect, useState } from "react";
import {
  Modal,
  Form,
  Input,
  DatePicker,
  Select,
  Button,
} from "antd";
import moment from "moment";

function EditTransaction({
  isVisible,
  handleCancel,
  transactionToEdit,
  onSave,
}) {
  const [form] = Form.useForm();
  const [tags, setTags] = useState(["food", "education", "office"]); // Predefined tags

  const handleAddCustomTag = (newTag) => {
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag]);
    }
  };



  useEffect(() => {
    if (transactionToEdit) {
      form.setFieldsValue({
        name: transactionToEdit.name,
        amount: transactionToEdit.amount,
        date: moment(transactionToEdit.date),
        tag: transactionToEdit.tag,
      });
    }
  }, [transactionToEdit, form]);

  return (
    <Modal
      style={{ fontWeight: 600 }}
      title="Edit Transaction"
      open={isVisible}
      onCancel={handleCancel}
      footer={null}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={(values) => {
            // Include the transaction ID and pass the updated data
            const updatedTransaction = {
            ...transactionToEdit,  // Retain existing data
            ...values,  // Overwrite with form values
            date: moment(values.date).format("YYYY-MM-DD"),  // Format the date
            };
            onSave(transactionToEdit.id, updatedTransaction);  // Call onSave with ID and updated data
            form.resetFields();  // Reset form fields after saving
        }}
    >

        <Form.Item
          style={{ fontWeight: 600 }}
          label="Name"
          name="name"
          rules={[{ required: true, message: "Please input the name!" }]}
        >
          <Input type="text" className="custom-input" />
        </Form.Item>
        <Form.Item
          style={{ fontWeight: 600 }}
          label="Amount"
          name="amount"
          rules={[{ required: true, message: "Please input the amount!" }]}
        >
          <Input type="number" className="custom-input" />
        </Form.Item>
        <Form.Item
          style={{ fontWeight: 600 }}
          label="Date"
          name="date"
          rules={[{ required: true, message: "Please select the date!" }]}
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
                <div style={{ display: "flex", alignItems: "center", padding: 8 }}>
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
            Save Changes
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default EditTransaction;
