package initializers

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

type ConfigStruct struct {
	JWTSecret string
}

var Config ConfigStruct

func LoadConfig() {
	err := godotenv.Load()
	if err != nil {
		log.Fatalf("Error loading .env file")
	}

	Config = ConfigStruct{
		JWTSecret: os.Getenv("JWT_SECRET"),
	}
}