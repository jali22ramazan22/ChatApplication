## Branch
- It's a branch for developing only.
- If it's needed to add some refactoring, new features and so one
- It's the first branch you'd better to consider
## Virtualizing
- This container also working with virtualizing with docker that allows you to run it independently of OS you're using
- However, it does not provide any distinct databases like mariaDB container, so it stores the sqllite db inside of itself.
- Thus, any changes in db will be removed as soon as container shuts down 


## TODO:
- Dockerize and add new layer 'Redis' to run inside Python layer the Redis

# To run the server
```c 
docker build -t chatapp_backend_dev && docker run -d chatapp_backenddev
```
