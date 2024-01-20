# Please follow below steps to run this app in Kubernetes environment

Note: Please ensure you are in the root directory while executing the below commands

## Step 1: Docker Login, image creation, tagging and pushing it to docker hub
```
## Docker hub URL
https://hub.docker.com/repository/docker/surajkishor/nodeapp/general

docker login
docker build -t surajkishor/amcart-be:<tag> .
docker push surajkishor/amcart-be --all-tags
or a specific tag
docker push surajkishor/amcart-be:<tag>
```
# access app on below URL
```
http://localhost:3000 //Home page
http://localhost:3000/products //For getting products
```


