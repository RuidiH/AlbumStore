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


## Minikube Related



```
minikube start
```

running the first time

````
eval $(minikube docker-env)

docker build -t album-app:local .

kubectl apply -f albums-schema-cm.yaml
kubectl apply -f postgres.yaml
kubectl apply -f localstack.yaml
kubectl apply -f init-s3-bucket.yaml
kubectl apply -f album-env.yaml
kubectl apply -f deployment.yaml
kubectl apply -f service.yaml
````

tunnel to loadbalancer
```
minikube tunnel --bind-address 0.0.0.0
```

restart album app
````
kubectl rollout restart deployment album-app-deployment
````

check pod status
````
kubectl get pods
````

check service status
```
kubectl get svc
```
access app
```
minikube ip
curl http://$(minikube ip):30080/
```

auto-scale
```
kubectl autoscale deployment album-app-deployment \
  --cpu-percent=50 \
  --min=1 \
  --max=5
```

edit specs
```
kubectl edit hpa album-app-deployment
```

monitor HPA
```
kubectl get hpa -w
```

kill and restart postgres
```
kubectl delete pod -l app=postgres
```

port-forwarding from minikube to 3001 in localhost:

```
kubectl port-forward svc/album-app-service 3001:80
```

reapply s3 init job
```
kubectl delete job init-s3-bucket
kubectl apply -f init-s3-bucket.yaml
```


## Preliminary Results
(using auto-scaling rule specified in the command above)
get album id = 1
post same album
post same image
### max 1 replicas
CPU 442%/50%
POST /upload  121.1 tps
POST /album   145.3 tps
GET  /albums  151.8 tps
total         386.5 tps

### max 5 replicas
CPU 167%/50%
POST /upload  158.5 tps
POST /album   188.7 tps
GET  /albums  195.6 tps
total         475.5 tps