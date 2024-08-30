package main

import (
	"fmt"
	"log"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
)

type Todo struct {
	ID        int    `json:"id"`
	Title     string `json:"title"`
	Done bool   `json:"done"`
	Body string `json:"body"`
}


func main() {
	fmt.Println("Hello, World!")

	app	:= fiber.New()
	app.Use(cors.New(cors.Config{
		AllowOrigins: "http://localhost:5173",
		AllowHeaders: "Origin, Content-Type, Accept",
	}))

	todos := []Todo{}

	app.Get("/healthcheck", func(c *fiber.Ctx) error {
		return c.SendString("OK MOM")
	})

	app.Post("/api/todos", func(c *fiber.Ctx) error {
			todo := &Todo{}
			if err := c.BodyParser(todo); err != nil {
				return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
					"error": true,
					"message": "Cannot parse JSON",
				})
			}
			todo.ID = len(todos) + 1
			todos = append(todos, *todo)
			return c.JSON(todo)
	})

	app.Patch("/api/todos/:id/done", func(c *fiber.Ctx) error {
		id, err := c.ParamsInt("id")
		if err != nil {
			return c.Status(401).SendString("Cannot get id")
		}	
		for i, todo := range todos {
			if todo.ID == id {
				todos[i].Done = !todo.Done
				break
			}
		}	
		return c.JSON(todos)
	})


	app.Get("/api/todos", func(c *fiber.Ctx) error {
		return c.JSON(todos)
	})

	log.Fatal(app.Listen(":4000"))

}