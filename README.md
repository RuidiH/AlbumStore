# album_store


### Example API usage

## Health Check

```
http://localhost:3001/test-db
```


## Albums

GET

```
curl -X GET http://localhost:3001/albums
```

POST (thumnail optional)
```
curl -X POST http://localhost:3001/albums \
  -H "Content-Type: application/json" \
  -d '{"title": "My Album", "thumbnail_url": "http://example.com/thumb.png"}'
```

PUT
```
curl -X PUT http://localhost:3001/albums/1 \
  -H "Content-Type: application/json" \
  -d '{"title": "Updated Title", "thumbnail_url": "http://example.com/updated.png"}'
```

DELETE
```
curl -X DELETE http://localhost:3001/albums/1
```

### Tracks

PUT
```
curl -X POST http://localhost:3001/tracks/1 \
  -H "Content-Type: application/json" \
  -d '{"youtube_link": "https://youtu.be/example"}'
```

Delete
```
curl -X DELETE http://localhost:3001/tracks/1/1
```