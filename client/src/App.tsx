import { Box, List, ThemeIcon } from "@mantine/core";
import { CheckCircleFillIcon } from "@primer/octicons-react";
import useSWR from "swr";
import "./App.css";
import AddTodo from "./components/AddTodo.tsx";
import { createTheme, MantineProvider } from "@mantine/core";

const theme = createTheme({});

export interface Todo {
  id: number;
  title: string;
  body: string;
  done: boolean;
}

export const ENDPOINT = "http://localhost:4000";

const fetcher = (url: string) =>
  fetch(`${ENDPOINT}/${url}`).then((r) => r.json());

function App() {
  const { data, mutate } = useSWR<Todo[]>("api/todos", fetcher);
  console.log("Current data:", data);

  async function markTodoAdDone(id: number) {
    try {
      const updated = await fetch(`${ENDPOINT}/api/todos/${id}/done`, {
        method: "PATCH",
      }).then((r) => r.json());

      console.log("Updated todo:", updated);
      mutate();
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  }

  return (
    <MantineProvider theme={theme}>
      <List spacing="xs" size="sm" mb={12} center>
        {Array.isArray(data) ? (
          data.map((todo) => (
            <List.Item
              onClick={() => markTodoAdDone(todo.id)}
              key={`todo_list__${todo.id}`}
              icon={
                <ThemeIcon
                  color={todo.done ? "teal" : "gray"} // Color updates based on done status
                  size={24}
                  radius="xl"
                >
                  <CheckCircleFillIcon size={20} />
                </ThemeIcon>
              }
            >
              <Box>
                <Box mb={4}>{todo.title}</Box>
                {todo.done && (
                  <Box mb={4} ml={8} color="gray">
                    Done
                  </Box>
                )}
              </Box>
              {/* {todo.body && (
                <Box mt={4} color="gray">
                  {todo.body}
                </Box>
              )} */}
            </List.Item>
          ))
        ) : (
          <div>No todos available</div>
        )}
      </List>

      <AddTodo mutate={mutate} />
    </MantineProvider>
  );
}

export default App;
