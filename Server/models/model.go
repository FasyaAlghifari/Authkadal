package models

import (
	"time"

	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	Username string `json:"username" gorm:"unique"`
	Password string `json:"password"`
	Email    string `json:"email"`
	Role     string `json:"role"`
}


type Sag struct {
	gorm.Model
	Tanggal time.Time
	NoMemo  string
	Perihal string
	Pic     string
}

type Memo struct {
	gorm.Model
	Tanggal time.Time
	NoMemo  string
	Perihal string
	Pic     string
}

type Iso struct {
	gorm.Model
	Tanggal time.Time
	NoMemo  string
	Perihal string
	Pic     string
}
type Event struct {
    ID     int     `json:"id"`
    Title  string  `json:"title"`
    Start  string  `json:"start"`
    End    *string `json:"end,omitempty"`
    AllDay bool    `json:"allDay"`
}