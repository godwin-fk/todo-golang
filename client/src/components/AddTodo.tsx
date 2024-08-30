import { useState } from "react";
import { Button, Modal, Group, TextInput, Textarea } from "@mantine/core";
import { ENDPOINT, Todo } from "../App";
import { KeyedMutator } from "swr";

function AddTodo({ mutate }: { mutate: KeyedMutator<Todo[]> }) {
  const [open, setOpen] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    body: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setFormData({ title: "", body: "" });
  };

  async function createTodo(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      const values = formData;
      const updated = await fetch(`${ENDPOINT}/api/todos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      }).then((r) => r.json());

      mutate(updated);
      resetForm();
      setOpen(false);
    } catch (error) {
      console.error("Error creating todo:", error);
    }
  }

  return (
    <>
      <form className="form-container" onSubmit={createTodo}>
        <div className="form-group" style={{ marginBottom: "16px" }}>
          <label htmlFor="title">Todo</label>
          <input
            size={50}
            // width={30}
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="What do you want to do?"
            required
          />
        </div>

        {/* <div className="form-group" style={{ marginBottom: "16px" }}>
          <label htmlFor="body">Body</label>
          <textarea
            id="body"
            name="body"
            value={formData.body}
            onChange={handleInputChange}
            placeholder="Tell me more..."
            required
          />
        </div> */}

        <Button style={{ margin: 12 }} type="submit">
          ADD TODO
        </Button>
      </form>

      {/* <Group>
        <Button fullWidth m={12} onClick={() => setOpen(true)}>
          ADD TODO
        </Button>
      </Group> */}
    </>
  );
}

export default AddTodo;
