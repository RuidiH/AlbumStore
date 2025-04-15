# album_store

## Local Setup

### Frontend

in ./client

```
npm start
```

### Backend

in ./server

```
node index.js
```

### S3

```
docker run --rm -it -p 4566:4566 -p 4572:4572 localstack/localstack

awslocal s3api create-bucket --bucket test-bucket --region us-west-2 --create-bucket-configuration LocationConstraint=us-west-2
```

## Example API usage

### Health Check

```
http://localhost:3001/test-db
```

### Albums

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
