package controllers

import (
	"net/http"
	"project-gin/initializers"
	"project-gin/models"

	"github.com/gin-gonic/gin"
)

func GetEvents(c *gin.Context) {
	var events []models.Event
	if err := initializers.DB.Find(&events).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, events)
}

func CreateEvent(c *gin.Context) {
	var e models.Event
	if err := c.ShouldBindJSON(&e); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := initializers.DB.Create(&e).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, e)
}

func DeleteEvent(c *gin.Context) {
	id := c.Param("id")
	if err := initializers.DB.Delete(&models.Event{}, id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.Status(http.StatusNoContent)
}
