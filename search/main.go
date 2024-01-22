package main

import (
	"search/consumer"
	"search/mongodb"
)

func main() {
	mongodb.ConnectToMongoDB()

	consumer.Consumer()
}
