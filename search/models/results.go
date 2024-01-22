package models

import (
	"context"
	"time"

	"go.mongodb.org/mongo-driver/bson"

	"search/googlesearch"
	"search/mongodb"
)

func InsertResults(results []googlesearch.SearchResults) error {
	var documents []interface{}
	currentTime := time.Now()

	for _, r := range results {
		document := bson.M{
			"createdAt": currentTime,
			"updatedAt": currentTime,

			"title":   r.Title,
			"link":    r.Link,
			"snippet": r.Snippet,
			"keyword": r.KeyWord,
		}

		documents = append(documents, document)
	}

	_, err := mongodb.Collection.InsertMany(context.Background(), documents)
	if err != nil {
		return err
	}
	return nil
}

func GetAllResults() ([]googlesearch.SearchResults, error) {
	var results []googlesearch.SearchResults

	cursor, err := mongodb.Collection.Find(context.Background(), bson.D{})
	if err != nil {
		return nil, err
	}
	defer cursor.Close(context.Background())

	for cursor.Next(context.Background()) {
		var result googlesearch.SearchResults
		err := cursor.Decode(&result)
		if err != nil {
			return nil, err
		}
		results = append(results, result)
	}

	if err := cursor.Err(); err != nil {
		return nil, err
	}

	return results, nil
}
