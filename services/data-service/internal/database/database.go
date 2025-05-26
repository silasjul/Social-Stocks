package database

import (
	"database/sql"
	"fmt"
	"log"
	"os"
	"time"

	_ "github.com/lib/pq"
	"github.com/silasjul/TradeSocial/services/scraping-data-service/internal/models"
)

func CreateConnection() (*sql.DB, error) {
	// Get database url
	connStr := os.Getenv("DATABASE_URL")
	if connStr == "" {
		log.Println("DATABASE_URL environment variable is not set")
		connStr = "postgres://postgres:admin@localhost:5432/tradesocial?sslmode=disable"
	}

	// Create connection
	db, err := sql.Open("postgres", connStr)
	if err != nil {
		return nil, err
	}

	// Verify connection
	err = db.Ping()
	if err != nil {
		db.Close()
		return nil, err
	} else {
		log.Println("Database connected succesfully.")
	}

	return db, nil
}

func InitTables(db *sql.DB) error {
	schemaSQL := `
	CREATE TABLE IF NOT EXISTS people (
		id SERIAL PRIMARY KEY,
		profile_name VARCHAR NOT NULL,
		username VARCHAR UNIQUE NOT NULL,
		description_text TEXT NOT NULL, 
		img_url VARCHAR NOT NULL
	);
	
	CREATE TABLE IF NOT EXISTS posts (
        id SERIAL PRIMARY KEY,
        person_id INTEGER NOT NULL,
        text TEXT NOT NULL,
        time TIMESTAMP UNIQUE NOT NULL,
        comments BIGINT DEFAULT -1,
        retweets BIGINT DEFAULT -1,
        likes BIGINT DEFAULT -1,
        views BIGINT DEFAULT -1,

        FOREIGN KEY (person_id) REFERENCES people(id)
	);`

	_, err := db.Exec(schemaSQL)
	if err != nil {
		return fmt.Errorf("error initializing tables: %v", err)
	}

	log.Println("created all tables.")
	return nil
}

func DeleteAllTables(db *sql.DB) error {
	
	deleteAllSql := `
		DROP SCHEMA public CASCADE;
		CREATE SCHEMA public;
	`

	_, err := db.Exec(deleteAllSql)
	if err != nil {
		return fmt.Errorf("error deleting all tables: %v", err)
	}

	log.Println("deleted all tables.")
	return nil
}

func AddPerson(db *sql.DB, profileName string, username string, description string, imgURL string) error {
	addPersonSQL := `
		INSERT INTO people (profile_name, username, description_text, img_url)
		VALUES ($1, $2, $3, $4)
	`
	_, err := db.Exec(addPersonSQL, profileName, username, description, imgURL)
	if err != nil {
		return fmt.Errorf("error inserting '%s' to people: %v", profileName, err)
	}

	log.Printf("inserted person name='%s', username='%s' into people", profileName, username)
	return nil
}

func AddPost(db *sql.DB, personID int, text string, time time.Time, comments int, retweets int, likes int, views int ) error {
	addPostSQL := `
		INSERT INTO posts (person_id, text, time, comments, retweets, likes, views)
		VALUES ($1, $2, $3, $4, $5, $6, $7)
	`
	_, err := db.Exec(addPostSQL, personID, text, time, comments, retweets, likes, views)
	if err != nil {
		return fmt.Errorf("error inserting post '%s': %v", text, err)
	}
	if len(text) > 30 {
		text = text[:30] + "..."
	}
	log.Printf("inserted post text='%s' into posts", text)
	return nil
}

func GetAllPosts(db *sql.DB) ([]models.Post, error) {
	rows, err := db.Query(`
		SELECT /* By not using * to select we insure the values are in this order */
			id,
            person_id,
            text, 
            time,
            views,
            comments,
            likes,
            retweets FROM posts`)
	if err != nil {
		return nil, fmt.Errorf("error fetching posts: %v", err)
	}
	defer rows.Close()

	posts := []models.Post{}
	for rows.Next() {
		var post models.Post
		if err := rows.Scan(
			&post.ID,
			&post.PersonID,
			&post.Text,
			&post.Time,
			&post.Views,
			&post.Comments,
			&post.Likes,
			&post.Retweets,
		); err != nil {
			return nil, fmt.Errorf("error scanning rows: %v", err)
		}
		posts = append(posts, post)
	}

	return posts, nil
}

func GetPostsByUsername(db *sql.DB, personID int) ([]models.Post, error) {
	rows, err := db.Query(`
		SELECT /* By not using * to select we insure the values are in this order */
			id,
            person_id,
            text, 
            time,
            views,
            comments,
            likes,
            retweets FROM posts WHERE person_id = ($1)`, personID)
	if err != nil {
		return nil, fmt.Errorf("error fetching posts: %v", err)
	}
	defer rows.Close()

	posts := []models.Post{}
	for rows.Next() {
		var post models.Post
		if err := rows.Scan(
			&post.ID,
			&post.PersonID,
			&post.Text,
			&post.Time,
			&post.Views,
			&post.Comments,
			&post.Likes,
			&post.Retweets,
		); err != nil {
			return nil, fmt.Errorf("error scanning rows: %v", err)
		}
		posts = append(posts, post)
	}

	return posts, nil
}

func GetAllPeople(db *sql.DB) ([]models.Person, error) {
	rows, err := db.Query(`
		SELECT id, profile_name, description_text, username, img_url FROM people
	`)
	if err != nil {
		return nil, fmt.Errorf("error fetching people: %v", err)
	}

	people := []models.Person{}
	for rows.Next() {
		var person models.Person

		err = rows.Scan(
			&person.ID,
			&person.ProfileName,
			&person.DescriptionText,
			&person.Username,
			&person.ImgURL,
		)
		if err != nil {
			return nil, fmt.Errorf("error scanning people: %v", err)
		}

		people = append(people, person)
	}

	return people, nil
}

func Test() {
	// Get db connection
	db, err := CreateConnection()
	if err != nil {
		log.Fatalf("Error creating db connection: %v", err)
	}
	defer db.Close()

	// Init tables
	if err = DeleteAllTables(db); err != nil {
		log.Fatal(err)
	}
	if err = InitTables(db); err != nil {
		log.Fatal(err)
	}

	// Try create methods
	if err = AddPerson(db, "Naughty boy", "@boii", "I am a naughty boy", "https://picture.com"); err != nil {
		log.Fatal(err)
	}
	if err = AddPost(db, 1, "IM A NAGHTY BOY awksjldhkaljwghdkljaghwlkdegalkwjgdkljawgdkjagwlkdjg", time.Now(), 10000, 1000, 102031, 100000000); err != nil {
		log.Fatal(err)
	}

	// Try read methods
	posts, err := GetAllPosts(db)
	if err != nil {
		log.Fatal(err)
	}
	log.Println(posts)
	posts, err = GetPostsByUsername(db, 1)
	if err != nil {
		log.Fatal(err)
	}
	log.Println(posts)
	people, err := GetAllPeople(db)
	if err != nil {
		log.Fatal(err)
	}
	log.Println(people)
}