package main

import (
	"project-gin/controllers"
	"project-gin/initializers"
	"project-gin/middleware"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func init() {
	initializers.LoadEnvVariables()
	initializers.ConnectToDB()
	initializers.LoadConfig()
}

func main() {
	r := gin.Default()

	// Konfigurasi CORS
	config := cors.DefaultConfig()
	config.AllowOrigins = []string{"http://localhost:8000"} // Izinkan hanya dari port 8000
	config.AllowCredentials = true
	config.AddAllowHeaders("Authorization")

	r.Use(cors.New(config))

	// Routes for User
	r.POST("/login", controllers.Login)
	r.POST("/register", controllers.Register)
	// r.GET("/user-role", func(c *gin.Context) {
	// 	// Mendapatkan ID pengguna dari query parameter
	// 	userID, ok := c.GetQuery("id")
	// 	if !ok {
	// 		c.JSON(http.StatusBadRequest, gin.H{"error": "User ID is required"})
	// 		return
	// 	}

	// 	// Konversi ID ke integer
	// 	id, err := strconv.Atoi(userID)
	// 	if err != nil {
	// 		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid User ID"})
	// 		return
	// 	}

	// 	// Temukan peran berdasarkan ID
	// 	role, exists := users[id]
	// 	if !exists {
	// 		fmt.Println("User not found for ID:", id)
	// 		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
	// 		return
	// 	}

	// 	// Kirimkan data peran pengguna
	// 	c.JSON(http.StatusOK, gin.H{"role": role})
	// })

	// // Add a route for "/"
	// r.GET("/", func(c *gin.Context) {
	// 	c.JSON(http.StatusOK, gin.H{
	// 		"message": "Welcome to the IT Security App",
	// 	})
	// })

	// Group routes that require authentication
	protected := r.Group("/sag")
	protected.Use(middleware.AuthMiddleware("admin")) // Hanya 'admin' yang bisa mengakses
	{
		// Routes for SAG
		protected.GET("/", controllers.SagIndex)
		protected.POST("/", controllers.CreateSag)
		protected.GET("/:id", controllers.PostsShow)
		protected.PUT("/:id", controllers.PostsUpdate)
		protected.DELETE("/:id", controllers.PostsDelete)
		protected.GET("/export", controllers.CreateExcelSag)
		protected.POST("/upload", controllers.ImportExcelSag)
	}

	// Other routes that do not require authentication
	r.GET("/updateAll", controllers.UpdateAllExcelSheets)
	r.GET("/exportAll", controllers.ExportAllSheets)

	// Middleware autentikasi
	authMiddleware := func(c *gin.Context) {
		// Logika untuk memeriksa token atau sesi pengguna
		token := c.GetHeader("Authorization")
		if token == "" {
			c.JSON(401, gin.H{"error": "Unauthorized"})
			c.Abort()
			return
		}
		// Logika untuk memvalidasi token
		// Jika valid, lanjutkan
		c.Next()
	}

	// Terapkan middleware hanya pada rute /sag
	r.GET("/sag", authMiddleware, controllers.SagIndex)

	r.Run(":8080")
}
